from rest_framework import serializers
from .models import Temp


# class TranslateSerializer(serializers.HyperlinkedModelSerializer):
#     # translate = serializers.CharField(max_length = 100)
#     class Meta:
#         model = Translate
#         fields = ('translate',)


class TempSerializer(serializers.ModelSerializer):
    content = serializers.CharField()

    class Meta:
        model = Temp
        fields = ('content',)