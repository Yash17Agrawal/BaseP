from core.entities.order_item import OrderItem
from core.interfaces.order_item_repository import OrderItem
from core.interfaces.order_item_repository import OrderItemRepositoryInterface


class OrderItemService:
    def __init__(self, order_item_repository: OrderItemRepositoryInterface):
        self.order_item_repository = order_item_repository

    def get_items_by_order_id(self, order_id: int) -> list[OrderItem]:
        order_items = self.order_item_repository.get_items_by_order_id(
            order_id)
        if order_items is None:
            raise ValueError(f"Order Items with ID {order_id} does not exist.")
        return order_items

    '''
        Get total bill without discount
    '''

    @staticmethod
    def get_items_total(order_details: OrderItem) -> int:
        amount = 0
        if len(order_details) == 0:
            return 0
        for order_detail in order_details:
            amount += (order_detail.product.price * order_detail.quantity)
        return amount

    @staticmethod
    def get_delivery_charge(amount, order):
        if amount > 500 or amount == 0:
            return 0
        else:
            return order.delivery_charge

    @staticmethod
    def get_payable_amount(order_details, total_amount, check_with_coupon):
        if total_amount == 0 or len(order_details) == 0:
            return total_amount
        order_detail_obj = order_details[0]
        if check_with_coupon:
            applied_coupon = check_with_coupon
        else:
            applied_coupon = order_detail_obj.order.applied_coupon
        coupon_category_total_amount = OrderItemService.get_total_bill_for_category(
            order_details, applied_coupon)
        if applied_coupon and coupon_category_total_amount > applied_coupon.min_amount:
            percentage_discount_amount = (
                applied_coupon.percentage * coupon_category_total_amount)//100
            final_discount_amount = min(
                percentage_discount_amount, applied_coupon.max_discount)
            return (total_amount - coupon_category_total_amount) + (coupon_category_total_amount - final_discount_amount)
        return total_amount

    @staticmethod
    def get_total_bill_for_category(order_details, coupon):
        amount = 0
        if coupon:
            for order_detail in order_details:
                if order_detail.product.category == coupon.category:
                    amount += (order_detail.product.price *
                               order_detail.quantity)
        return amount

    def delete_items_by_order_id_exluding_few(self, order_id: int, item_ids_to_exclude: list[int]):
        self.order_item_repository.delete_items_by_order_id_exluding_few(
            order_id, item_ids_to_exclude)

    def get_item_by_product_id(self, id: int):
        return self.order_item_repository.get_item_by__product_id(id)

    def update_order_item(self, order_item_entity: OrderItem, **data: dict) -> None:
        self.order_item_repository.update_order_item(
            OrderItem.update_order_entity(data, order_item_entity))

    def update_order_item(self, data: dict, cart_order, user) -> None:
        # TODO: implement this method by removing the pass statement adn _update implementation in controller apis.py
        pass
