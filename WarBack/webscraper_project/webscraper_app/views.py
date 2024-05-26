from urllib import request
from django.shortcuts import render
# from bs4 import BeautifulSoup
from django.http import JsonResponse
from .models import MiniData
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
    

@api_view(['GET'])
def read_armada_scrape(request):
    json_data = []
    for file_name in os.listdir(data_directory):
        if file_name.endswith('.json'):
            with open(os.path.join(data_directory, file_name), 'r') as f:
                json_data.append(json.load(f))
    context = {'json_data': json_data}
    return Response(context, status=status.HTTP_200_OK)