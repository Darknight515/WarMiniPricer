from webscraper_app.views import *
from django.urls import path


urlpatterns = [
    path('', mini_list),
    path('<int:id>/', mini_detail),
    path('armada/', read_armada_scrape),
    # path('scrape/',scrape_view, name='scrape')
    # decalre the path of the desired model function
]