from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.db.models import Q
from django.contrib.auth.hashers import check_password, make_password

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.parsers import MultiPartParser
from .serializers import ItemSerializer, CategorySerializer, UserSerializer, ProfileUpdateSerializer, AddressSerializer, OrderSerializer

import datetime
import stripe

from supermarket.models import Item, Category, Order, OrderItem, FavoriteItem
from user.models import User

stripe.api_key = settings.STRIPE_SECRET_KEY

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)       
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data, context={'view': 'UserRegistrationView'})
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = User.objects.create_user(username=username, email=email, password=password)

            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileUpdateView(APIView):

    permission_classes = (IsAuthenticated,)

    def put(self, request, format=None):
        user = request.user
        serializer = ProfileUpdateSerializer(user, data=request.data)
        if serializer.is_valid():
            address_data = serializer.validated_data.get('address', {})
            if address_data:
                address_serializer = AddressSerializer(user.address, data=address_data)
                if address_serializer.is_valid():
                    address_serializer.save()
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StripeViewApi(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):

        products = request.data.get('products')
        line_items = []

        if products:
            for product in products:
                product_id = product['id']
                product_quantity = product['count']

                try:
                    item = Item.objects.get(id=product_id)
                except Item.DoesNotExist:
                    return Response({'message': 'Item does not exist'}, status=status.HTTP_400_BAD_REQUEST)
                
                line_items.append({
                    'price_data': {
                        'currency': 'dzd',
                        'product_data': {
                            'name': item.name,
                        },
                        'unit_amount': item.price * 100, 
                    },
                    'quantity': product_quantity,
                })

            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                customer_email=request.user.email,
                line_items=line_items,
                mode='payment',
                success_url='http://localhost:3000/checkout/success',
                cancel_url='http://localhost:3000/checkout/failure',
            )

            return Response({'id': session.id})
        else:
            return Response({'message': 'No items provided'}, status=status.HTTP_400_BAD_REQUEST)

class OrderViewApi(APIView):

    permission_classes = (IsAuthenticated, )

    def post(self, request):

        products = request.data.get('products')
        order_items = []

        if products:
            for product in products:
                product_id = product['id']
                product_quantity = product['count']

                try:
                    item = Item.objects.get(id=product_id)
                except Item.DoesNotExist:
                    return Response({'message': 'Item does not exist'}, status=status.HTTP_400_BAD_REQUEST)

                order_item = OrderItem(item=item, quantity=product_quantity)
                order_items.append(order_item)

            client = request.user
            order = Order.objects.create(client=client, address=client.address, telephone=client.telephone, date=datetime.datetime.now())
            
            for order_item in order_items:
                order_item.order = order
                order_item.save()

            return Response({'message': 'Order successfully created'},)
        else:
            return Response({'message': 'No items provided'}, status=status.HTTP_400_BAD_REQUEST)
        
