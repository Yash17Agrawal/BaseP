from django.db import models

from core.models import BaseModel
from store.models import Order, Vendor

# Create your models here.


class Payment(BaseModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="payments")
    vendor = models.ForeignKey(
        Vendor, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("SUCCESS", "Success"),
        ("FAILED", "Failed"),
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING")

    def __str__(self):
        return f"Payment #{self.id} for Order #{self.order.id}"
