from core.entities.order import Order
from core.interfaces.order_repository import OrderRepositoryInterface


class OrderService:
    def __init__(self, order_repository: OrderRepositoryInterface):
        self.order_repository = order_repository

    def get_by_id(self, customer_id: int, order_id: int) -> Order:
        order = self.order_repository.get_by_id(customer_id, order_id)
        if order is None:
            raise ValueError(f"Order with ID {order_id} does not exist.")
        return order

    def get_pending_order(self, customer_id: int) -> Order:
        return self.order_repository.get_pending_order(customer_id)

    def create_pending_order(self, customer_id: int) -> Order:
        return self.order_repository.create_order(customer_id, None)

    def update_order(self, order_entity: Order, **data: dict) -> None:
        self.order_repository.update_order(
            order_entity.customer_id,
            Order.update_order_entity(data, order_entity))

    def get_cart_order_id(self, customer_id: int):
        pass
