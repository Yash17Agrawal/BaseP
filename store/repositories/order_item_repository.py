import logging
from core.interfaces.order_item_repository import OrderItemRepositoryInterface
from core.entities.order_item import OrderItem as OrderItemEntity
from django.core.exceptions import ObjectDoesNotExist

from store.models import Address, OrderItem
from store.repositories.order_repository import OrderRepository
from store.repositories.product_repository import ProductRepository
logger = logging.getLogger(__package__)

product_repository = ProductRepository()
order_repository = OrderRepository()


class OrderItemRepository(OrderItemRepositoryInterface):
    def get_items_by_order_id(self, order_id: int) -> list[OrderItemEntity] | None:
        try:
            order_items = OrderItem.objects.filter(
                order=order_id).select_related('product')
            return [self.convert_to_entity(obj) for obj in order_items]
        except ObjectDoesNotExist:
            return None

    def get_item_by_product_id(self, id: int):
        try:
            return self.convert_to_entity(OrderItem.objects.get(product__id=id))
        except ObjectDoesNotExist:
            return None
        except Order.MultipleObjectsReturned:
            logger.error(
                "Multiple cart order exist for a user, System Discrepancy Found")
            return None

    def update_order_item(self, order: OrderItemEntity) -> None:
        order_item_model = OrderItem.objects.get(id=order.id)
        order_item_model.quantity = order.quantity
        order_item_model.price = order.price
        order_item_model.save()
        return self.convert_to_entity(order_item_model)

    def create_order(self, customer_id: int, order_data: OrderItemEntity | None) -> None:
        # if order_data:
        #     self._convert_to_entity(Order.objects.create(customer=customer_id))
        # else:
        #     return self._convert_to_entity(Order.objects.create(customer_id=customer_id))
        pass

    def delete_items_by_order_id_exluding_few(self, order_id: int, item_ids_to_exclude: list[int]):
        OrderItem.objects.filter(order_id=order_id).exclude(
            product__id__in=item_ids_to_exclude).delete()

    def convert_to_entity(self, order_item: OrderItem):
        return OrderItemEntity(
            id=order_item.id,
            order_id=order_item.order.id,
            product_id=order_item.product.id,
            quantity=order_item.quantity,
            price=order_item.price,
            product=product_repository.convert_to_entity(order_item.product),
            order=order_repository.convert_to_entity(order_item.order)
        )
