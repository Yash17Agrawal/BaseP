from abc import ABC, abstractmethod
from core.entities.customer import Customer


class CustomerRepositoryInterface(ABC):
    @abstractmethod
    def get_by_id(self, user_id: int) -> Customer:
        """Retrieve a customer by its ID"""
        pass
