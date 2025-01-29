import logging
import json
from django.conf import settings
from celery import shared_task
from django.db.transaction import atomic

from store.models import Order, OrderItem

import razorpay
from store.services.order_item_service import OrderItemService

logger = logging.getLogger(__package__)

client = razorpay.Client(
    auth=(settings.RAZORPAY_ID, settings.RAZORPAY_SECRET))


@shared_task
def payment_callback(response):
    callback(response)


def callback(response):
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
            logger.error("Signature Mismatch!")
            # return Response({'status': 'Signature Mismatch!'}, status=status.HTTP_400_BAD_REQUEST)
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

        logger.error(error_status)
        # return Response({'error_data': error_status}, status=status.HTTP_401_UNAUTHORIZED)


def verify_payment_object(data):
    return client.utility.verify_payment_signature(data)


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
        items_total = OrderItemService.get_items_total(items_in_cart)
        delivery_charge = OrderItemService.get_delivery_charge(
            items_total, placed_order)
        payable_amount = OrderItemService.get_payable_amount(
            items_in_cart, items_total, placed_order.applied_coupon) + delivery_charge
        placed_order.status = "PAID"
        placed_order.total_amount = items_total
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
            # return redirect('http://localhost:3000/ecomm/complete/{}/'.format(placed_order.id))
    except Exception as e:
        logger.exception(e)

        # TODO: Show relevant msg on UI using diff id other than order.id
        # return Response(data="Sorry Couldn't place the order", status=status.HTTP_400_BAD_REQUEST)
