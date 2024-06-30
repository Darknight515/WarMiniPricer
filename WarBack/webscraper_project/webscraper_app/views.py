from decimal import Decimal, InvalidOperation
from urllib import request
from django.shortcuts import render
# from bs4 import BeautifulSoup
# from bs4 import BeautifulSoup
from django.http import JsonResponse
# from .models import MiniData
from .models import *
from .serializers import MiniSerializer
from pathlib import Path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import os
import json

data_directory = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'webscraper_app/data')


@api_view(['GET','POST'])
def mini_list(request):

    if request.method == 'GET':
        mini = MiniData.objects.all()
        serializer = MiniSerializer(mini, many = True)
        # return JsonResponse({"minis": serializer.data})
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = MiniSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def mini_detail(request, id):
    
    try:
        mini = MiniData.objects.get(pk=id)
    except MiniData.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MiniSerializer(mini)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = MiniSerializer(mini, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        mini.delete() 
        # risky and update hte confirmation should be done by the front end
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# @api_view(['GET'])
# def read_armada_scrape(request):
#     json_data = []
#     for file_name in os.listdir(data_directory):
#         if file_name.endswith('.json'):
#             with open(os.path.join(data_directory, file_name), 'r') as f:
#                 json_data.append(json.load(f))
#     context = {'json_data': json_data}
#     return Response(context, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
def read_armada_scrape(request):
    if request.method == 'GET':
        json_data = []
        for file_name in os.listdir(data_directory):
            if file_name.endswith('.json'):
                with open(os.path.join(data_directory, file_name), 'r') as f:
                    json_data.append(json.load(f))
        context = {'json_data': json_data}
        return Response(context, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        errors = []
        for file_name in os.listdir(data_directory):
            if file_name.endswith('.json'):
                with open(os.path.join(data_directory, file_name), 'r') as f:
                    data = json.load(f)
                    mini_data = MiniData()
                    for item in data:
                        try:
                            # print(item)
                            # Create or update MiniData instance
                            # MiniData.objects.update_or_create(
                            mini_data, created = MiniData.objects.update_or_create(
                                name=item.get('name'),
                                faction=item.get('category'),
                            )
                            # Convert price value to a decimal number
                            price_str = item.get('price')
                            price_str = price_str.replace('$', '').replace(',', '').strip()  # Remove currency symbols and commas
                            print(price_str)
                            # price_str = item.get('price', '0')  # Get price value from JSON, default to '0' if not available

                            if created:
                                mini_data_id = mini_data.id
                                print(f'New MiniData created with ID: {mini_data_id}')
                            else:
                                mini_data_id = mini_data.id
                                print(f'Existing MiniData updated with ID: {mini_data_id}')
                            

                            try:
                                price = Decimal(price_str)  # Convert to Decimal
                            except InvalidOperation:
                                return Response({"error": f"Invalid price value: {price_str}"}, status=status.HTTP_400_BAD_REQUEST)

                            # Retrieve or create CurrentPrice instance
                            CurrentPrice.objects.get_or_create(
                                mini_id=mini_data.id,
                                # price= price
                                defaults={'price': price}
                                # defaults={'Price': price,
                                #         'MiniId': mini_data_id}
                            )
                        except Exception as e:
                            errors.append(f"Error processing item '{item}': {str(e)}")
            if errors:
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Data has been successfully saved to the database."}, status=status.HTTP_201_CREATED)

