from django.contrib import admin

from core.models.models import Category, Customer, Order, OrderItem, Product, Shipment, Vendor


# Register your models here.
admin.site.register(Vendor)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Shipment)
