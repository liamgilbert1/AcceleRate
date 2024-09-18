from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("profile/", views.profile, name="profile"),
    path('', include('social_django.urls')),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout')
]