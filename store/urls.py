from django.urls import path

from store import apis

urlpatterns = [
    path('products/', apis.get_cities),  # GET
]
