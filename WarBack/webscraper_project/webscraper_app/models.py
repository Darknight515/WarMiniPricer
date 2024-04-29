from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=255)
    msrp = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    faction = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.name



# class HistoricalPrice(models.Model):
#     product = models.ForeignKey(Product, on_delete=models.CASCADE)
#     current_price = models.DecimalField(max_digits=10, decimal_places=2)
#     acquisition_date = models.DateTimeField(default=datetime.now)
#     store = models.CharField(max_length=255)

#     def __str__(self):
#         return f"{self.product.name} - {self.current_price} ({self.acquisition_date} - {self.store})"
