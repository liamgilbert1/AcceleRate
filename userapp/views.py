from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    return render(request, 'userapp/index.html')

def service(request):
    return render(request, 'userapp/service.html')
