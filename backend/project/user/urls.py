from django.urls import path, include
from rest_framework import routers
from .views import AccountViewSet, RegisterViewSet

router = routers.DefaultRouter()
router.register(r'account', AccountViewSet, basename="user-account")
router.register(r'register', RegisterViewSet, basename="user-register")

urlpatterns = [
    path('', include(router.urls)),
]