from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from core.models import LandscapingCompany
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json
from decimal import Decimal
from django.shortcuts import redirect
from django.contrib.auth import logout as auth_logout
from django.conf import settings

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

# Login view: Redirects the user to Auth0's login page
def login(request):
    return redirect('/login/auth0')

# Logout view: Logs the user out of Django and redirects them to Auth0's logout endpoint
def logout(request):
    auth_logout(request)
    return_to = 'http://localhost:8000/'  # Change to your app's logout redirect URL
    return redirect(f"https://{settings.SOCIAL_AUTH_AUTH0_DOMAIN}/v2/logout?client_id={settings.SOCIAL_AUTH_AUTH0_KEY}&returnTo={return_to}")
