from core.entities.product import Product
from core.interfaces.product_repository import ProductRepositoryInterface


class ProductService:
    def __init__(self, product_repository: ProductRepositoryInterface):
        self.product_repository = product_repository

    def create_product(self, name: str, price: float):
        product = Product(name, price)
        self.product_repository.save(product)

    def get_all_products(self):
        return self.product_repository.get_all()

    def apply_discount(self, product_id: int, discount: float):
        product = self.product_repository.get_by_id(product_id)
        product.apply_discount(discount)
        self.product_repository.save(product)

    def get_by_id(self, product_id: int):
        return self.product_repository.get_by_id(product_id)
