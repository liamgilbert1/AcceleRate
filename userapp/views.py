from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from core.models import LandscapingCompany
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json
from decimal import Decimal

def index(request):
    return render(request, 'userapp/index.html')

def service(request):
    return render(request, 'userapp/service.html')

@csrf_exempt
def calculate_quote(request):
    try:
        data = json.loads(request.body)
        square_footage = data['squareFootage']
        company = get_object_or_404(LandscapingCompany, id=1)
        price = company.pricing_model.per_square_foot * Decimal(square_footage)
        return JsonResponse({'price': price})
    except (json.JSONDecodeError, TypeError) as e:
        return JsonResponse({'error': str(e)}, status=400)

