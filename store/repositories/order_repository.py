import logging
from core.interfaces.order_repository import OrderRepositoryInterface
from core.entities.order import Order as OrderEntity
from django.core.exceptions import ObjectDoesNotExist

from store.models import Address, Order
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

    def update_order(self, customer_id: int, order: OrderEntity) -> None:
        order_model = Order.objects.get(id=order.id, customer_id=customer_id)
        order_model.applied_coupon = order.applied_coupon
        order_model.status = order.status
        order_model.provider_order_id = order.provider_order_id
        order_model.task_id = order.task_id
        order_model.status = order.status
        order_model.delivery_charge = order.delivery_charge
        order_model.invoice_location = order.invoice_location
        order_model.payment = order.payment
        order_model.total_amount = order.total_amount

        if not order_model.delivery_address or (order.delivery_address_id != order_model.delivery_address.id):
            order_model.delivery_address = Address.objects.get(
                id=order.delivery_address_id)
        order_model.save()
        return self._convert_to_entity(order_model)

    def create_order(self, customer_id: int, order_data: OrderEntity | None) -> None:
        if order_data:
            self._convert_to_entity(Order.objects.create(customer=customer_id))
        else:
            return self._convert_to_entity(Order.objects.create(customer_id=customer_id))

    def delete_pending_order(self, customer_id):
        Order.objects.filter(customer=customer_id,
                             status=Order.PENDING).delete()

    def _convert_to_entity(self, order: Order):
        return OrderEntity(order.id, order.customer.id, order.status, order.total_amount, order.payment, order.invoice_location, order.delivery_address.id if order.delivery_address else None, order.delivery_charge, order.applied_coupon, order.provider_order_id, order.task_id)
