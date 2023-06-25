from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('item/', views.getItems, name='item'),
    path('category/', views.getCategories, name='category'),
    path('register/', views.UserRegistrationView.as_view(), name='user-registration'),
    path('update-profile/', views.ProfileUpdateView.as_view(), name='profile-update'),
    path('orders/', views.OrderViewApi.as_view(), name='orders'),
    path('get-orders/', views.get_orders, name='get-orders'),
    path('get-users/', views.get_users, name='get-users'),
    path('vendor/', views.ChangeUserRoleView.as_view(), name='vendor'),
    path('active/', views.ChangeUserActiveStatusView.as_view(), name='active'),
    path('stripe/', views.StripeViewApi.as_view(), name='stripe'),
    path('address/', views.getAddress, name='address'),
    path('favorites/', views.get_favorite_items, name='favorites'),
    path('create-favorite/', views.CreateFavoriteItemView.as_view(), name='create-favorite'),
    path('modify-item/', views.ModifyItemView.as_view(), name='modify-item'),
    path('delete-item/<int:item_id>/', views.delete_item, name='delete-item'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('search-item/', views.search_item, name='search-item'),
    path('orders/<int:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    path('modify-password/', views.modify_password, name="modify-password"),
    path('user/profile/', views.user_profile, name='user-profile'),
]