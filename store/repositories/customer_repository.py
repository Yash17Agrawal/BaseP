from core.interfaces.customer_repository import CustomerRepositoryInterface
from core.entities.customer import Customer as CustomerEntity
from django.db.models import Q

from django.core.exceptions import ObjectDoesNotExist

from store.models import Customer


class CustomerRepository(CustomerRepositoryInterface):
    def get_by_id(self, user_id: int) -> CustomerEntity | None:
        try:
            return self._convert_to_entity(Customer.objects.get(user=user_id))
        except ObjectDoesNotExist:
            return None

    def _convert_to_entity(self, customer: Customer) -> CustomerEntity:
        return CustomerEntity(customer.user.id)
