from django.contrib import admin
from django.conf.urls import url
from naver import views
from django.urls import path, include
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework_swagger.views import get_swagger_view

schema_view = get_schema_view(openapi.Info(
    title='OCR PAPAGO API',
    default_version='v1',
    description=
    '''        
    /naver/ : 사진을 처리하여 결과를 보여준다.
    /accounts/ : 사용자가 승인한 결과를 저장하고, 사용자가 요청한 영수증을 보여준다.
    '''),
    validators = ['flex'],
    public=True,
    permission_classes=(AllowAny,)
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('accounts.urls')),
    path('naver/', include('naver.urls')),
    
    path('docs/', (schema_view.with_ui('redoc')), name='api_docs'),
    path('swagger/', (schema_view.with_ui('swagger')), name='api_swagger')
 ]



