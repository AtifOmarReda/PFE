from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('item/', views.getItems),
    path('category/', views.getCategories),
    path('register/', views.UserRegistrationView.as_view(), name='user-registration'),
    path('update-profile/', views.ProfileUpdateView.as_view(), name='profile-update'),
    path('orders/', views.OrderViewApi.as_view()),
    path('get-orders/', views.get_orders),
    path('get-users/', views.get_users),
    path('vendor/', views.ChangeUserRoleView.as_view()),
    path('active/', views.ChangeUserActiveStatusView.as_view()),
    path('stripe/', views.StripeViewApi.as_view()),
    path('address/', views.getAddress),
    path('favorites/', views.get_favorite_items),
    path('create-favorite/', views.CreateFavoriteItemView.as_view()),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]