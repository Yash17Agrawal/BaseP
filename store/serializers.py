from rest_framework import serializers
from rest_framework.serializers import ModelSerializer, ValidationError

from store.models import Address, Category, Order, OrderItem, Product


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name'
        ]


class ProductSerializer(ModelSerializer):
    category = CategorySerializer()
    offer_price = serializers.CharField(source='price')

    class Meta:
        model = Product
        fields = ["name", "price", "description",
                  "category", "is_active", "id", "offer_price"]


class CreateProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "price", "description",
                  "category", "is_active", "stock"]


class PartialUpdateProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "price", "description",
                  "category", "is_active", "stock"]

    def validate(self, attrs):
        # if not any(attrs.values()):
        if not attrs:
            raise ValidationError(
                "At least one parameter must be provided.")
        return attrs


class GetOrdersSerializer(serializers.Serializer):
    page_size = serializers.IntegerField(min_value=1, max_value=100)
    page_no = serializers.IntegerField(min_value=1, max_value=100)


class GetOrderItemsBaseSerializer(ModelSerializer):
    id = serializers.IntegerField(read_only=True, source='product.id')
    name = serializers.CharField(read_only=True, source='product.name')
    # media = MediaSerializer(read_only=True, source='product.media', many=True)
    description = serializers.CharField(
        read_only=True, source='product.description')
    units_per_order = serializers.IntegerField(
        read_only=True, source='product.units_per_order')

    class Meta:
        fields = [
            'id',
            'name',
            # 'media',
            'description',
            'units_per_order',
            'quantity'
        ]
        abstract = True


class OrderAddressSerializer(ModelSerializer):

    class Meta:
        model = Address
        fields = [
            "city",
            "name",
            "address_first_line",
            "address_second_line",
            "pincode",
        ]


class GetCheckoutReviewItemsSerializer(GetOrderItemsBaseSerializer):
    offer_price = serializers.CharField(
        read_only=True, source='product.price')
    total_offer_price = serializers.SerializerMethodField(
        'get_total_offer_price')  # offer_price * quantity

    def get_total_offer_price(self, obj):
        return obj.product.price * obj.quantity

    class Meta:
        model = OrderItem
        fields = GetOrderItemsBaseSerializer.Meta.fields + [
            'offer_price',
            'total_offer_price'
        ]


class GetOrdersDataSerializer(ModelSerializer):
    delivery_address = OrderAddressSerializer()
    items = GetCheckoutReviewItemsSerializer(source='details', many=True)
    created_date = serializers.DateTimeField(source="created_at")
    modified_date = serializers.DateTimeField(source="modified_at")
    total_bill = serializers.DecimalField(
        source="total_amount", max_digits=12, decimal_places=2)

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            # "payment",
            "invoice_location",
            "created_date",
            "modified_date",
            "delivery_address",
            "delivery_charge",
            "total_bill",
            "items"
        ]


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'name'
        ]


class GetCartSerializer(ModelSerializer):
    id = serializers.IntegerField(read_only=True, source='product.id')

    class Meta:
        model = OrderItem
        fields = ['id', 'quantity']


class CreateCartSerializer(ModelSerializer):

    class Meta:
        model = OrderItem
        fields = [
            "order",
            "product",
            "quantity",
            "price"
        ]


class AddressSerializer(ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "id",
            "city",
            "kind",
            "name",
            "address_first_line",
            "address_second_line",
            "pincode",
            "phone"
        ]


class GetCheckoutReviewItemsSerializer(GetOrderItemsBaseSerializer):
    price = serializers.CharField(
        read_only=True, source='product.price')
    total_offer_price = serializers.SerializerMethodField(
        'get_total_offer_price')  # price * quantity

    def get_total_offer_price(self, obj):
        return obj.product.price * obj.quantity

    class Meta:
        model = OrderItem
        fields = GetOrderItemsBaseSerializer.Meta.fields + [
            'price',
            'total_offer_price'
        ]


class CreateAddressSerializer(ModelSerializer):
    class Meta:
        model = Address
        fields = [
            "customer",
            "city",
            "kind",
            "name",
            "phone",
            "address_first_line",
            "address_second_line",
            "pincode",
        ]
