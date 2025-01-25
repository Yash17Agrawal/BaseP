from core.interfaces.product_repository import ProductRepositoryInterface
from store.models import Product
from core.entities.product import Product as ProductEntity


class ProductRepository(ProductRepositoryInterface):
    def get_by_id(self, product_id: int):
        product = Product.objects.get(id=product_id)
        # this is discouraged
        return ProductEntity(product.name, product.price)

    def get_all(self):
        return Product.objects.all()

    def save(self):
        pass
        # user_model = Product.objects.get(username=user.username)
        # user_model.email = user.email
        # user_model.save()
