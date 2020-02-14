from django.conf.urls import url, include 
from django.urls import path
from . import views

# 이 앱은 회원 정보를 관리한다.
# 회원은 자신의 폴더를 관리할 수 있다. 
# 사전에 작성한 모델들을 이 앱에 작성한다.

app_name = 'accounts'

urlpatterns = [
    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('signup/', views.signup),
    # path('login/', views.login),
    path('v1/details/<int:pk>/', views.save_expenditure), # 세부 항목 저장
    path('v1/receipt/', views.save_receipt), # 영수증 하나 저장
    path('v1/receipt/<int:pk>/', views.decide_receipt),
    path('v1/receipts/<int:pk>/', views.get_receipts), # 영수증 전체 가져오기
    path('v1/schedule/<int:pk>/', views.get_schedule),
    path('v1/schedules/', views.get_schedules),
]
