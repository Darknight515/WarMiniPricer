from django.db import models

class MiniData(models.Model):
    name = models.CharField(max_length=100)
    faction = models.CharField(max_length=100)

    class Meta:
        db_table = 'MiniData'

class DatePrice(models.Model):
    mini = models.ForeignKey(MiniData, on_delete=models.CASCADE, related_name='date_prices', default=0, db_column='miniId')
    date_price = models.DateField()

    class Meta:
        db_table = 'DatePrice'

class MSRP(models.Model):
    mini = models.ForeignKey(MiniData, on_delete=models.CASCADE, primary_key=False, related_name='msrp', default=0, db_column='miniId')
    msrp = models.DecimalField(max_digits=38, decimal_places=0)

    class Meta:
        db_table = 'MSRP'

class CurrentPrice(models.Model):
    mini = models.ForeignKey(MiniData, on_delete=models.CASCADE, primary_key=False, related_name='current_price', default=0, db_column='miniId')
    price = models.DecimalField(max_digits=38, decimal_places=0)

    class Meta:
        db_table = 'CurrentPrice'