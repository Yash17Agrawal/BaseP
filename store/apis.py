import logging

from django.db.transaction import atomic
from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from core.utilities import common_pagination
from store.models import Category, Customer, Order, OrderItem
from store.services.product_service import ProductService
from store.repositories.product_repository import ProductRepository
from store.serializers import CategorySerializer, CreateCartSerializer, GetCartSerializer, GetOrdersRequestSerializer, GetOrdersSerializer, ProductSerializer, CreateProductSerializer, PartialUpdateProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from store.tasks import my_task

#                   App Layer ( Infra Layer )
product_service = ProductService(ProductRepository())

logger = logging.getLogger(__package__)


class ProductAPIView(APIView):
    # TODO: Replace this with the actual vendor ID from request.user.vendor__id
    VENDOR_ID = 1

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
                product_service.create_product(
                    self.VENDOR_ID,
                    **create_serializer.validated_data)
                return Response({"message": "Product created"}, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def get_all_user_order(request):
    payload = request.data
    get_orders_serializer = GetOrdersRequestSerializer(data=payload)
    if get_orders_serializer.is_valid():
        page_size = payload['page_size']
        page_no = payload['page_no']
        response = common_pagination(
            Order, page_size, page_no, GetOrdersSerializer)
        return Response(response)
    # logger.warning(payload)
    return Response(data=get_orders_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_order_details(request, order_id):
    result = my_task.delay(3, 5)
    return Response({"message": "Order details", "task_id": result.id})


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
                    cart_order = Order.objects.create(
                        customer=user)
                    return self._bulk_create(data, cart_order)
        except Exception as e:
            logger.exception(e)
            return Response(data=e.args, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        items_in_cart = OrderItem.objects.filter(
            order=self._get_cart_order(self.get_user()))
        return Response(GetCartSerializer(items_in_cart, many=True).data)

    def _get_cart_order(self, user):
        # .get() throws unwanted error
        cart_order = Order.objects.filter(
            customer=user, status="PENDING")
        if len(cart_order) > 1:
            pass
            logger.error(
                "Multiple cart order exist for a user, System Discrepancy Found")
        elif len(cart_order) == 1:
            return cart_order[0]
        else:
            return None

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
            return Response(GetCartSerializer(OrderItem.objects.filter(order=cart_order.id), many=True).data, status=status.HTTP_201_CREATED)
        logger.warn(data)
        raise Exception(create_cart_serializer.errors)

    def _update(self, data, cart_order, user):
        if data['items'] == []:
            Order.objects.filter(customer=user,
                                 status="PENDING").delete()
            logger.info("Empty items list, deleted Cart order")
            return Response(data=[], status=status.HTTP_200_OK)
        item_id_to_details = {}
        item_ids = []
        for item in data['items']:
            # We dont use offer_price in order_Detail unless an order is placed
            item_id_to_details[item['id']] = {
                'quantity': item['quantity'], 'price': 0}
            item_ids.append(item['id'])
        cart_order_details = OrderItem.objects.filter(order=cart_order.id)
        cart_order_details.exclude(product__id__in=item_ids).delete()
        logger.info("Deleted unwanted cart items")
        # Assuming cart order details will definitely exist when cart order was found in parent function
        # TODO: Optimize this
        for item_id in item_ids:
            cart_order_detail_obj = cart_order_details.filter(
                product__id=item_id)
            if cart_order_detail_obj:
                cart_order_detail_obj.update(
                    quantity=item_id_to_details[item_id]['quantity'])
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
        return Response(GetCartSerializer(cart_order_details, many=True).data)
