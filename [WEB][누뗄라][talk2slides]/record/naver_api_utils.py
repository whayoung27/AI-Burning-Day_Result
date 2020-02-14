import sys
import requests
import io
import getpass

def parse_audio(client_id, client_secret, audio_bytes, lang="Kor"):
    # 언어 코드 ( Kor, Jpn, Eng, Chn )
    url = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + lang
    data = io.BytesIO(audio_bytes) # made it to read in bytes object
    headers = {
        "X-NCP-APIGW-API-KEY-ID": client_id,
        "X-NCP-APIGW-API-KEY": client_secret,
        "Content-Type": "application/octet-stream"
    }
    response = requests.post(url, data=data, headers=headers)
    rescode = response.status_code
    if(rescode == 200):
        print (response.json())
        return response.json()['text']
    else:
        print("Error : " + response.text)
        return None

def generate_image(search_text, client_id, client_secret):
    url = "https://openapi.naver.com/v1/search/image"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    }
    response = requests.get(url, headers=headers,
                            params={
                                'query':search_text.encode('utf8')

                            })
    rescode = response.status_code
    if(rescode == 200):
        return "\n![" + response.json()['items'][0]['title'] + ']' + '({})\n'.format(response.json()['items'][0]['link'])
        # print('<!-- .slide: data-background="{}" -->'.format(response.json()['items'][0]['link']))
    else:
        print("Error : " + response.text)
        return None


def generate_background(search_text, client_id, client_secret):
    url = "https://openapi.naver.com/v1/search/image"
    headers = {
        "X-Naver-Client-Id": client_id,
        "X-Naver-Client-Secret": client_secret
    }
    response = requests.get(url, headers=headers,
                            params={
                                'query': search_text.encode('utf8')

                            })
    rescode = response.status_code
    if (rescode == 200):
        return '\n<!-- .slide: data-background="{}" -->\n'.format(response.json()['items'][0]['link'])
    else:
        print("Error : " + response.text)
        return None