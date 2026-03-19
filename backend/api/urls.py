from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CurrencyViewSet, BankAccountViewSet, TransferRequestViewSet, 
    SiteSettingsViewSet, RegisterView, CustomAuthToken
)

router = DefaultRouter()
router.register(r'currencies', CurrencyViewSet)
router.register(r'bank-accounts', BankAccountViewSet)
router.register(r'transfers', TransferRequestViewSet)
router.register(r'settings', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
]
