from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from store.services.product_service import ProductService
from store.repositories.product_repository import ProductRepository
from store.serializers import ProductSerializer, UpdateProductSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#                   App Layer ( Infra Layer )
product_service = ProductService(ProductRepository())


class ProductAPIView(APIView):
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
            return Response({"message": f"Product {product_id} updated"})
        # Handle POST /products/
        create_serializer = UpdateProductSerializer(data=request.data)
        if create_serializer.is_valid():
            try:
                product_service.create_product(
                    **create_serializer.validated_data)
                return Response({"message": "Product created"}, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data=create_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
