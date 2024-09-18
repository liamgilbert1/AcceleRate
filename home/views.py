from django.shortcuts import render
import json
from django.http import JsonResponse, HttpResponse
from core.models import LandscapingCompany
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
from django.shortcuts import redirect
from django.contrib.auth import logout as auth_logout
from django.conf import settings

def home(request):
    return render(request, 'home/home.html')

def profile(request):
    user=request.user

    auth0_user = user.social_auth.get(provider='auth0')

    user_data = {
        'user_id': auth0_user.uid,
        'name': user.firstname,
        'picture': auth0_user.extra_data['picture']
    }

    context={
        'user_data': json.dumps(user_data, indent=4),
        'auth0_user': auth0_user
    }
    
    return render(request, 'home/profile.html', context)


# Login view: Redirects the user to Auth0's login page
def login(request):
    return redirect('/login/auth0')

# Logout view: Logs the user out of Django and redirects them to Auth0's logout endpoint
def logout(request):
    auth_logout(request)
    return_to = 'http://localhost:8000/home/'  # Change to your app's logout redirect URL
    return redirect(f"https://{settings.SOCIAL_AUTH_AUTH0_DOMAIN}/v2/logout?client_id={settings.SOCIAL_AUTH_AUTH0_KEY}&returnTo={return_to}")


    
