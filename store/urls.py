from django.urls import path

from store import apis

urlpatterns = [
    path('items/', apis.ProductAPIView.as_view()),
    # GET, #POST
    path('items/<int:product_id>/', apis.ProductAPIView.as_view()),

    path('orders/', apis.get_all_user_order),  # POST
    path('orders/<int:order_id>/', apis.get_order_details),  # GET

    path('categorys/', apis.get_category_items),  # GET

]
