from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views

router = DefaultRouter()
router.register(r'payment-methods', api_views.PaymentMethodViewSet)
router.register(r'payments', api_views.PaymentViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/dashboard/', api_views.dashboard_analytics, name='dashboard-analytics'),
    path('api/create-payment/', api_views.create_payment, name='create-payment'),
]