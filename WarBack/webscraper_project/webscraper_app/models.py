from django.db import models

class MiniData(models.Model):
    name = models.CharField(max_length=100)
    faction = models.CharField(max_length=100)
    image_url = models.URLField(max_length=200, blank=True, null=True)  # New field for image URL

    class Meta:
        db_table = 'MiniData'

class DatePrice(models.Model):
    mini = models.ForeignKey(MiniData, on_delete=models.CASCADE, related_name='date_prices')
    date_price = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'DatePrice'

class MSRP(models.Model):
    mini = models.OneToOneField(MiniData, on_delete=models.CASCADE, related_name='msrp')
    msrp = models.DecimalField(max_digits=38, decimal_places=0)

    class Meta:
        db_table = 'MSRP'

class CurrentPrice(models.Model):
    mini = models.ForeignKey(MiniData, on_delete=models.CASCADE, related_name='current_prices')
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'CurrentPrice'