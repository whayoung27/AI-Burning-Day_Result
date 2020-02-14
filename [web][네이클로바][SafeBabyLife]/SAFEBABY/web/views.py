from django.shortcuts import render
from decouple import config
from rest_framework.response import Response
from rest_framework.decorators import api_view
from . import framecut
import json
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..ai-model import openpose1
from .functions import makebox

nImage = 0

# Create your views here.
def index(request):
    return render(request, 'web/index.html')

def check(request):
    key = config("KAKAOJSKEY")
    ctx = {
        "kakaojskey": key
    }
    data = json.dumps(ctx)
    return render(request,'web/check.html',{"data":data})


@api_view(['POST'])
def save(request):
    # 1. 요청 왔을 때 침대 가드 가장자리 좌표 받기
    print(request)

    # 2. '프레임 짜르기' 실행하기
    nImage = framecut.framecut()

    # 3. 각 프레임(사진, 이미지)을 처리하는 반복문
    # 3-1. 아이의 스켈레톤과 함께 처리되어 나온 결과(좌표, 사진) 받기
    # 3-2. 해당 좌표들과 처음에 받은 침대 가드 좌표를 비교해서 상황 판단하기
    
    # 4-1. 안전 상황이면 반복문 끝날 때까지 돌리고
    # 4-2. 위험 상황이면 알람 때리고, 반복문 다시 돌거나, 프론트에 응답 주기

    pass
    # return 

def test(request):
    return render(request, 'web/test.html')

@api_view(['POST'])
def getValue(request):
    # print(json.loads(request.body))
    # 포인트 4개가 전달되었을 때 처리하는 로직
    # 모델 라이브러리 호출

    data = json.loads(request.body)
    # print(data)

    bedXY = [((data.points[0].x + data.points[1].x)/2, (data.points[0].y + data.points[1].y)/2), ((data.points[1].x + data.points[2].x)/2, (data.points[1].y + data.points[2].y)/2),
    ((data.points[2].x + data.points[3].x)/2, (data.points[2].y + data.points[3].y)/2), ((data.points[3].x + data.points[1].x)/2, (data.points[3].y + data.points[1].y)/2)]

    for i in range(nImage):
        data = openpose1.openpose1() # 스켈레톤 좌표 돌려줌
        sumx = 0
        sumy = 0
        cnt = 0
        minx = 10000
        miny = 10000
        maxx = -1
        maxy = -1
        for j in len(data):
            if(data[j][j+1].x != ''):
                cnt += 1
                if (minx > data[j][j+1].x):
                    minx = data[j][j+1].x
                if (miny > data[j][j+1].y):
                    miny = data[j][j+1].y
                if (maxy > data[j][j+1].y):
                    maxy = data[j][j+1].y
                if (maxx > data[j][j+1].x):
                    maxx = data[j][j+1].x
                sumx += data[j][j+1].x
                sumy += data[j][j+1].y

        naverXY = makebox.makebox() # 중심좌표 돌려줌.
        # 두개 합쳐서 산술평균 내서 그냥 사람의 (포즈)사이즈와, 저 둘 좌표의 평균 내면 
        # 우리가 판단한 사람 중심이 나오고 
        peopleXY = ((naverXY[0] + (sumx/cnt)) / 2, (naverXY[1] + (sumy/cnt)) / 2)

        # 가이드라인의 중심점 4개와 거리를 계산해서.  거리가 사람의 사이즈의 30% 이런식이면 카톡으로 트리거.
        for j in len(bedXY):
            if (abs(bedXY[j][0]-peopleXY[0])**2+abs(bedXY[j][1]-peopleXY[1])**2)**0.5 < (((maxx-minx)**2+(maxy-miny)**2)**0.5)*3/10:
                # 위험 상황
                return Response(status=500)
        
    # output 폴더에 json과 사진이 있다.
    # 위험상황이면 전송하고 , json 만 분석.
    # axios.post()

    # 정상 상황
    return Response(status=200)

@api_view(['GET'])
def getFirstImage(request):
    framecut.framecut()
    # 우리가 가지고 있는 image 중에서 첫 이미지만 전달하면 됨
    # 주소만 전달.
    import base64
    import os

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    path = os.path.join(BASE_DIR, "images", "test2.jpg")
    
    with open(path, "rb") as image_file:
        ss = base64.b64encode(image_file.read())
        return HttpResponse(ss, content_type="image/jpg")
        #encoded_string = base64.b64encode(image_file.read())
    
    return Response(data=encoded_string, status=200 ) 



