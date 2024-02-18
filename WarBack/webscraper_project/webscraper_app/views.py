from django.shortcuts import render
from bs4 import BeautifulSoup
from django.http import JsonResponse

import requests
# Create your views here.



def scrape_website(url):
    response = requests.get(url)
    print("URL Response Status:", response.status_code)

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extracting all product details divs
    product_details_divs = soup.find_all('div', class_='product-details')
    print("Product Details Elements found: ", bool(product_details_divs))
    
    data = []
    for product in product_details_divs:
        # Extract product name
        product_name_tag = product.find('span', class_='title')
        product_name = product_name_tag.get_text().strip() if product_name_tag else "Name not found"
        
        # Extract current price
        current_price_tag = product.find('span', class_='current_price')
        current_price = current_price_tag.find('span', class_='money').get_text().strip() if current_price_tag else "Price not found"
        
        data.append({'product_name': product_name, 'current_price': current_price})
    
    return data

def scrape_view(request):
    url = 'https://shoparmada.com/collections/gw40k-astra-militarum'
    data = scrape_website(url)
    return JsonResponse({'products': data})