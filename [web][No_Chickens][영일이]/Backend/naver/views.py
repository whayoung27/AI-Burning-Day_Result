from django.shortcuts import render, redirect, get_object_or_404, HttpResponse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from IPython import embed
from rest_framework.response import Response
from rest_framework.decorators import api_view
from accounts.forms import imageForm
from IPython import embed
from django.views.decorators.csrf import csrf_exempt
from accounts.models import ExchangeRates
import datetime


@csrf_exempt
def image_check(request):
    if request.method == 'POST':
        # 사진이 들어온 건 request.FILES['param']
        # 정보는 request.POST['']
        context = {
            'result': True
        }
        embed()
        return JsonResponse(context)
    else:
        context = {
            'result': 'checking'
        }
        return JsonResponse(context)


def exchange(request, mx):
    import urllib.request
    import requests
    import json
    import datetime

    exchange_SECRET_KEY="CQJZGTj2RAQYrW61ldyW2PYU4MPhBzKM"

    for i in range(0, mx):
        right = str(datetime.datetime.now() - datetime.timedelta(days=i))
        day = right[0:4] + right[5:7] + right[8:10]
        url = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=CQJZGTj2RAQYrW61ldyW2PYU4MPhBzKM&searchdate={}&data=AP01'.format(day)
        exchange = requests.get(url).json()
        for info in exchange:
            if info['cur_unit'] == 'USD':
                # DB에 저장
                unit = ExchangeRates.objects.create(
                    select_date = '{}-{}-{}'.format(day[0:4], day[4:6], day[6:8]),
                    usa = float(info['ttb'].replace(',','')),
                    jpa = 10,
                )
                unit.save()
    data = {
        'result' : True,
    }
    return JsonResponse(data)


@api_view(('GET',))
def get_rate(request, date, country):
    date = datetime.date(int(date[0:4]), int(date[4:6]), int(date[6:8]))
    rates = ExchangeRates.objects.get(select_date=date)
    data = {
        'result' : rates.usa
    }
    return JsonResponse(data)