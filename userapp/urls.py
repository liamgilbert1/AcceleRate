from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("service/", views.service, name="service"),
    path("calculate-quote/", views.calculate_quote, name="calculate_quote"),
]