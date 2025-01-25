from django.db import models
from django.db import models
from django.contrib.auth.models import User

from core.models.base_model import BaseModel

# Vendor Model


class Vendor(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return self.name

# Product Category Model


class Category(BaseModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    # parent = models.ForeignKey('self', null=True, blank=True,
    #                            on_delete=models.SET_NULL, related_name='subcategories')

    def __str__(self):
        return self.name

# Product Model


class Product(BaseModel):
    vendor = models.ForeignKey(
        Vendor, on_delete=models.CASCADE, related_name="products")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, related_name="products")
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    image = models.ImageField(
        upload_to="product_images/", blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

# Customer Model


class Customer(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20)
    address = models.TextField()

    def __str__(self):
        return self.user.username

# Order Model


class Order(BaseModel):
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="orders")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELED", "Canceled"),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING")

    def __str__(self):
        return f"Order #{self.id} by {self.customer.user.username}"

# Order Item Model


class OrderItem(BaseModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="order_items")
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

# Shipment Model


class Shipment(BaseModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="shipments")
    vendor = models.ForeignKey(
        Vendor, on_delete=models.CASCADE, related_name="shipments")
    tracking_number = models.CharField(
        max_length=255, unique=True, blank=True, null=True)
    shipped_at = models.DateTimeField(blank=True, null=True)
    estimated_delivery_date = models.DateTimeField(blank=True, null=True)
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("IN_TRANSIT", "In Transit"),
        ("DELIVERED", "Delivered"),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING")

    def __str__(self):
        return f"Shipment #{self.id} for Order #{self.order.id}"
