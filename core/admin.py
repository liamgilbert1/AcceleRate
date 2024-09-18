from django.contrib import admin

# Register your models here.
from .models import LandscapingCompany, PricingModel

@admin.register(LandscapingCompany)
class PricingModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'pricing_model')

@admin.register(PricingModel)
class PricingModelAdmin(admin.ModelAdmin):
    list_display = ('pricing_model_name', 'per_square_foot')
