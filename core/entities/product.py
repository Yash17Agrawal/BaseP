from decimal import Decimal


class Product:
    def __init__(self, name: str, price: float, vendor_id: int, description: str = None, is_active: bool = True, stock: int = 0, category_id: int = None):
        self.name = name
        self.price = price
        self.description = description
        self.is_active = is_active
        self.stock = stock
        self.vendor_id = vendor_id
        self.category_id = category_id

    @classmethod
    def from_dict_w(cls, data: dict):
        # Ensure price is converted to float if it's a Decimal
        if isinstance(data.get('price'), Decimal):
            data['price'] = float(data['price'])
        return cls(**data)

    # from_dict by providing another product entity along with kwargs which updates the product entity with the new values only
    @classmethod
    def from_dict(cls, data: dict, product: 'Product'):
        # Ensure price is converted to float if it's a Decimal
        if isinstance(data.get('price'), Decimal):
            data['price'] = float(data['price'])
        for key, value in data.items():
            setattr(product, key, value)
        return product

    def apply_discount(self, discount: float):
        self.price -= self.price * discount
