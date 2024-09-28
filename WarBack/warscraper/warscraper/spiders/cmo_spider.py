import scrapy

class CMOGamesSpider(scrapy.Spider):
    name = "cmogames"

    start_urls = [
        "https://www.cmogames.com/games-workshop/warhammer-40k/",
    ]

    def parse(self, response):
        # Extracting category URLs from the subcategories list
        category_urls = response.css(".subcategories .ty-subcategories__item a::attr(href)").getall()
        
        for category_url in category_urls:
            # Extracting category name from URL
            category_name = category_url.split("/")[-2]
            # Skip categories that contain the word 'accessories' or 'dice'
            if 'accessories' in category_name.lower() or 'dice' in category_name.lower():
                continue
            # Follow category pages
            yield scrapy.Request(category_url, callback=self.parse_category_page, meta={'category': category_name})

    def parse_category_page(self, response):
        category = response.meta['category']

        # Extracting item details
        item_elements = response.css('form[name^="product_form_"]')

        for item_element in item_elements:
            # Extract the item name
            item_name = item_element.css('.ty-product-list__item-name a::text').get().strip()

            # Extract the original price (strikethrough price, if present)
            item_original_price = item_element.css('.ty-list-price .ty-strike .ty-list-price::text').getall()
            original_price = self.extract_price(item_original_price)

            # Extract the discounted price (actual price being displayed)
            item_discounted_price = item_element.css('.ty-price .ty-price-num::text').getall()
            discounted_price = self.extract_price(item_discounted_price)

            # Output scraped data
            yield {
                'category': category,
                'name': item_name,
                'original_price': original_price,
                'discounted_price': discounted_price
            }

        # Pagination: If there's a next page, follow it
        next_page = response.css('.ty-pagination__item.ty-pagination__next a::attr(href)').get()
        if next_page:
            yield scrapy.Request(next_page, callback=self.parse_category_page, meta={'category': category})

    def extract_price(self, price_data):
        """
        Extracts the price value from a list of price-related data. It skips the dollar sign and 
        returns the first found numerical value.
        """
        for price in price_data:
            price = price.strip()
            # Ignore dollar signs, and return the numerical price
            if price and price != '$':
                return price
        return None