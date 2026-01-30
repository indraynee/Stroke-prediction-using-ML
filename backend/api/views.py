from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer

class ItemViewSet(viewsets.ModelViewSet):
    """
    A simple ViewSet for viewing and editing items.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
