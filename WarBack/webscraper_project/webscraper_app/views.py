from django.shortcuts import render
from bs4 import BeautifulSoup
from django.http import JsonResponse
import requests
# Create your views here.

def scrape_website(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text,'html.parser')
    spans = soup.find_all('div')
    text_content = []
    for span in spans:
        text_content.append(span.get_text())
    return text_content


def scrape_view(request):
    url = 'https://www.warhammer.com/en-US/shop/warhammer-40000/armies-of-the-imperium/astra-militarum'
    data = scrape_website(url)
    return JsonResponse({'headings': data})
