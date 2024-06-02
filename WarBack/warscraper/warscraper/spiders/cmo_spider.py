from pathlib import Path
import scrapy

class CMOGamesSpider(scrapy.Spider):
    name = "cmogames"

    start_urls = [
        "https://www.cmogames.com/games-workshop/warhammer-40k/",
    ]

    def parse(self, response):
        # Extracting category URLs
        category_urls = response.css(".subcategories .ty-subcategories__item a::attr(href)").getall()
        for category_url in category_urls:
            # Extracting category name from URL
            category_name = category_url.split("/")[-2]
            # Skip categories that contain the word 'accessories'
            if 'accessories' in category_name.lower() or 'dice' in category_name.lower():
                continue
            yield scrapy.Request(category_url, callback=self.parse_category_page, meta={'category': category_name})

    def parse_category_page(self, response):
        category = response.meta['category']
        # Extracting item details
        item_elements = response.css('form[name^="product_form_"]')
        for item_element in item_elements:
            item_name = item_element.css('.ty-product-list__item-name a::text').get().strip()
            item_original_price = item_element.css('.ty-list-price.ty-nowrap .ty-list-price::text').get()
            item_discounted_price = item_element.css('.ty-price .ty-price-num::text').get()

            # Clean up the prices
            if item_original_price:
                item_original_price = item_original_price.strip()
            if item_discounted_price:
                item_discounted_price = item_discounted_price.strip()

            yield {
                'category': category,
                'name': item_name,
                'original_price': item_original_price,
                'discounted_price': item_discounted_price
            }
