from pathlib import Path

import scrapy


class ArmadaSpider(scrapy.Spider):
    name = "armada"

    start_urls = [
"https://shoparmada.com/collections/gw40k-warhammer-40k",
    ]

    def parse(self, response):


        for category:with expression as target:
            pass in response.css("ul.toggle_list li a.parent_link::attr(href)").getall():
            for item in faction.css()

