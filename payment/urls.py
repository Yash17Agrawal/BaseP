from django.urls import path

from payment import apis

urlpatterns = [
    path('razorpay_order/', apis.razorpay, name='razorpay_order'),
    path('razorpay_callback', apis.CallbackView.as_view(),
         name='razorpay_callback'),
]
