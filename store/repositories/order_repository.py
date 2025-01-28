import logging
from core.interfaces.order_repository import OrderRepositoryInterface
from core.entities.order import Order as OrderEntity
from django.core.exceptions import ObjectDoesNotExist

from store.models import Order
logger = logging.getLogger(__package__)


class OrderRepository(OrderRepositoryInterface):
    def get_by_id(self, customer_id: int, order_id: int):
        try:
            return self._convert_to_entity(Order.objects.get(customer=customer_id, id=order_id))
        except ObjectDoesNotExist:
            return None

    def get_pending_order(self, customer_id: int):
        try:
            return self._convert_to_entity(Order.objects.get(customer=customer_id, status=Order.PENDING))
        except ObjectDoesNotExist:
            return None
        except Order.MultipleObjectsReturned:
            logger.error(
                "Multiple cart order exist for a user, System Discrepancy Found")
            return None
    
    def update_order(self, customer_id: int, order: OrderEntity)-> None:
        pass

    def create_order(self, customer_id: int, order_data: OrderEntity | None) -> None:
        if order_data:
            self._convert_to_entity(Order.objects.create(customer=customer_id))
        else:
            return self._convert_to_entity(Order.objects.create(customer_id=customer_id))

    def _convert_to_entity(self, order: Order):
        return OrderEntity(order.id, order.customer.id, order.status, order.total_amount, order.payment, order.invoice_location, order.delivery_address, order.delivery_charge, order.applied_coupon, order.provider_order_id, order.task_id)
