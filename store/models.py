from django.db import models
from django.contrib.auth.models import User

from core.models import BaseModel

# Vendor Model


class Vendor(BaseModel):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="vendor")
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
    name = models.CharField(max_length=255, unique=True)
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

    def __str__(self):
        return self.user.username


class Coupon(BaseModel):
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name='coupons', null=True)
    name = models.CharField(max_length=10, blank=False, primary_key=True)
    percentage = models.DecimalField(decimal_places=2, max_digits=4)
    max_discount = models.DecimalField(decimal_places=2, max_digits=6)
    min_amount = models.DecimalField(decimal_places=2, max_digits=8)

    def __str__(self) -> str:
        return "{}".format(self.name)


class Address(BaseModel):
    HOME = 'Home'
    OFFICE = 'Office'
    KIND_CHOICES = [
        (HOME, HOME),
        (OFFICE, OFFICE)
    ]
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    city = models.CharField(max_length=10)
    kind = models.CharField(max_length=10, choices=KIND_CHOICES)
    name = models.CharField(max_length=32, blank=False, null=False)
    address_first_line = models.CharField(
        max_length=64, blank=False, null=False)
    address_second_line = models.CharField(
        max_length=64, blank=True, null=True)
    pincode = models.IntegerField(null=False, blank=False)
    phone = models.CharField(max_length=16, blank=False)

    def __str__(self) -> str:
        return "{}-{} - {}".format(self.name, self.address_first_line, self.pincode)

    class Meta:
        unique_together = ('customer', 'city', 'kind', 'name', 'pincode')


# Order Model


class Order(BaseModel):
    PENDING = "PENDING"
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="orders")
    total_amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=0)
    payment = models.DecimalField(decimal_places=2, max_digits=8, default=0)
    invoice_location = models.CharField(max_length=128, null=True, blank=False)
    delivery_address = models.ForeignKey(
        Address, on_delete=models.CASCADE, null=True, blank=True)
    delivery_charge = models.IntegerField(default=0)
    applied_coupon = models.ForeignKey(
        Coupon, on_delete=models.CASCADE, null=True, blank=True)
    STATUS_CHOICES = [
        (PENDING, "Pending"),
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELED", "Canceled"),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING")
    provider_order_id = models.CharField(max_length=128, null=True, blank=True)
    task_id = models.CharField(max_length=128, null=True, blank=True)

    def __str__(self):
        return f"Order #{self.id} by {self.customer.user.username}"

# Order Item Model


class OrderItem(BaseModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="details")
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


class GenericGroup(BaseModel):
    PINCODES = "PINCODES"
    LATEST = "LATEST"
    TOP_PICK = "TOP_PICK"
    DELIVERY_CHARGE = "Delivery_Charge"
    TYPE_CHOICES = [
        (LATEST, LATEST),
        (TOP_PICK, TOP_PICK),
        (PINCODES, PINCODES),
        (DELIVERY_CHARGE, DELIVERY_CHARGE)
    ]
    type = models.CharField(max_length=16, choices=TYPE_CHOICES, unique=True)
    data = models.JSONField()

    def __str__(self) -> str:
        return "{}".format(self.type)
