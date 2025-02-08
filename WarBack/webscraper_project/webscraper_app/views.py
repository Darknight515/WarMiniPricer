from django.http import JsonResponse
from .models import MiniData, CurrentPrice

import os
import json


def mini_data_list(request):
    mini_data_queryset = MiniData.objects.all()
    
    # Manually serialize QuerySet to list of dictionaries
    mini_data_list = list(mini_data_queryset.values())
    
    # Return JsonResponse with the serialized data
    return JsonResponse({'mini_data_list': mini_data_list}, safe=False)


def read_spider_data(request):
    # Construct the relative path to the data directory
    data_directory = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'warscraper/output')
    json_data = []
    for filename in os.listdir(data_directory):
        if filename.endswith('.json'):
            with open(os.path.join(data_directory, filename), 'r') as f:
                json_data.append(json.load(f))

    # Insert data into the database
    for data in json_data:
        for item in data:
            mini, created = MiniData.objects.get_or_create(
                name=item['name'],
                defaults={'faction': item.get('category', 'Unknown')}
            )
            if 'price' in item:
                CurrentPrice.objects.update_or_create(
                    mini=mini,
                    defaults={'price': Decimal(item['price'])}
                )

    return JsonResponse({'status': 'success', 'data': json_data}, safe=False)