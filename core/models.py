from django.db import models

class LandscapingCompany(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    pricing_model = models.ForeignKey('PricingModel', on_delete=models.PROTECT)


    def __str__(self):
        return self.name
    

class PricingModel(models.Model):
    pricing_model_name = models.CharField(max_length=100)
    per_square_foot = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return self.pricing_model_name
