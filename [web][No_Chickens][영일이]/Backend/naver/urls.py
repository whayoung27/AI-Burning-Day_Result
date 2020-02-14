from django.urls import path
from django.conf.urls import url
from . import views


# 이 앱은 이미지 파일을 사용자로부터 받고, 처리된 결과를 사용자에게 보내준다.


app_name = 'naver'


urlpatterns = [
    path('v1/images/', views.image_check), 
    # path('exchange/<int:mx>/', views.exchange),
    path('rate/<date>/<country>/', views.get_rate),
 ]