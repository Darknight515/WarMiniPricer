import datetime
import os
import sys
import django
import logging
import scrapy
from decimal import Decimal
from twisted.internet.threads import deferToThread

# Setup logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("armada_spider.log", mode="w")
    ]
)

# Setup Django
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
sys.path.append(project_root)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webscraper_project.settings')
django.setup()

from webscraper_app.models import MiniData, CurrentPrice, DatePrice, MSRP

class ArmadaSpider(scrapy.Spider):
    name = "armada"

    start_urls = [
        "https://shoparmada.com/collections/gw40k-warhammer-40k",
    ]

    def parse(self, response):
        # Extracting category URLs
        category_urls = response.css(".sidebar-wrap .toggle_list a::attr(href)").getall()
        for category_url in category_urls:
            # Extracting category name from URL
            category_name = category_url.split("/")[-1]
            category_page_url = f"https://shoparmada.com{category_url}"
            if 'accessories' in category_name.lower() or 'dice' in category_name.lower():
                logger.debug("Skipping unwanted category: %s", category_name)
                continue
            logger.debug("Processing category: %s, URL: %s", category_name, category_page_url)
            yield scrapy.Request(category_page_url,
                                 callback=self.parse_category_page,
                                 meta={'category': category_name})

    def parse_category_page(self, response):
        category = response.meta['category']
        logger.debug("Parsing category page for: %s", category)
        # Extracting item details
        item_elements = response.css('.product-details')
        for item_element in item_elements:
            try:
                item_name = item_element.css('.title::text').get().strip()
                item_price_str = item_element.css('.current_price .money::text').get().strip()
            except Exception as e:
                logger.error("Error parsing name/price: %s", e)
                continue
            # Extract the image URL by navigating to the nearest product card element
            image_url = item_element.xpath(
                "./ancestor::div[@data-load-more--grid-item]//img[1]/@data-src"
            ).get()
            if not image_url:
                image_url = item_element.xpath(
                    "./ancestor::div[@data-load-more--grid-item]//img[1]/@src"
                ).get()
            if image_url and image_url.startswith("//"):
                image_url = "https:" + image_url

            # Convert price string to Decimal, removing the '$'
            price_decimal = self.parse_price(item_price_str)
            logger.debug("Yielding item: %s, Price: %s, Image: %s", item_name, price_decimal, image_url)
            yield {
                'category': category,
                'name': item_name,
                'price': price_decimal,
                'image_url': image_url
            }
            self.save_to_db(category, item_name, price_decimal, image_url)

    def parse_price(self, price_str):
        # Remove dollar sign and commas then convert to Decimal
        cleaned = price_str.replace('$', '').replace(',', '').strip()
        try:
            price = Decimal(cleaned)
        except Exception as e:
            logger.error("Error converting price '%s': %s", cleaned, e)
            price = Decimal('0')
        return price

    def save_to_db(self, category, name, price, image_url):
        deferToThread(self._save_to_db, category, name, price, image_url)

    def _save_to_db(self, category, name, price, image_url):
        try:
            mini, created = MiniData.objects.get_or_create(
                name=name,
                defaults={'faction': category, 'image_url': image_url}
            )
            if not created:
                mini.image_url = image_url
                mini.save()

            # Set MSRP only if this is the first record for the mini.
            if created or not hasattr(mini, 'msrp'):
                MSRP.objects.update_or_create(
                    mini=mini,
                    defaults={'msrp': price}
                )

            today = datetime.date.today()

            # Get the last recorded price for this mini (if any)
            last_date_price = DatePrice.objects.filter(mini=mini).order_by('-date_price').first()

            # Insert a new record for today's price if none exists,
            # or if the price has changed compared to the last recorded price.
            if not last_date_price or last_date_price.date_price != today:
                # No price for today yet—create a new record.
                DatePrice.objects.create(mini=mini, date_price=today, price=price)
            elif last_date_price.price != price:
                # Today’s price record exists but the price has changed,
                # update CurrentPrice and insert a new DatePrice record.
                DatePrice.objects.create(mini=mini, date_price=today, price=price)

            # Update the current price if it differs from the new price.
            CurrentPrice.objects.update_or_create(
                mini=mini,
                defaults={'price': price}
            )

            logger.debug("Saved %s to db: price %s", name, price)
        except Exception as e:
            logger.error("Error saving %s to db: %s", name, e)