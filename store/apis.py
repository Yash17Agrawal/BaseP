import logging

from django.db.transaction import atomic
from django.shortcuts import get_object_or_404, redirect
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from core.utilities import common_pagination
from store.models import Address, Category, Coupon, Customer, GenericGroup, Order
from store.repositories.customer_repository import CustomerRepository
from store.repositories.order_item_repository import OrderItemRepository
from store.repositories.order_repository import OrderRepository
from store.services.customer_service import CustomerService
from store.services.order_item_service import OrderItemService
from store.services.order_service import OrderService
from store.services.product_service import ProductService
from store.repositories.product_repository import ProductRepository
from store.serializers import AddressSerializer, CategorySerializer, CreateAddressSerializer, CreateCartSerializer, GetCartSerializer, GetCheckoutReviewItemsSerializer, GetOrdersDataSerializer, GetOrdersSerializer, ProductSerializer, CreateProductSerializer, PartialUpdateProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from store.tasks import my_task

#                   App Layer ( Infra Layer )
product_service = ProductService(ProductRepository())
customer_service = CustomerService(CustomerRepository())
order_service = OrderService(OrderRepository())
order_item_service = OrderItemService(OrderItemRepository())

logger = logging.getLogger(__package__)


class ProductAPIView(APIView):
    # TODO: Replace this with the actual vendor ID from request.user.vendor__id
    VENDOR_ID = 1
    DEFAULT_CATEGORY_ID = 1

    def get(self, request, product_id=None):
        if product_id:
            try:
                product_details = product_service.get_by_id(product_id)
                return Response(ProductSerializer(product_details).data)
            except ValueError:
                raise NotFound(detail=f"Product with ID {
                               product_id} not found.")
        # Handle GET /products/
        # return Response(data=ProductSerializer(product_service.get_by_id(1).__dict__, many=False).data)
        return Response(data=ProductSerializer(product_service.get_all(), many=True).data)

    def post(self, request, product_id=None):
        if product_id:
            # Handle POST /products/{pk}/
            update_serializer = PartialUpdateProductSerializer(
                data=request.data, partial=True)
            if update_serializer.is_valid():
                # print(update_serializer.validated_data)
                try:
                    product_service.update_product(
                        self.VENDOR_ID,
                        product_id,
                        **update_serializer.validated_data)
                    return Response({"message": "Product updated"}, status=status.HTTP_200_OK)
                except ValueError as e:
                    return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response(data=update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # Handle POST /products/
        create_serializer = CreateProductSerializer(data=request.data)
        if create_serializer.is_valid():
            try:
                # TODO: Remove hard coding of category and vendor , it should come from api payload from vendor's product onboarding journey
                product_service.create_product(
                    {"vendor_id": self.VENDOR_ID, "category_id": self.DEFAULT_CATEGORY_ID, **create_serializer.validated_data})
                return Response({"message": "Product created"}, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrdersAPIView(APIView):
    def get(self, request, order_id):
        order = order_service.get_by_id(1, order_id)
        if order:
            order_details = order_item_service.get_items_by_order_id(order.id)
            data = _format_order_items(order, order_details,
                                       order.total_amount, order.payment, order.delivery_charge, False)
            return Response(data)
        else:
            return Response(data="Order Not Found For The User", status=status.HTTP_204_NO_CONTENT)

    def post(self, request):
        payload = request.data
        get_orders_serializer = GetOrdersSerializer(data=payload)
        if get_orders_serializer.is_valid():
            page_size = payload['page_size']
            page_no = payload['page_no']
            # TODO: Replace this with service based implementation
            response = common_pagination(
                Order, page_size, page_no, GetOrdersDataSerializer, {}, {}, {"status": Order.PENDING})
            return Response(response)
        # logger.warning(payload)
        return Response(data=get_orders_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([])
@permission_classes([])
def get_category_items(request):
    categories = Category.objects.filter()
    return Response(CategorySerializer(categories, many=True).data)


class CartAPIs(APIView):
    # permission_classes = [IsAuthenticated, IsEmailVerified]

    @staticmethod
    def get_user():
        # TODO: replace with request.user
        return Customer.objects.get(user=1)

    def post(self, request):
        user = self.get_user()
        # TODO: Add serializer
        data = request.data
        try:
            with atomic():
                cart_order = self._get_cart_order(user)
                if cart_order:
                    return self._update(data, cart_order, user)
                else:
                    cart_order = order_service.create_pending_order(1)
                    return self._bulk_create(data, cart_order)
        except Exception as e:
            logger.exception(e)
            return Response(data=e.args, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        order = self._get_cart_order(self.get_user())
        if order:
            items_in_cart = order_item_service.get_items_by_order_id(order.id)
        else:
            items_in_cart = None
        return Response(GetCartSerializer(items_in_cart, many=True).data)

    def _get_cart_order(self, customer):
        # .get() throws unwanted error
        return order_service.get_pending_order(customer.id)

    def _create_cart_order_detail(self, all_data, many):
        create_cart_serializer = CreateCartSerializer(data=all_data, many=many)
        if create_cart_serializer.is_valid():
            create_cart_serializer.save()
        return create_cart_serializer

    def _bulk_create(self, data, cart_order):
        all_data = []
        for item in data['items']:
            all_data.append(
                {'order': cart_order.id, 'product': item['id'], 'quantity': item['quantity'], 'price': 0})
        if all_data == []:
            raise Exception("Empty items list")
        create_cart_serializer = self._create_cart_order_detail(
            all_data, many=True)
        if create_cart_serializer.is_valid():
            return Response(GetCartSerializer(order_item_service.get_items_by_order_id(cart_order.id), many=True).data, status=status.HTTP_201_CREATED)
        logger.warn(data)
        raise Exception(create_cart_serializer.errors)

    # TODO: Replace this with bulk update from service
    def _update(self, data, cart_order, user):
        if data['items'] == []:
            order_service.delete_order(user)
            logger.info("Empty items list, deleted Cart order")
            return Response(data=[], status=status.HTTP_200_OK)
        item_id_to_details = {}
        item_ids = []
        for item in data['items']:
            # We dont use offer_price in order_Detail unless an order is placed
            item_id_to_details[item['id']] = {
                'quantity': item['quantity'], 'price': 0}
            item_ids.append(item['id'])
        cart_order_details = order_item_service.get_items_by_order_id(
            cart_order.id)
        # Delete unwanted items from cart
        order_item_service.delete_items_by_order_id_exluding_few(
            cart_order.id, item_ids)
        logger.info("Deleted unwanted cart items")
        # Assuming cart order details will definitely exist when cart order was found in parent function
        # TODO: Optimize this
        for item_id in item_ids:
            cart_order_detail_obj = order_item_service.get_item_by_product_id(
                item_id,
                cart_order.id)
            if cart_order_detail_obj:
                order_item_service.update_order_item(
                    cart_order_detail_obj, **{"quantity": item_id_to_details[item_id]['quantity']})
            else:
                data_to_create = {}
                data_to_create['order'] = cart_order.id
                data_to_create['product'] = item_id
                data_to_create['quantity'] = item_id_to_details[item_id]['quantity']
                # We dont use price in order_Detail unless an order is placed
                data_to_create['price'] = item_id_to_details[item_id]['price']
                create_cart_serializer = self._create_cart_order_detail(
                    data_to_create, many=False)
                if create_cart_serializer.is_valid():
                    continue
                else:
                    logger.error(
                        "Invalid data while creating new items in user cart order details")
                    raise Exception(create_cart_serializer.errors)
                    # return Response(data=create_cart_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(GetCartSerializer(order_item_service.get_items_by_order_id(
            cart_order.id), many=True).data)


@api_view(['GET'])
def get_checkout_details(request, name=None):
    coupon = None
    if name:
        coupon = get_object_or_404(Coupon, pk=name)
    cart_order = order_service.get_pending_order(1)
    if cart_order:
        # TODO: Beingback coupon discount with order service
        # if name:
        #     cart_order.applied_coupon = coupon
        #     logger.info("Updating User Cart order with coupon")
        #     logger.debug(
        #         "Updating User Cart order with coupon {}".format(coupon))
        #     cart_order.save()
        order_items_in_cart = order_item_service.get_items_by_order_id(
            cart_order.id)
        items_total = order_item_service.get_items_total(order_items_in_cart)
        delivery_charge = order_item_service.get_delivery_charge(
            items_total, cart_order)
        payable_amount = order_item_service.get_payable_amount(
            order_items_in_cart, items_total, coupon) + delivery_charge
        data = _format_order_items(
            cart_order, order_items_in_cart, items_total, payable_amount, delivery_charge, True)
        return Response(data)
    else:
        return Response(data="No cart Item Found", status=status.HTTP_204_NO_CONTENT)


def _format_order_items(order, order_details, items_total, payable_amount, delivery_charge, is_cart):
    return {
        "delivery_address": AddressSerializer(Address.objects.get(id=order.delivery_address_id)).data if order.delivery_address_id else None,
        "items": GetCheckoutReviewItemsSerializer(order_details, many=True).data,
        "payment": payable_amount,
        "total": items_total,
        "discount": items_total-payable_amount if items_total-payable_amount > 0 else 0,
        "delivery_charge": delivery_charge,
        "availability_errors": check_items_with_pincodes(order_details) if order.delivery_address_id and is_cart else {},
        "applied_coupon": order.applied_coupon.name if order.applied_coupon else ""
    }


def check_items_with_pincodes(order_details_in_cart):
    pincode_group = GenericGroup.objects.filter(
        type=GenericGroup.PINCODES).first()
    if pincode_group:
        # IMPORTANT: For Many TO Many Relationship
        # List of items which can be delivered only in some pincodes
        restricted_area_items = pincode_group.items.all()
        pincodes = pincode_group.data  # List of pincodes [281004,281005]
        order_detail_pincode = order_details_in_cart[0].order.delivery_address.pincode
        impossible_delivery_items = {}
        for order_detail in order_details_in_cart:
            if restricted_area_items and order_detail.product in restricted_area_items and order_detail_pincode not in pincodes:
                # Item can't be delivered to the expected pincode
                impossible_delivery_items[order_detail.product.id] = "Unavailable in your shipping area"
        return impossible_delivery_items
    else:
        return {}


class UserAddress(APIView):
    # permission_classes = [IsAuthenticated]

    @staticmethod
    def get_user():
        # TODO: replace with request.user
        return 1

    def post(self, request):
        data = request.data
        data['customer'] = customer_service.customer_repository.get_by_id(
            self.get_user()).id
        create_address_serializer = CreateAddressSerializer(data=data)
        if create_address_serializer.is_valid():
            create_address_serializer.save()
            return Response(create_address_serializer.data, status=status.HTTP_201_CREATED)
        logger.warn(data)
        logger.error(create_address_serializer.errors)
        return Response(data=create_address_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        # user_registration_mail("14103263yash@gmail.com", request.user)
        addresses = Address.objects.filter(customer=self.get_user())
        return Response(AddressSerializer(addresses, many=True).data)


@api_view(['GET'])
def get_cities(request):
    # TODO: Replace this with actual city data
    return Response(data=[{"name": "Delhi"}])


@api_view(['GET'])
def get_region_for_city(request):
    # TODO: Replace this with actual region data
    return Response(data="UP")


@api_view(['POST'])
def update_user_cart_address(request):
    address = get_object_or_404(Address, pk=request.data['delivery_address'])
    delivery_charges = GenericGroup.objects.filter(
        type=GenericGroup.DELIVERY_CHARGE).first()
    charge = 50
    if delivery_charges:
        charge = delivery_charges.data.get(str(address.pincode))
    pending_order = order_service.get_pending_order(1)
    order_service.update_order(pending_order, **{
        "delivery_address_id": request.data['delivery_address'],
        "delivery_charge":   charge
    })
    return Response(status=status.HTTP_200_OK)


class SearchAPI(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        get_params = request.GET
        if 'type' in get_params and hasattr(self, "_get_{}".format(get_params['type'])):
            return getattr(self, "_get_{}".format(get_params['type']))(get_params["value"])
        else:
            return Response(data="type Not found", status=status.HTTP_400_BAD_REQUEST)

    def _get_item(self, keyword):
        if len(keyword.strip()) == 0:
            return Response(data="Empty search string", status=status.HTTP_400_BAD_REQUEST)
        products = product_service.search(keyword)
        return Response(data=ProductSerializer(products, many=True).data, status=status.HTTP_200_OK)
