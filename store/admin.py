from django.contrib import admin

from store.models import Address, Category, Customer, Order, OrderItem, Product, Shipment, Vendor
from import_export import resources
from import_export.admin import ImportExportModelAdmin


class CategoryResource(resources.ModelResource):
    class Meta:
        model = Category
        exclude = ('created_at', 'modified_at',)


class CategoryAdmin(ImportExportModelAdmin):
    resource_class = CategoryResource


# Register your models here.
admin.site.register(Vendor)
admin.site.register(Address)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product)
admin.site.register(Customer)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Shipment)
