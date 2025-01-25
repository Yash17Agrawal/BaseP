from rest_framework.serializers import ModelSerializer, ValidationError

from store.models import Category, Product


class CategorySerializer(ModelSerializer):
    class Meta:
        model = Category
        fields = [
            'id',
            'name'
        ]


class ProductSerializer(ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Product
        fields = ["name", "price", "description", "category", "is_active"]


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
        if not any(attrs.values()):
            raise ValidationError(
                "At least one parameter must be provided.")
        return attrs
