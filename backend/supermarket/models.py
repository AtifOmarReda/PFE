from django.db import models
from user.models import User

class Category(models.Model):
    name = models.CharField(max_length=200, null=True)
    hero = models.ImageField(null=True, blank=True)
    image = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Item(models.Model):

    MAIN_CATEGORY_CHOICES = [
		('topRated', 'Top Rated'),
		('newArrivals', 'New Arrivals'),
		('bestSellers', 'Best Sellers'),
	]

    name = models.CharField(max_length=200, null=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)
    mainCategory = models.CharField(max_length=20, choices=MAIN_CATEGORY_CHOICES, default="topRated")
    price = models.IntegerField()
    image = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name
    
class Order(models.Model):
    client = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    cancelled = models.BooleanField(default=False, null=True, blank=True)
    date = models.DateField(null=True, blank=True)

    def __str__(self):
        return str(self.id)
    
class OrderItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.IntegerField(default=False, null=True, blank=True)

    def __str__(self):
        return str(self.item.name)
    
class FavoriteItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.user.name