class CreateFavoriteItemView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        item_id = request.data.get('itemId')

        try:
            item = Item.objects.get(id=item_id)
        except Item.DoesNotExist:
            return Response({'error': 'Invalid item or user ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        favorite_item = FavoriteItem.objects.filter(item=item, user=request.user)
        
        if favorite_item.exists():
            favorite_item.delete() 
            return Response({'message': 'Favorite item removed'}, status=status.HTTP_200_OK)
        
        new_favorite_item = FavoriteItem(item=item, user=request.user)
        new_favorite_item.save()
        
        return Response({'message': 'Favorite item created'}, status=status.HTTP_201_CREATED)

class ChangeUserActiveStatusView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)
        
        if request.user.role == "administrator":
            user.is_active = not user.is_active
            user.save()
        else:
            return Response({"message": "Not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

        return Response({"message": "User active status updated successfully."}, status=status.HTTP_200_OK)
    
class ChangeUserRoleView(APIView):
    permission_classes = (IsAuthenticated,)

    def put(self, request):
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)

        if request.user.role == "administrator":
            if user.role == 'vendor':
                if(user.is_staff):
                    user.role = 'administrator'
                else:
                    user.role = 'client'
            else:
                user.role = 'vendor'
        else:
            return Response({"message": "Not authorized"}, status=status.HTTP_401_UNAUTHORIZED)

        user.save()

        return Response({"message": "User role updated successfully."}, status=status.HTTP_200_OK)

class ModifyItemView(APIView):
    permission_classes = (IsAuthenticated,)
    parser_classes = (MultiPartParser,)

    def put(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'vendor':
            item_id = request.data.get('itemId')
            try:
                item = Item.objects.get(pk=item_id)
            except Item.DoesNotExist:
                return Response({"error": "Item not found"}, status=status.HTTP_404_NOT_FOUND)

            mutable_data = request.data.copy()

            if 'image' not in mutable_data:
                mutable_data['image'] = item.image

            item.name = request.data.get('name', item.name)
            item.category_id = request.data.get('category', item.category_id)
            item.mainCategory = request.data.get('mainCategory', item.mainCategory)
            item.price = request.data.get('price', item.price)
            image_file = request.data.get('image')
            if image_file is not None:
                item.image = image_file

            item.save()

            return Response({"success": "Item updated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request, *args, **kwargs):
        user = request.user
        if user.role == 'vendor':

            item = Item()
            item.name = request.data.get('name')
            item.category_id = request.data.get('category')
            item.mainCategory = request.data.get('mainCategory')
            item.price = request.data.get('price')
            image_file = request.data.get('image')
            if image_file is not None:
                item.image = image_file

            item.save()
            return Response({"success": "Item created successfully"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh'
    ]

    return Response(routes)

@api_view(['GET'])
def getItems(request):
    category_id = request.GET.get('category_id')
    item_id = request.GET.get('item_id')
    if category_id:
        category = get_object_or_404(Category, id=category_id)
        items = Item.objects.filter(category=category)
    elif item_id:
        items = Item.objects.filter(id=item_id)
    else:
        items = Item.objects.all()
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCategories(request):
    category_id = request.GET.get('category_id')
    if category_id:
        categories = Category.objects.filter(id=category_id)
        if not categories:
            categories = Category.objects.all()
    else:
        categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAddress(request):
    user = request.user
    address = user.address
    serializer = AddressSerializer(address)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    if(request.user.role == "administrator"):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True, context={'view': 'getUser'})
        return Response(serializer.data)
    else: 
        return Response({'message': 'Not administrator'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorite_items(request):
    favorite_items = FavoriteItem.objects.filter(user=request.user)
    item_ids = favorite_items.values_list('item', flat=True)
    items = Item.objects.filter(id__in=item_ids)
    serializer = ItemSerializer(items, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_orders(request):
    role = request.user.role

    if role == 'vendor':
        orders = Order.objects.all()
    else:
        orders = Order.objects.filter(client=request.user)
    
    serialized_data = []
    for order in orders:
        order_data = OrderSerializer(order).data
        
        order_items = OrderItem.objects.filter(order=order)
        order_item_data = []
        for order_item in order_items:
            item_data = {
                'name': order_item.item.name,
                'quantity': order_item.quantity
            }
            order_item_data.append(item_data)

        client = User.objects.get(id=order_data["client"])
        address_serializer = AddressSerializer(client.address)
        address_data = address_serializer.data

        order_data['client'] = client.email
        order_data['address'] = address_data
        order_data['phone'] = client.telephone
        order_data['order_items'] = order_item_data
        serialized_data.append(order_data)
    
    return Response(serialized_data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_item(request, item_id):
    if request.user.role != 'vendor':
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        
    try:
        item = Item.objects.get(id=item_id)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Item.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def search_item(request):
    search_query = request.GET.get('query', '')
    search_words = search_query.split()

    if search_words:
        query = Q()
        for word in search_words:
            query &= Q(name__icontains=word)

        items = Item.objects.filter(query)
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)

    return Response([])

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

    order.cancelled = True
    order.save()

    serializer = OrderSerializer(order)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def modify_password(request):
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    user = request.user

    if not check_password(old_password, user.password):
        return Response({'error': 'Incorrect old password'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()

    return Response({'success': 'Password updated'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    profile_data = {
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'telephone': user.telephone,
    }
    return Response(profile_data)