from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from core.utilities import common_pagination
from store.models import Order
from store.services.product_service import ProductService
from store.repositories.product_repository import ProductRepository
from store.serializers import GetOrdersRequestSerializer, GetOrdersSerializer, ProductSerializer, CreateProductSerializer, PartialUpdateProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from store.tasks import my_task

#                   App Layer ( Infra Layer )
product_service = ProductService(ProductRepository())


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
