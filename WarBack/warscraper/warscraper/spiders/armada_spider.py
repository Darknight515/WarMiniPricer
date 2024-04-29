from pathlib import Path

import scrapy


class ArmadaSpider(scrapy.Spider):
    name = "armada"

    start_urls = [
        "https://shoparmada.com/collections/gw40k-warhammer-40k",
    ]

    def parse(self, response):
        # Extracting category URLs
        category_urls = response.css(
            ".sidebar-wrap .toggle_list a::attr(href)").getall()
        for category_url in category_urls:
            # Extracting category name from URL
            category_name = category_url.split("/")[-1]
            category_page_url = f"https://shoparmada.com{category_url}"
            yield scrapy.Request(category_page_url, callback=self.parse_category_page, meta={'category': category_name})

    def parse_category_page(self, response):
        category = response.meta['category']
        # Extracting item details
        item_elements = response.css('.product-details')
        for item_element in item_elements:
            item_name = item_element.css('.title::text').get().strip()
            item_price = item_element.css(
                '.current_price .money::text').get().strip()
            yield {
                'category': category,
                'name': item_name,
                'price': item_price
            }
