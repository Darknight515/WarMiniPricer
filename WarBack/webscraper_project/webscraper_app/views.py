from urllib import request
from django.shortcuts import render
# from bs4 import BeautifulSoup
from django.http import JsonResponse
from .models import MiniData

from pathlib import Path
import os
import json


def mini_data_list(request):
    mini_data_queryset = MiniData.objects.all()
    
    # Manually serialize QuerySet to list of dictionaries
    mini_data_list = list(mini_data_queryset.values())
    
    # Return JsonResponse with the serialized data
    return JsonResponse({'mini_data_list': mini_data_list}, safe=False)
# def mini_data_view(request):

def read_spider_data(request):
    # TODO: run this as a global variable, need access in more functions later.
    # TODO: parse file names to use specified shop name (if necessary).
    data_directory = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    json_data = []
    for filename in os.listdir(data_directory):
        if filename.endswith('.json'):
            with open(os.path.join(data_directory, filename), 'r') as f:
                json_data.append(json.load(f))

    context = {'json_data': json_data}
    return render(request, 'your_template.html', context)
# def scrape_shoparmada_astra_militarum(url):
#     response = request.get(url)
#     print("URL Response Status:", response.status_code)

#     soup = BeautifulSoup(response.text, 'html.parser')
    
#     # Extracting all product details divs
#     product_details_divs = soup.find_all('div', class_='product-details')
#     print("Product Details Elements found: ", bool(product_details_divs))
    
#     data = []
#     for product in product_details_divs:
#         # Extract product name
#         product_name_tag = product.find('span', class_='title')
#         product_name = product_name_tag.get_text().strip() if product_name_tag else "Name not found"
        
#         # Extract current price
#         current_price_tag = product.find('span', class_='current_price')
#         current_price = current_price_tag.find('span', class_='money').get_text().strip() if current_price_tag else "Price not found"
        
#         data.append({'product_name': product_name, 'current_price': current_price})
    
#     return data

# def scrape_view(request):
#     url = 'https://shoparmada.com/collections/gw40k-astra-militarum'
#     data = scrape_shoparmada_astra_militarum(url)
#     return JsonResponse({'products': data})







