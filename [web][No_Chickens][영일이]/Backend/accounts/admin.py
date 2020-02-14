from django.contrib import admin
from .models import *


# Register your models here.

# class HashtagAdmin(admin.ModelAdmin):
#     list_display = ('content', )

# admin.site.register(Hashtag, HashtagAdmin)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('id', 'schedule_name',)


class ReceiptAdmin(admin.ModelAdmin):
    list_display = ('id', 'schedule_name', 'place_origin', 'place_trans', 'address_origin', 'address_trans', 'date', 'country', 'exchange', 'total',)


class ExpenditureAdmin(admin.ModelAdmin):
    list_display = ('id', 'receipt', 'item_origin', 'item_trans', 'price',)


class ExchangeRatesAdmin(admin.ModelAdmin):
    list_display = ('select_date', 'usa', 'jpa',)


admin.site.register(Schedule, ScheduleAdmin)
admin.site.register(Receipt, ReceiptAdmin)
admin.site.register(Expenditure, ExpenditureAdmin)
admin.site.register(ExchangeRates, ExchangeRatesAdmin)