from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

class UserManager(BaseUserManager):
	def create_user(self, username, email, password=None, role='client', **extra_fields):
		if not username:
			raise ValueError('A username is required.')
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		
		email = self.normalize_email(email)
		user = self.model(email=email, username=username, role=role, **extra_fields)
		user.set_password(password)
		user.save()
		return user
	
	def create_superuser(self, username, email, password=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
        
		if extra_fields.get('is_staff') is not True:
			raise ValueError('Superuser must have is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must have is_superuser=True.')
		
		role='administrator'
        
		return self.create_user(username, email, password, role, **extra_fields)
	
	def set_user_role(self, user, role):
		if role not in [r[0] for r in self.ROLE_CHOICES]:
			raise ValueError(f'Invalid role: {role}')
		user.role = role
		user.save()

class User(AbstractBaseUser, PermissionsMixin):

	ROLE_CHOICES = [
		('client', 'Client'),
		('vendor', 'Vendor'),
		('administrator', 'Administrator'),
	]

	email = models.EmailField(max_length=100, unique=True)
	username = models.CharField(max_length=100, null=True, blank=True)
	telephone = models.IntegerField(max_length=10, null=True, blank=True)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client')

	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	objects = UserManager()

	def __str__(self):
		return self.username

class Address(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	first_name = models.CharField(max_length=100, blank=True)
	last_name = models.CharField(max_length=100, blank=True)
	street1 = models.CharField(max_length=200, blank=True)
	street2 = models.CharField(max_length=200, blank=True)
	city = models.CharField(max_length=100, blank=True)
	state = models.CharField(max_length=100, blank=True)
	zipcode = models.CharField(max_length=100, blank=True)

	def __str__(self):
		return self.user.username
	
def create_user_address(sender, instance, created, **kwargs):
    if created:
        Address.objects.create(user=instance)

models.signals.post_save.connect(create_user_address, sender=User)