from django.db import models


# class Translate(models.Model):
#     # 실제 파파고에서 사용하는 국가 줄임말 / 이미지 업로드 순간을 위해
#     country = (
#         ("en", "영어"),
#         ('ja', '일본어'),
#         ('zh-CN', '중국어'),
#         ('es', '스페인어'),
#         ('fr', '프랑스어'),
#         ('de', '독일어'),
#         ('ru', '러시아어'),
#         ('vi', '베트남어')
#     )
    
#     translate = models.CharField(primary_key = True, max_length = 100, choices=country)

class Temp(models.Model):
    content = models.CharField(max_length=10000)



