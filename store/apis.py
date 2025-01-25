from rest_framework.decorators import (api_view, authentication_classes,
                                       permission_classes)

from rest_framework.response import Response
from store.services.product_service import ProductService
from store.repositories.product_repository import ProductRepository
from store.serializers import ProductSerializer

#                   App Layer ( Infra Layer )
product_service = ProductService(ProductRepository())


@api_view(['GET'])
def get_cities(request):
    # View Layer / Presentation Layer
    # return Response(data=ProductSerializer(product_service.get_by_id(1).__dict__, many=False).data)
    return Response(data=ProductSerializer(product_service.get_all_products(), many=True).data)
