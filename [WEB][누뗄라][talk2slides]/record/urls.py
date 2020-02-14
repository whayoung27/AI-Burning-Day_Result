from django.urls import re_path, path

from . import views

app_name = 'record'
urlpatterns = [
    path('receive', views.receive, name='receive'),
    re_path(r'(?P<current_template>.*)$', views.index, name='index'),
]