from rest_framework import serializers
from .models import MiniData



class MiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = MiniData  # Correct the typo here
        fields = ['id', 'name', 'faction']




