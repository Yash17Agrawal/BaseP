from decimal import Decimal


class Product:
    def __init__(self, name: str, price: float, description: str = None, is_active: bool = True, stock: int = 0):
        self.name = name
        self.price = price
        self.description = description
        self.is_active = is_active
        self.stock = stock

    @classmethod
    def from_dict(cls, data: dict):
        # Ensure price is converted to float if it's a Decimal
        if isinstance(data.get('price'), Decimal):
            data['price'] = float(data['price'])
        return cls(**data)

    def apply_discount(self, discount: float):
        self.price -= self.price * discount
