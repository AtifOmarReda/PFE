from django.contrib import admin
from .models import Item, Category, Order, OrderItem

admin.site.register(Item)
admin.site.register(Category)
admin.site.register(Order)
admin.site.register(OrderItem)