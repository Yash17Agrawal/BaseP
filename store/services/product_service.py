from core.entities.product import Product
from core.interfaces.product_repository import ProductRepositoryInterface


class ProductService:
    def __init__(self, product_repository: ProductRepositoryInterface):
        self.product_repository = product_repository

    def create_product(self, **kwargs):
        product = Product.from_dict(kwargs)
        self.product_repository.save(1, product)

    def get_by_id(self, product_id: int):
        product = self.product_repository.get_by_id(product_id)
        if product is None:
            raise ValueError(f"Product with ID {product_id} does not exist.")
        return product.__dict__

    def get_all(self):
        return self.product_repository.get_all()

    def update_product(self, product_id: int, **kwargs):
        product = Product.from_dict(
            kwargs, self.product_repository.get_by_id(product_id))
        return self.product_repository.update(product_id, product)

    # def apply_discount(self, product_id: int, discount: float):
    #     product = self.product_repository.get_by_id(product_id)
    #     product.apply_discount(discount)
    #     self.product_repository.save(product)
