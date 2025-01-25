

from store.models import Product
from core.entities.product import Product as ProductEntity


class ProductRepository:
    def get_by_id(self, user_id: int):
        user_model = Product.objects.get(id=user_id)
        return ProductEntity(user_model.username, user_model.email)

    def get_all(self):
        return Product.objects.all()

    # def save(self, user: User):
    #     user_model = Product.objects.get(username=user.username)
    #     user_model.email = user.email
    #     user_model.save()
