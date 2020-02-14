import urllib.request as request
import urllib
import os

NAVER_CLIENT_ID = '78kh5kk9mi'
NAVER_CLIENT_SECRET = 'AKJs0yNZDJXyOmMATctaczO1UQJqoadr4lGf5nSv'

test_string = ["Leonard, you may not have noticed, ",
               "but I am being a delight here.",
               " And you're not holding up your end of the evening.",
               "Oh, sorry.",
               "This wedding just reminds me of my kinda-sorta girlfriend 9,000 miles away."
]

'''
POST /nmt/v1/translation HTTP/1.1
HOST: naveropenapi.apigw.ntruss.com
User-Agent: curl/7.49.1
Accept: */*
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-NCP-APIGW-API-KEY-ID: {애플리케이션 등록 시 발급받은 client id 값}
X-NCP-APIGW-API-KEY: {애플리케이션 등록 시 발급받은 client secret 값}
Content-Length: 51
'''


test_string = '\n'.join(test_string)
encText = urllib.parse.quote(test_string)
data = "source=en&target=ko&text=" + encText
url = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation"
request = urllib.request.Request(url)
request.add_header("X-NCP-APIGW-API-KEY-ID",NAVER_CLIENT_ID)
request.add_header("X-NCP-APIGW-API-KEY",NAVER_CLIENT_SECRET)
response = urllib.request.urlopen(request, data=data.encode("utf-8"))
rescode = response.getcode()
if(rescode==200):
    response_body = response.read()
    print(response_body.decode('utf-8'))
else:
    print("Error Code:" + rescode)





# import requests
#
# import pandas as pd
#

#
# NAVER_CLIENT_ID = '78kh5kk9mi'
# NAVER_CLIENT_SECRET = 'AKJs0yNZDJXyOmMATctaczO1UQJqoadr4lGf5nSv'
#
# option = {}
#
# requests.get(dict(
#     url = '',#'https://openapi.naver.com/v1/search/image'
#
#     headers = {
#         'X-Naver-Client-Id' : NAVER_CLIENT_ID,
#         'X-Naver-Client-Secret' : NAVER_CLIENT_SECRET
#
#     }
#
# ))