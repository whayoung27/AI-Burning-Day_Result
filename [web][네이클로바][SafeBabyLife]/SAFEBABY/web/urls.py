from django.urls import path
from web import views
from . import views


app_name='web'

urlpatterns = [
    path('', views.index, name='index'),
    path('check/', views.check, name='check'),
    path('save/', views.save, name='save'),
    # api 호출
    path('getValue/', views.getValue, name='getValue'),
    path('getFirstImage/', views.getFirstImage, name='getFirstImage')


]
