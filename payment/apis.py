import logging

from django.conf import settings

from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from django.shortcuts import get_object_or_404, redirect

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


from payment.tasks import payment_callback
from store.apis import CartAPIs, get_delivery_charge, get_items_total, get_payable_amount
from store.models import Customer, Order, OrderItem
# Create your views here.
import razorpay
from store.repositories.order_repository import OrderRepository
from store.services.order_service import OrderService

logger = logging.getLogger(__package__)

client = razorpay.Client(
    auth=(settings.RAZORPAY_ID, settings.RAZORPAY_SECRET))

order_service = OrderService(OrderRepository())


'''
    https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration/
'''


def create_order(amount, order_id, notes):
    # DATA = {
    #     "amount": 100,
    #     "currency": "INR",
    #     "receipt": "receipt#1",
    #     "notes": {
    #         "key1": "value3",
    #         "key2": "value2"
    #     }
    # }
    try:
        order = client.order.create(data={
            "amount": int(amount)*100,
            "currency": "INR",
            "receipt": str(order_id),
            "notes": notes
        })
        logger.info("Order created {}".format(order_id))
        logger.info(order)
        return order
    except Exception as eee:
        logger.exception(eee)
        raise eee


@api_view(['POST'])
def razorpay(request):
    customer = Customer.objects.get(user=1)
    order = CartAPIs._get_cart_order(None, customer)
    order_details_in_cart = OrderItem.objects.filter(
        order=order.id).select_related('product')
    items_total = get_items_total(order_details_in_cart)
    payable_amount = get_payable_amount(
        order_details_in_cart, items_total, None) + get_delivery_charge(items_total, order)
    razorpay_order = create_order(payable_amount, order.id, {})
    # Save the order in DB
    order_service.update_order(order, **{
        "provider_order_id": razorpay_order["id"]
    })
    logger.info(
        "{}/api/razorpay_callback".format(request.build_absolute_uri('/')[:-1]))
    return Response({"merchantId": "rzp_test_leBRK3Vt3XMVkp",
                     "amount": payable_amount,
                     "currency": "INR",
                     "orderId": razorpay_order["id"],
                     "name": "BP Ecomm",
                     "description": "Place Order",
                     "callback_url":  "{}/api/razorpay_callback".format(request.build_absolute_uri('/')[:-1]),
                     "address": order.delivery_address.__str__()})


class CallbackView(APIView):
    permission_classes = []
    authentication_classes = []
    """
    APIView for Verifying Razorpay Order.
    :return: Success and failure response messages
    """

    @staticmethod
    def post(request, *args, **kwargs):
        # getting data form request
        response = request.data.dict()
        task = payment_callback.delay(response)
        return redirect('http://localhost:3000/ecomm/complete/{}/'.format(task.id))
