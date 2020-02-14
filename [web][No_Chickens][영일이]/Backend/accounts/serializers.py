# Python bytecode 3.7 (3394)
# Embedded file name: C:\Users\ASUS\to_git\ZeroOneTwo\Backend\accounts\serializers.py
# Size of source mod 2**32: 1663 bytes
# Decompiled by https://python-decompiler.com
from rest_framework import serializers
from .models import User, Schedule, Receipt, ExchangeRates, Expenditure
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate


# User = get_user_model()


# class UserCreationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'password')


# class LoginUserSerializer(serializers.Serializer):
#     username = serializers.CharField()
#     password = serializers.CharField()

#     def validate(self, data):
#         user = authenticate(**data)
#         if user:
#             if user.is_active:
#                 return user
#             raise serializers.ValidationError('Unable to log in with provided credentials.')


# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ('id', 'username')


# class UserstatusSerializer(serializers.ModelSerializer):
#     # schedules = ScheduleSerializer(many=True)
#     class Meta:
#         model = User
#         fields = ('id', 'username', 'schedules')


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ('id', 'schedule_name', )


class ExpenditureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expenditure
        fields = ('id', 'receipt', 'item_origin', 'item_trans', 'price',)


class ReceiptSerializer(serializers.ModelSerializer):
    expenditure_set = ExpenditureSerializer(many=True)
    class Meta:
        model = Receipt
        fields = ('id', 'schedule_name', 'place_origin', 'place_trans', 'address_origin', 'address_trans', 'date', 'country', 'total',) + ('expenditure_set',)



class ExchangeRatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRates
        fields = ('id', 'select_date', 'usa', 'japan',)


class ScheduleDetailSerializer(serializers.ModelSerializer):
    receipt_set = ReceiptSerializer(many=True)
    class Meta(ScheduleSerializer.Meta):
        fields = ScheduleSerializer.Meta.fields + ('receipt_set',)


class ReceiptDetialSerializer(serializers.ModelSerializer):
    expenditure_set = ExpenditureSerializer(many=True)
    class Meta(ReceiptSerializer.Meta):
        fields = ReceiptSerializer.Meta.fields + ('expenditure_set',)
