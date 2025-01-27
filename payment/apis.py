import logging
import json
from django.conf import settings
from django.db.transaction import atomic

from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from django.shortcuts import get_object_or_404, redirect

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView


from store.apis import CartAPIs, get_delivery_charge, get_items_total, get_payable_amount
from store.models import Customer, Order, OrderItem, Product
# Create your views here.
import razorpay

logger = logging.getLogger(__package__)

client = razorpay.Client(
    auth=(settings.RAZORPAY_ID, settings.RAZORPAY_SECRET))


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


def verify_payment_object(data):
    return client.utility.verify_payment_signature(data)


@api_view(['POST'])
def razorpay(request):
    customer = Customer.objects.get(user=1)
    order = CartAPIs._get_cart_order(None, customer)
    order_details_in_cart = OrderItem.objects.filter(
        order=order).select_related('product')
    items_total = get_items_total(order_details_in_cart)
    payable_amount = get_payable_amount(
        order_details_in_cart, items_total, None) + get_delivery_charge(items_total, order)
    razorpay_order = create_order(payable_amount, order.id, {})
    # Save the order in DB
    order.provider_order_id = razorpay_order["id"]
    order.save()
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
        """
            if razorpay_signature is present in the request
            it will try to verify
            else throw error_reason
        """
        if "razorpay_signature" in response:

            # Verifying Payment Signature
            data = verify_payment_object(response)

            # if we get here True signature
            if data:
                logger.info(data)
                return place_order(response['razorpay_order_id'])
            else:
                return Response({'status': 'Signature Mismatch!'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Handling failed payments
            error_code = response['error[code]']
            error_description = response['error[description]']
            error_source = response['error[source]']
            error_reason = response['error[reason]']
            error_metadata = json.loads(response['error[metadata]'])
            # razorpay_payment = Order.objects.get(provider_order_id=error_metadata['order_id'])
            # razorpay_payment.payment_id = error_metadata['payment_id']
            # razorpay_payment.signature_id = "None"
            # razorpay_payment.status = PaymentStatus.FAILURE
            # razorpay_payment.save()

            error_status = {
                'error_code': error_code,
                'error_description': error_description,
                'error_source': error_source,
                'error_reason': error_reason,
            }

            return Response({'error_data': error_status}, status=status.HTTP_401_UNAUTHORIZED)


def place_order(razorpay_order_id):
    try:
        # place_order = Order.objects.get(
        #     user=request.user, status=Order.IN_CART)
        placed_order = Order.objects.get(
            provider_order_id=razorpay_order_id)
        # payment_object.payment_id = response['razorpay_payment_id']
        # payment_object.signature_id = response['razorpay_signature']
        items_in_cart = OrderItem.objects.filter(
            order=placed_order).select_related('product')
        items_total = get_items_total(items_in_cart)
        delivery_charge = get_delivery_charge(items_total, placed_order)
        payable_amount = get_payable_amount(
            items_in_cart, items_total, placed_order.applied_coupon) + delivery_charge
        placed_order.status = "PAID"
        placed_order.total_bill = items_total
        placed_order.payment = payable_amount
        placed_order.delivery_charge = delivery_charge
        with atomic():
            placed_order.save()
            items = []
            # For copying item details into created order
            for order_detail in items_in_cart:
                order_detail.price = order_detail.product.price

                item = order_detail.product
                # item.units = item.units - order_detail.quantity
                items.append(item)
                # if item.units < 0:
                #     raise Exception(
                #         "Inventory Overused. Cannot place the order")
            OrderItem.objects.bulk_update(items_in_cart, ['price'])
            # Product.objects.bulk_update(items, ['units'])
            return redirect('http://localhost:3000/ecomm/complete/{}/'.format(placed_order.id))
    except Exception as e:
        logger.exception(e)
        # TODO: Show relevant msg on UI using diff id other than order.id
        return Response(data="Sorry Couldn't place the order", status=status.HTTP_400_BAD_REQUEST)
