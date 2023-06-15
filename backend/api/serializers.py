from rest_framework import serializers
from supermarket.models import Item, Category, Order, OrderItem, FavoriteItem
from user.models import User, Address

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Item
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_active']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        context = self.context.get('view')

        if context == 'getUser':
            fields_to_include = ['id', 'email', 'role', 'is_active']
        elif context == "'UserRegistrationView'":
            fields_to_include = ['username', 'email', 'password']

        data = {field: data[field] for field in fields_to_include}
        return data

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['first_name', 'last_name', 'street1', 'street2', 'city', 'state', 'zipcode']

class ProfileUpdateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=False)
    address = AddressSerializer(required=False)  

    class Meta:
        model = User
        fields = ['username', 'email', 'address']

    def update(self, instance, validated_data):
        address_data = validated_data.pop('address', None)
        instance = super().update(instance, validated_data)

        if address_data:
            address_serializer = self.fields['address']
            address_instance = instance.address

            address_serializer.update(address_instance, address_data)

        return instance

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'

class FavoriteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteItem
        fields = '__all__'