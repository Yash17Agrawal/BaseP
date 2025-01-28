from decimal import Decimal


class Order:
    def __init__(self, id: int, customer_id: int, status: str, total_amount: float, payment: float, invoice_location: str, delivery_address: str, delivery_charge: int, applied_coupon: str, provider_order_id: str, task_id: str):
        self.id = id
        self.customer_id = customer_id
        self.status = status
        self.total_amount = total_amount
        self.payment = payment
        self.invoice_location = invoice_location
        self.delivery_address = delivery_address
        self.delivery_charge = delivery_charge
        self.applied_coupon = applied_coupon
        self.provider_order_id = provider_order_id
        self.task_id = task_id

    @classmethod
    def update_order_entity(cls, data: dict, order: 'Order'):
        for key, value in data.items():
            # Ensure price is converted to float if it's a Decimal
            if isinstance(data.get(key), Decimal):
                data[key] = float(data[key])
            setattr(order, key, value)
        return order
