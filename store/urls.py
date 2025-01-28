from django.urls import path

from store import apis

urlpatterns = [
    path('items/', apis.ProductAPIView.as_view()),
    # GET, #POST
    path('items/<int:product_id>/', apis.ProductAPIView.as_view()),

    path('orders/', apis.OrdersAPIView.as_view()),  # POST
    path('orders/<int:order_id>/', apis.OrdersAPIView.as_view()),  # GET

    path('categorys/', apis.get_category_items),  # GET

    path('cart/', apis.CartAPIs.as_view()),  # GET, POST
    path('checkout/', apis.get_checkout_details),  # GET
    path('checkout/address/', apis.update_user_cart_address),  # POST
    path('address/', apis.UserAddress.as_view()),  # GET, #POST
    path('cities/', apis.get_cities),  # GET
    path('region/', apis.get_region_for_city),  # GET

    path('search/', apis.SearchAPI.as_view()),  # GET

]
