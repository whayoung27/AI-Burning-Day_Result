from django.shortcuts import render, redirect, get_object_or_404, HttpResponse
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from IPython import embed
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .serializers import *
from naver.classify import is_receipt
from .naverAPI import image_NAVER_AI
import json

# POST
@csrf_exempt
def save_receipt(requests):
    img_file = requests.FILES['file']
    result = is_receipt(img_file) # 영수증 전처리
    if not result:
        data = {
            'result': False
        }
        return JsonResponse(data)
    else:
        img_base64 = requests.POST.get('imgBase64')
        result = image_NAVER_AI(img_base64)
        data = {
            'place_origin' : result.get('place'),
            'plcae_trans' : '',
            'country' : 'usa',
            'total' : result.get('total_price'),
            'goods' : result.get('items')
        }

        receipt = Receipt.objects.create(
            place_origin = data.get('place_origin'),
            place_trans = '',
            country = 'usa',
            total = data.get('total'),
        )
        receipt.save()
        serializer = ReceiptSerializer(receipt)
        objs = Receipt.objects.get(id=serializer.data.get('id')) # serializer.data.get('id')
        data['id'] = objs.id
        return JsonResponse(data)

# 해당하는 결과가 모두 형한테 넘어감
# 그러면 형은 하나하나 저장. 항목을 저장 -> 그런데 이건 진짜 저장이 아니라, 임시 저장
# 영수증을 저장하면 그때 저장하는 것



# POST
@csrf_exempt
def decide_receipt(request, pk): # 영수증을 저장
    receipt = Receipt.objects.filter(pk=pk)[0]
    schedule = request.POST # param 값이 넘어오면 그걸 전해준다.
    receipt.schedule_name = schedule
    result = {
        'msg': True,
    }
    return JsonResponse(result)


# POST
@csrf_exempt
def decide_receipt(request, pk):
    body = json.loads(request.body)  
    schedule_pk = body.get('schedule_pk')

    receipt = Receipt.objects.get(pk=pk)
    schedule = Schedule.objects.get(pk=schedule_pk)
    
    receipt.schedule_name = schedule
    receipt.save()

    for good in body.get('goods'):
        expenditure = Expenditure.objects.create(
            receipt = receipt,
            item_trans = good.get('ko'),
            price = good.get('value'),
        )
        expenditure.save()
    
    result = {
        'msg': True,
    }
    return JsonResponse(result)



######################################
# POST
@csrf_exempt
def save_expenditure(requests, pk):
    # 상세 항목 저장
    # 항목 하나하나 날라오면 그걸 저장
    params = requests.POST # 스케줄, 아이템 이름, 가격 등의 정보가 옵니다...
    receipt = Receipt.objects.filter(id=pk)[0]
    expenditure = Expenditure.objects.create(
        receipt = receipt,
        item_origin = '',
        item_trans = '',
        price = '',
    )
    expenditure.save()
    # 근데 만약 해당하는 객체가 없으면 만들어야 함
    # 하나하나를 저장해준다.
    result = {
        'msg' : True
    }
    return JsonResponse(result)
######################################




# GET
@api_view(('GET',))
def get_schedule(request, pk):
    schedule = Schedule.objects.all().filter(pk=pk)
    serializer = ScheduleDetailSerializer(schedule, many=True)
    # 여기에 해당하는 모든 영수증을 가져온 뒤, 거기에 해당하는 모든 상세 항목을 가져오자
    return Response(serializer.data)
# GET
@api_view(('GET',))
def get_receipts(requests, pk):
    receipt = Receipt.objects.all().filter(pk=pk)
    serializer = ReceiptDetialSerializer(receipt, many=True)
    return Response(serializer.data)
@api_view(('GET',))
def get_schedules(requests):
    data = Schedule.objects.all()
    serializer = ScheduleSerializer(data, many=True)
    return Response(serializer.data)



# from django.shortcuts import render
# from django.shortcuts import get_object_or_404
# from django.http import HttpResponse
# from rest_framework.decorators import api_view, permission_classes
# from rest_framework.permissions import AllowAny
# from rest_framework.response import Response
# from .models import User, Schedule, Expenditure, ExchangeRates, Receipt
# from .serializers import UserstatusSerializer, ScheduleSerializer, ExchangeRatesSerializer, ExpenditureSerializer, ReceiptSerializer, UserCreationSerializer, LoginUserSerializer
# from .serializers import UserSerializer


# # 1. 회원가입 - 회원가입 함수

# @api_view(['POST'])
# @permission_classes([AllowAny, ])
# def signup(request):
#     serializer = UserCreationSerializer(data=request.data)
#     if serializer.is_valid():
#         user = serializer.save()
#         user.set_password(user.password)
#         user.save()
#         return Response(status=200, data={'message': '회원가입 성공'})

# # # 2. 로그인 - 로그인 함수
# @api_view(['GET'])
# def login(request):
#     # 회원가입이 되어있는 지 확인 / 되어있으면 토큰 주면 됨!
#     serializer = LoginUserSerializer(data=request.data)
#     if serializer.is_valid():
#         # 토큰을 날린다(어떻게?)
#         return Response()
#     # 안 되어있으면 에러메시지와 돌려보내!


# # 3. 유저 디테일 - 회원의 지출 기록 페이지로 연결해주는  함수
# @api_view(['GET'])
# def user_detail(request):
#     user = request.user
#     serializer = ScheduleSerializer(user)
#     return Response(serializer.data)

# # # 4. 로그아웃 - 로그아웃 함수
# # def logout(request):
# #     return 


# # # 5. 스케줄 명을 설정해야 DB를 가계부 차트에 보여준다!
# # def set_folder(request):
# #     return