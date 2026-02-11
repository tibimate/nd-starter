from rest_framework import viewsets, permissions, filters
from .models import Client
from .serializers import ClientSerializer

class ClientsViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    pagination_class = None
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'email', 'tin']
    ordering_fields = ['name', 'email', 'tin', 'active', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        active = self.request.query_params.get('active', None)
        if active:
            queryset = queryset.filter(active=active.lower() == 'true')

        return queryset
