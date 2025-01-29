from abc import ABC, abstractmethod

from core.entities.order_item import OrderItem


class OrderItemRepositoryInterface(ABC):
    @abstractmethod
    def get_items_by_order_id(self, order_id: int):
        """Retrieve order items by their order ID"""
        pass

    @abstractmethod
    def get_item_by_product_id(self, id: int, order_id: int):
        """Retrieve order item by product ID"""
        pass

    @abstractmethod
    def update_order_item(self, order_item_entity: OrderItem, **data: dict) -> None:
        pass

    @abstractmethod
    def delete_items_by_order_id_exluding_few(self, order_id: int, item_ids_to_exclude: list[int]):
        """Deletes order items by their order ID exclluding few"""
        pass
