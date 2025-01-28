from abc import ABC, abstractmethod

from core.entities.order import Order


class OrderRepositoryInterface(ABC):
    @abstractmethod
    def get_by_id(self, customer_id: int, order_id: int):
        """Retrieve a order by its ID for customer."""
        pass

    @abstractmethod
    def get_pending_order(self, customer_id: int):
        """Retrieve a pending order for customer."""
        pass

    @abstractmethod
    def create_order(self, customer_id: int, order_data: Order):
        """Creates order for customer from order entitt"""
        pass

    @abstractmethod
    def update_order(self, customer_id: int, order_data: Order):
        """Updates order for customer from order entitt"""
        pass
