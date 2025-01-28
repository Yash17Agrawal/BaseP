from core.entities.customer import Customer
from core.interfaces.customer_repository import CustomerRepositoryInterface


class CustomerService:
    def __init__(self, customer_repository: CustomerRepositoryInterface):
        self.customer_repository = customer_repository

    def get_by_id(self, user_id: int) -> Customer:
        customer = self.customer_repository.get_by_id(user_id)
        if customer is None:
            raise ValueError(f"Customer with ID {user_id} does not exist.")
        # return product.__dict__
        return customer
