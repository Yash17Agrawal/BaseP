from abc import ABC, abstractmethod
from core.entities.product import Product


class ProductRepositoryInterface(ABC):
    @abstractmethod
    def save(self, vendor_id: int, product: Product):
        """Save a product to the repository"""
        pass

    @abstractmethod
    def get_by_id(self, product_id: int) -> Product:
        """Retrieve a product by its ID"""
        pass

    @abstractmethod
    def get_all(self, product_id: int) -> list[Product]:
        """Gets all products"""
        pass

    @abstractmethod
    def get_all_by_filter(self, keyword) -> list[Product]:
        """Gets all products by filter"""
        pass

    @abstractmethod
    def update(self, product_id: int):
        """Updates a product by its ID"""
        pass
