class Product:
    def __init__(self, name: str, price: float):
        self.name = name
        self.price = price

    def apply_discount(self, discount: float):
        self.price -= self.price * discount
