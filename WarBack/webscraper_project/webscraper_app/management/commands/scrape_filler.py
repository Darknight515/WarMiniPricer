import random
from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_UP
from django.core.management.base import BaseCommand
from django.db import transaction
from webscraper_app.models import MiniData, DatePrice, CurrentPrice, MSRP
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Fill missing prices with random drops (5-30%) from MSRP'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry_run',
            action='store_true',
            help='Simulate without saving to DB',
        )

    def handle(self, *args, **options):
        try:
            with transaction.atomic():
                end_date = date(2025, 4, 9)
                minis = MiniData.objects.select_related('msrp').all()

                for mini in minis:
                    if not hasattr(mini, 'msrp'):
                        logger.warning(f"⚠️ No MSRP for {mini.name}. Skipping.")
                        continue

                    msrp = mini.msrp.msrp
                    last_entry = DatePrice.objects.filter(mini=mini).order_by('-date_price').first()

                    # Start from day after last entry (or 2020-01-01 if no history)
                    start_date = (
                        last_entry.date_price + timedelta(days=1) 
                        if last_entry 
                        else date(2020, 1, 1)
                    )

                    if start_date > end_date:
                        continue

                    new_entries = []
                    for single_date in self._daterange(start_date, end_date):
                        if DatePrice.objects.filter(mini=mini, date_price=single_date).exists():
                            continue

                        # Random drop (5-30%) from MSRP
                        drop_percent = random.uniform(5, 30)
                        new_price = msrp * (1 - Decimal(drop_percent) / 100)
                        new_price = new_price.quantize(Decimal('0.00'), rounding=ROUND_HALF_UP)

                        # Never go below 50% of MSRP
                        if new_price < msrp * Decimal('0.5'):
                            new_price = msrp * Decimal('0.5')
                            logger.warning(f"⚠️ Clamped {mini.name} to ${new_price} (50% MSRP)")

                        new_entries.append(DatePrice(
                            mini=mini,
                            date_price=single_date,
                            price=new_price
                        ))

                    if options['dry_run']:
                        self.stdout.write(f"DRY RUN: Would add {len(new_entries)} entries for {mini.name}")
                    else:
                        if new_entries:
                            DatePrice.objects.bulk_create(new_entries)
                            logger.info(f"➕ Added {len(new_entries)} prices for {mini.name}")
                            # Update CurrentPrice to the newest entry
                            CurrentPrice.objects.update_or_create(
                                mini=mini,
                                defaults={'price': new_entries[-1].price}
                            )

                if options['dry_run']:
                    self.stdout.write("✅ Dry run complete. No changes saved.")
                else:
                    self.stdout.write("✅ Prices filled successfully!")

        except Exception as e:
            logger.critical(f"🚨 Failed: {str(e)}", exc_info=True)
            self.stdout.write("❌ Fill aborted. All changes rolled back.")

    def _daterange(self, start_date, end_date):
        for n in range(int((end_date - start_date).days) + 1):
            yield start_date + timedelta(n)