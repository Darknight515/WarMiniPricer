from datetime import timedelta
from django.utils import timezone
from django.http import JsonResponse
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.cache import cache
from django.forms.models import model_to_dict
from decimal import Decimal
from .models import MiniData, CurrentPrice, DatePrice, MSRP

import os
import json


def mini_data_list(request):
    # Get all minis with their current prices
    minis = MiniData.objects.all()
    mini_data_list = []
    for mini in minis:
        try:
            # current_price = mini.current_prices.first()
            current_price = CurrentPrice.objects.get(mini=mini)
            # price = str(current_price.price) if current_price else None
            price = str(current_price.price) if minis else None
        except CurrentPrice.DoesNotExist:
            price = None

        mini_dict = {
            'id': mini.id,
            'name': mini.name,
            'image_url': mini.image_url,
            'faction': mini.faction,
            'price': price
        }
        mini_data_list.append(mini_dict)

    return JsonResponse({'mini_data_list': mini_data_list}, safe=False)


def read_spider_data(request):
    # Construct the relative path to the data directory
    data_directory = os.path.join(os.path.dirname(
        os.path.dirname(os.path.dirname(__file__))), 'warscraper/output')
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


def mini_price_history(request, mini_id):
    """
    Returns the price history for a single mini.
    Supports pagination via ?page= and ?page_size= query params.
    """
    try:
        mini = MiniData.objects.get(id=mini_id)
    except MiniData.DoesNotExist:
        return JsonResponse({'error': 'Mini not found'}, status=404)

    dp_qs = DatePrice.objects.filter(mini=mini).order_by('date_price')
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 10)
    paginator = Paginator(dp_qs, page_size)
    try:
        dp_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        dp_page = paginator.page(1)
    price_history = list(dp_page.object_list.values('date_price', 'price'))
    data = {
        'mini': mini.name,
        'price_history': price_history,
        'total_pages': paginator.num_pages,
        'current_page': dp_page.number,
    }
    return JsonResponse(data)


def multiple_mini_price_history(request):
    """
    Accepts a comma separated list of mini IDs via the 'mini_ids' query parameter.
    Example: /api/price-history/?mini_ids=1,2,3&page=1&page_size=10
    """
    mini_ids_str = request.GET.get('mini_ids', None)
    if not mini_ids_str:
        return JsonResponse({'error': 'No mini_ids provided'}, status=400)
    try:
        mini_ids = [int(x) for x in mini_ids_str.split(',')]
    except ValueError:
        return JsonResponse({'error': 'Invalid mini_ids provided'}, status=400)

    dp_qs = DatePrice.objects.filter(
        mini_id__in=mini_ids).order_by('mini', 'date_price')
    page = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 10)
    paginator = Paginator(dp_qs, page_size)
    try:
        dp_page = paginator.page(page)
    except (PageNotAnInteger, EmptyPage):
        dp_page = paginator.page(1)
    price_history = list(dp_page.object_list.values(
        'mini', 'date_price', 'price'))
    data = {
        'price_history': price_history,
        'total_pages': paginator.num_pages,
        'current_page': dp_page.number,
    }
    return JsonResponse(data)


def mini_msrp(request, mini_id):
    """
    Returns the MSRP for a single mini.
    """
    try:
        msrp_obj = MSRP.objects.get(mini__id=mini_id)
    except MSRP.DoesNotExist:
        return JsonResponse({'error': 'MSRP not found for mini'}, status=404)
    data = {
        'mini': msrp_obj.mini.name,
        'msrp': str(msrp_obj.msrp)
    }
    return JsonResponse(data)


def multiple_msrp(request):
    """
    Returns MSRP for multiple minis.
    Accepts comma separated mini IDs via the 'mini_ids' query parameter.
    Example: /api/msrp/?mini_ids=1,2,3
    """
    mini_ids_str = request.GET.get('mini_ids', None)
    if not mini_ids_str:
        return JsonResponse({'error': 'No mini_ids provided'}, status=400)
    try:
        mini_ids = [int(x) for x in mini_ids_str.split(',')]
    except ValueError:
        return JsonResponse({'error': 'Invalid mini_ids provided'}, status=400)
    msrp_qs = MSRP.objects.filter(mini__id__in=mini_ids)
    msrp_list = [
        {'mini': msrp.mini.name, 'msrp': str(msrp.msrp)}
        for msrp in msrp_qs
    ]
    return JsonResponse({'msrp': msrp_list})


def mini_detail(request, mini_id):
    """
    Returns all data related to a single mini:
      - Mini details (from MiniData)
      - Current price (from CurrentPrice)
      - MSRP (from MSRP)
      - Complete price history (from DatePrice)
    """
    try:
        mini = MiniData.objects.get(id=mini_id)
    except MiniData.DoesNotExist:
        return JsonResponse({'error': 'Mini not found'}, status=404)

    mini_data = model_to_dict(mini)

    # Get current price
    try:
        current_price_obj = CurrentPrice.objects.get(mini=mini)
        current_price = str(current_price_obj.price)
    except CurrentPrice.DoesNotExist:
        current_price = None

    # Get MSRP
    try:
        msrp_obj = MSRP.objects.get(mini=mini)
        msrp_val = str(msrp_obj.msrp)
    except MSRP.DoesNotExist:
        msrp_val = None

    # Get full price history ordered by date
    price_history = list(
        DatePrice.objects.filter(mini=mini)
        .order_by('date_price')
        .values('date_price', 'price')
    )

    data = {
        'mini': mini_data,
        'current_price': current_price,
        'msrp': msrp_val,
        'price_history': price_history,
    }
    return JsonResponse(data)


def recent_price_changes(request):
    """
    Returns only minis that have had a price change in the last 60 days.
    A price change is defined as having at least two price records within that period
    where the two most recent prices are different.
    """
    cache_key = 'recent_price_changes'
    cached_data = cache.get(cache_key)
    cutoff_date = timezone.now().date() - timedelta(days=60)
    # Get distinct mini IDs with at least one price record in the last 60 days
    mini_ids = DatePrice.objects.filter(date_price__gte=cutoff_date) \
                                .values_list('mini_id', flat=True).distinct()
    mini_list = MiniData.objects.filter(id__in=mini_ids)

    recent_minis = []
    for mini in mini_list:
        # Get all price records in the last 60 days ordered by date descending
        dp_records = list(
            DatePrice.objects.filter(mini=mini, date_price__gte=cutoff_date)
            .order_by("-date_price")
        )
        # Only consider minis with at least two records
        if len(dp_records) >= 2:
            new_price = dp_records[0].price
            previous_price = dp_records[1].price
            # Only include if the most recent two prices differ (i.e. a change occurred)
            if new_price != previous_price:
                try:
                    current_price_obj = CurrentPrice.objects.get(mini=mini)
                    current_price = str(current_price_obj.price)
                except CurrentPrice.DoesNotExist:
                    current_price = None

                mini_dict = {
                    'id': mini.id,
                    'name': mini.name,
                    'faction': mini.faction,
                    'image_url': mini.image_url,
                    'new_price': str(new_price),
                    'previous_price': str(previous_price),
                    'current_price': current_price,
                }
                recent_minis.append(mini_dict)
    return JsonResponse({'recent_minis': recent_minis})
