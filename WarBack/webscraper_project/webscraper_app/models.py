from django.db import models

class MiniData(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    faction = models.CharField(max_length=100)

    class Meta:
        db_table = 'MiniData'

class DatePrice(models.Model):
    id = models.AutoField(primary_key=True)
    miniId = models.ForeignKey(MiniData, on_delete=models.CASCADE, related_name='date_prices')
    date_price = models.DateField()

    class Meta:
        db_table = 'DatePrice'

class MSRP(models.Model):
    miniId = models.OneToOneField(MiniData, on_delete=models.CASCADE, primary_key=True, related_name='msrp')
    msrp = models.DecimalField(max_digits=38, decimal_places=0)

    class Meta:
        db_table = 'MSRP'

class CurrentPrice(models.Model):
    price = models.DecimalField(max_digits=38, decimal_places=0)
    miniId = models.OneToOneField(MiniData, on_delete=models.CASCADE, primary_key=True, related_name='current_price')

    class Meta:
        db_table = 'CurrentPrice'
