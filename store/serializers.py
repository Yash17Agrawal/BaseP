from rest_framework.serializers import ModelSerializer

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


class UpdateProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = ["name", "price", "description",
                  "category", "is_active", "stock"]
