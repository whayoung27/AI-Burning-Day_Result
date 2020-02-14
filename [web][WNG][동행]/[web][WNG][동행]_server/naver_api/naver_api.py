import json
import requests
import urllib.request


with open('./config.json') as config_file:
    key = json.load(config_file)

client_id = key['id']
client_secret = key['secret']



## api call for Clova Speech Recognize
## CSR(audio_file) and it will return status code and recognized text
def CSR(input_file):
    CSR_URL = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt"
    lang = "Kor"
    
    CSR_URL += "?lang=" + lang

    headers = {
        "Content-Type": "application/octet-stream",
        "X-NCP-APIGW-API-KEY-ID" : client_id,
        "X-NCP-APIGW-API-KEY" : client_secret,
    }

    response = requests.post(CSR_URL, data=input_file, headers=headers)
    
    ret = {
        "response_code" : response.status_code,
        "response_content" : response.text
    }

    response_status(ret)

    return ret




## api call for Clova Speech Synthesis
## CSS(text) : this will return mp3 binary file of given text
def CSS(input_text):
    CSS_URL = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts"
    encText = urllib.parse.quote(input_text)

    data = "speaker=mijin&speed=0&text=" + encText

    request = urllib.request.Request(CSS_URL)
    request.add_header("X-NCP-APIGW-API-KEY-ID", client_id)
    request.add_header("X-NCP-APIGW-API-KEY", client_secret)
    response = urllib.request.urlopen(request, data=data.encode('utf-8'))
    
    ret = {
        "response_code" : response.getcode(),
        "response_content" : response.read()
    }

    response_status(ret)

    return ret



## api call for Object Detection
## OD(image) will give information of objects in image
def OD(input_file):
    OD_URL = "https://naveropenapi.apigw.ntruss.com/vision-obj/v1/detect"
    files = {
        "image" : input_file
    }

    headers = {
        "X-NCP-APIGW-API-KEY-ID" : client_id,
        "X-NCP-APIGW-API-KEY" : client_secret,
    }

    response = requests.post(OD_URL, files=files, headers=headers)

    ret = {
        "response_code" : response.status_code,
        "response_content" : response.text
    }

    response_status(ret)

    return ret

## OD2
def OD2(cliId):
    OD_URL = "https://naveropenapi.apigw.ntruss.com/vision-obj/v1/detect"
    files = {
        "image" : open('imgs/'+cliId+'.png', 'rb')
    }

    headers = {
        "X-NCP-APIGW-API-KEY-ID" : client_id,
        "X-NCP-APIGW-API-KEY" : client_secret,
    }

    response = requests.post(OD_URL, files=files, headers=headers)

    ret = {
        "response_code" : response.status_code,
        "response_content" : response.text
    }

    response_status(ret)

    return ret


## print response status
def response_status(res):
    if res["response_code"] == 200:
        print("API request success")
    else:
        print("Error("+str(res["response_code"])+")")
        #print(res["response_content"])

