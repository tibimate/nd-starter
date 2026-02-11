from django.urls import path, include
from rest_framework import routers
from .views import ClientsViewSet

router = routers.DefaultRouter()
router.register(r'', ClientsViewSet, basename="clients")

urlpatterns = [
    path('', include(router.urls)),
]

