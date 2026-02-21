from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .ml_model import predict_stroke_risk

@api_view(['POST'])
@permission_classes([AllowAny])
def predict_risk(request):
    """
    API endpoint to predict stroke risk.
    """
    try:
        data = request.data
        result = predict_stroke_risk(data)
        
        if 'error' in result:
             return Response(result, status=400)
             
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
