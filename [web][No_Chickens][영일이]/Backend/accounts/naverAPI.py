import os
import sys
import urllib.request
import json
import requests
from IPython import embed
# OCR API 요청
def image_NAVER_AI(img_64):
    comma_idx = img_64.find(',')
    img_64 = img_64[comma_idx+1:]
    TEMPLATE = {
        "images": [
        {
            "format": "jpg",
            "name": "medium",
            "data": img_64
        }
        ],
            "requestId": "string",
            "resultType": "string",
            "timestamp" : "1",
            "version": "V1"
    }
    transmit = json.dumps(TEMPLATE)
    client_secret = 'aUtKVFpZS3NQVFhDU3RZSUJPVEttZnZubHNzWFJjcks='
    data = transmit
    url = "https://4ezihkm520.apigw.ntruss.com/custom/v1/927/f6002cbceb8c0327d974714b8f7a4ba28e25f0b7cbe216a719c35ced1fe9647f/infer"
    request = urllib.request.Request(url)
    request.add_header("X-OCR-SECRET",client_secret)
    request.add_header("Content-Type", "application/json")
    # requests.get(request)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if(rescode==200):
        response_body = response.read()
        fix = response_body.decode('utf-8')
        fix = json.loads(fix)
        # print(fix)
        
        # 결과 값 후 처리
        total = 0
        total_words = ['Total', 'total', 'TOTAL', 'AMOUNT', 'Amount', 'AMT', 'Payment', 'payment']
        empty = []
        real = []
        nums = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        for key, val in fix.items():                                            
            if key == "images":
                real.append('place')
                empty.append('place')
                real.append(val[0]["title"]["inferText"])
                empty.append(val[0]["title"]["inferText"])                                                             
                for k in val[0]["fields"]:
                    if k['inferText'][-1] in nums or k['inferText'][-2] in nums:
                        real.append(k['inferText'])
                        if '$' in k['inferText'] or '.' in k['inferText'] or '・' in k['inferText'] or k['inferText'][-1] == 'T' or k['inferText'][-1] == '0':
                            empty.append(k['inferText'])

    # 후 처리 한 결과 값과 그렇지 않은 결과 값의 차이 비교
        # print(real)
        if len(real) - len(empty) > 6:
            print('안 들어온 값이 많습니다. 계속 진행하시겠습니까?')

    # Key 값 후 처리    
        receipt = {}
        receipt[empty[0]] = {'value': empty[1]}
        for i in range(2, len(empty)):
            if list(empty[i].split()[0])[0] in nums:
                s = empty[i].split()[0][1:]
                if list(empty[i].split()[-1])[-1] in nums or list(empty[i].split()[-1])[-1] == 'T':
                    receipt[s + ' '.join(empty[i].split()[1:-1])] = {'value': empty[i].split()[-1]}
            else:
                if list(empty[i].split()[-1])[-1] in nums or list(empty[i].split()[-1])[-1] == 'T':
                    receipt[' '.join(empty[i].split()[0:-1])] = {'value': empty[i].split()[-1]}


    else:
        print("Error Code:" + rescode)


    # print(receipt)


    # 파파고 번역 시작

    maerong = []

    client_id = "NlmxERtXxumnUqV8ZeWn" # 개발자센터에서 발급받은 Client ID 값
    client_secret = "fHT22NImgb" # 개발자센터에서 발급받은 Client Secret 값
    for key, val in receipt.items():
        if key == '':
            continue
        encText = urllib.parse.quote(key)
        data = "source=en&target=ko&text=" + encText
        url = "https://openapi.naver.com/v1/papago/n2mt"
        request = urllib.request.Request(url)
        request.add_header("X-Naver-Client-Id",client_id)
        request.add_header("X-Naver-Client-Secret",client_secret)
        response = urllib.request.urlopen(request, data=data.encode("utf-8"))
        rescode = response.getcode()
        if(rescode==200):
            response_body = response.read()
            fix2 = response_body.decode('utf-8')
            fix2 = json.loads(fix2)
            translated = fix2["message"]["result"]["translatedText"]
            
            # 예외 처리 
            if translated == '바꾸다':
                translated = '거스름 돈'

            if translated == 'AMT':
                translated = '총'
            
            if translated == '1/015:57p전체:':
                translated = '총'
            if translated == '지불':
                translated = '총'
            if translated == '합계:':
                translated = '총'
            if translated == '전체:':
                translated = '총'
            
            if key == '3:33TOTAL':
                translated = '총'
            
            receipt[key]['ko'] = translated
            

    # print(receipt)

    result = {
        
    }

    useless = ['Cash', 'Change', 'SF * Healthy Surcharge', 'Subtotal', 'Net TTL', '30VAT TTL', 'Credit/Debit', 'Tax', 'Sub-Total', '%GST', 'VISA', 'SUBTOTAL', 'TAX:', 'SUBTOTAL:', 'Subtotal:', 'Tax:']
    result['items'] = []
    for k, v in receipt.items():
        if k == 'place':
            result['place']= receipt[k]['value']

        elif k == '':
            continue

        elif v['ko'] == '총':
            result['total_price'] = receipt[k]['value']

        elif k == '3:33TOTAL':
            result['total_price'] = receipt[k]['value']

        elif k not in useless:
            bb = {}
            bb['ko'] = v['ko']
            if '$' in v['value']:
                v['value'] = v['value'].replace("$", "")
                v['value'] = float(v['value'])
                bb['value'] = v['value']
            else:
                bb['value'] = float(v['value'])
            result['items'].append(bb)
        


    if '$' in result['total_price']:
        result['total_price'] = float(result['total_price'].replace("$", ""))

    return result