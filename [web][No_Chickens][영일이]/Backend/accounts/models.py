# Python bytecode 3.7 (3394)
# Embedded file name: C:\Users\ASUS\to_git\ZeroOneTwo\Backend\accounts\models.py
# Size of source mod 2**32: 1982 bytes
# Decompiled by https://python-decompiler.com
from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass


class Schedule(models.Model):
    schedule_name = models.CharField(max_length=40)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.schedule_name


class Receipt(models.Model):
    schedule_name = models.ForeignKey(Schedule, on_delete=models.CASCADE, blank=True, null=True)
    place_origin = models.CharField(max_length=50, blank=True, null=True)
    place_trans = models.CharField(max_length=50, blank=True, null=True)
    address_origin = models.CharField(max_length=100, blank=True, null=True)
    address_trans = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateTimeField(auto_now=True, blank=True, null=True)
    country = models.CharField(max_length=20)
    exchange = models.FloatField(blank=True, null=True)
    total = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.place_origin


class Expenditure(models.Model):
    receipt = models.ForeignKey(Receipt, on_delete=models.CASCADE)
    item_origin = models.CharField(max_length=50, blank=True, null=True)
    item_trans = models.CharField(max_length=50, blank=True, null=True)
    price = models.FloatField()

    def __str__(self):
        return self.item_origin


class ExchangeRates(models.Model):
    select_date = models.DateField(primary_key=True)
    usa = models.FloatField(blank=True, null=True)
    jpa = models.FloatField(blank=True, null=True)

    def __str__(self):
        return 'exchange rate'