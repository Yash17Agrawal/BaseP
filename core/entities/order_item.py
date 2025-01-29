from decimal import Decimal

from core.entities.order import Order
from core.entities.product import Product


class OrderItem:
    def __init__(self, id: int, order_id: int, product_id: int, quantity: int, price: int, product: 'Product', order: 'Order'):
        self.id = id
        self.order_id = order_id
        self.product_id = product_id
        self.quantity = quantity
        self.price = price
        self.product = product
        self.order = order

    @classmethod
    def update_order_entity(cls, data: dict, order: 'OrderItem') -> 'OrderItem':
        for key, value in data.items():
            # Ensure price is converted to float if it's a Decimal
            if isinstance(data.get(key), Decimal):
                data[key] = float(data[key])
            setattr(order, key, value)
        return order
