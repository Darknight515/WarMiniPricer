import random
from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_UP
from django.core.management.base import BaseCommand
from webscraper_app.models import MiniData, DatePrice, CurrentPrice


class Command(BaseCommand):
    help = 'Fills missing price entries with random price drops from the last date to April 9th 2025'

    def handle(self, *args, **options):
        end_date = date(2025, 4, 9)
        minis = MiniData.objects.all()

        for mini in minis:
            last_date_price = DatePrice.objects.filter(
                mini=mini).order_by('-date_price').first()
            if not last_date_price:
                self.stdout.write(
                    f"Skipping mini {mini.name} (no DatePrice entries)")
                continue

            last_date = last_date_price.date_price
            start_date = last_date + timedelta(days=1)
            if start_date > end_date:
                continue  # No dates to fill

            # Fetch existing DatePrice entries in the range
            existing_dates = DatePrice.objects.filter(
                mini=mini,
                date_price__gte=start_date,
                date_price__lte=end_date
            ).values_list('date_price', 'price')
            existing_price_dict = {dt: price for dt, price in existing_dates}

            current_price = last_date_price.price
            new_date_prices = []
            dates_to_process = list(self.daterange(start_date, end_date))

            for single_date in dates_to_process:
                if single_date in existing_price_dict:
                    current_price = existing_price_dict[single_date]
                else:
                    # Generate random drop between 5% and 30%
                    drop_percent = random.uniform(5, 30)
                    drop_decimal = Decimal(str(drop_percent)) / Decimal(100)
                    new_price = current_price * (Decimal('1') - drop_decimal)
                    new_price = new_price.quantize(
                        Decimal('0.00'), rounding=ROUND_HALF_UP)
                    new_date_prices.append(DatePrice(
                        mini=mini,
                        date_price=single_date,
                        price=new_price
                    ))
                    current_price = new_price

            # Bulk create new DatePrice entries
            if new_date_prices:
                DatePrice.objects.bulk_create(new_date_prices)
                self.stdout.write(
                    f"Added {len(new_date_prices)} entries for {mini.name}")

            # Update CurrentPrice
            CurrentPrice.objects.update_or_create(
                mini=mini,
                defaults={'price': current_price}
            )

    def daterange(self, start_date, end_date):
        for n in range(int((end_date - start_date).days) + 1):
            yield start_date + timedelta(n)
