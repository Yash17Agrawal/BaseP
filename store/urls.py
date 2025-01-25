from django.urls import path

from store import apis

urlpatterns = [
    path('products/', apis.ProductAPIView.as_view()),
    # GET, #POST
    path('products/<int:product_id>/', apis.ProductAPIView.as_view()),
]
