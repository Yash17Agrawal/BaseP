from core.interfaces.product_repository import ProductRepositoryInterface
from store.models import Category, Product
from core.entities.product import Product as ProductEntity
from django.db.models import Q

from django.core.exceptions import ObjectDoesNotExist


class ProductRepository(ProductRepositoryInterface):
    def get_by_id(self, product_id: int) -> Product | None:
        try:
            return Product.objects.get(id=product_id)
        except ObjectDoesNotExist:
            return None
        # this is discouraged
        # return ProductEntity(product.name, product.price)

    def get_all(self):
        return Product.objects.all()

    def get_all_by_filter(self, keyword):
        return Product.objects.filter(Q(name__icontains=keyword) | Q(description__icontains=keyword), is_active=True)

    def save(self, product: ProductEntity):
        try:
            product_model = Product(name=product.name, price=product.price,
                                    vendor_id=product.vendor_id,
                                    description=product.description, is_active=product.is_active, stock=product.stock, category_id=product.category_id)
            product_model.save()
        except Exception as e:
            # Handle the exception (e.g., log it)
            print(f"Error saving product: {e}")
            raise ValueError("Error saving product")

        return product_model

    def convert_to_entity(self, product: Product):
        return ProductEntity(product.name, product.price, product.vendor.id, product.description, product.is_active, product.stock, product.category.id)

    def update(self, product_id: int, product: ProductEntity):
        product_model = Product.objects.get(id=product_id)
        product_model.is_active = product.is_active
        product_model.name = product.name
        product_model.price = product.price
        product_model.description = product.description
        product_model.stock = product.stock
        if product.category_id != product_model.category.id:
            product_model.category = Category.objects.get(
                id=product.category_id)
        product_model.save()
        return self._convert_to_entity(product_model)
