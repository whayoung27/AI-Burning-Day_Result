import urllib
import urllib.request
import smipy
import os
import pandas as pd

import re
from prepare import get_save_path

CSV_ENCODING = 'cp949'

###############################
#
#   번역 쪼개서도 가능함. 근데 굳이 그래야 할까?
#   일단 너무많이 한번에 하면 안된다는거만 알자.
#
###############################
NAVER_CLIENT_ID = '78kh5kk9mi'
with open('./secret.txt', 'r') as f:
    NAVER_CLIENT_SECRET = f.read()
NAVER_CLIENT_SECRET = NAVER_CLIENT_SECRET.strip()

def papago_translate(text, verbose = False):


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
    # "translatedText": "우리 형이 버나뎃을 엄청 좋아해요\n다시 인도로 돌아가는 거야?"
    testparser = re.compile('"translatedText"\s?:\s?"(.*)"')


    encText = urllib.parse.quote(text)
    data = "source=en&target=ko&text=" + encText
    url = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation"
    request = urllib.request.Request(url)
    request.add_header("X-NCP-APIGW-API-KEY-ID", NAVER_CLIENT_ID)
    request.add_header("X-NCP-APIGW-API-KEY", NAVER_CLIENT_SECRET)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if (rescode == 200):
        response_body = response.read()
        if verbose:
            print(response_body.decode('utf-8')[:1000])
            text = testparser.findall(response_body.decode('utf-8'))[0]
        return text
    else:
        print("Error Code:" + rescode)
        return None


if __name__ == '__main__':
    author = 'YB'
    csv_loc = './translate'
    csvnames = ['testbb501.csv']

    for csvname in csvnames:
        df = pd.read_csv(os.path.join(csv_loc, csvname), encoding=CSV_ENCODING)
        engsubs = ['{}'.format(str) for str in list(df['eng']) if type(str) == type('line')][:100]
        engsubs = '\n'.join(engsubs)

        # get data
        kortexts = papago_translate(engsubs, verbose = True)
        korsubs = kortexts.split('\\n')

        korsubs = pd.Series(korsubs)
        df.insert(loc=5, column='kor_trans', value=korsubs)

        save_path = get_save_path(dir = csv_loc, name = csvname.split('.')[0] + '_t', format='csv', replace = False)


        df.to_csv(save_path, encoding=CSV_ENCODING)