import os
import sys
import requests
import json

# global variables
 ## api key and pwd
client_id = '8styfwwsrh'
client_pwd = 'qrCqd7Sg7ZGXA426Q68iClscjEhC6L5sVKdp30WZ'

# header dictionary
headers = {
    'X-NCP-APIGW-API-KEY-ID' :client_id,
    'X-NCP-APIGW-API-KEY' : client_pwd
}
# encpoint url
url = 'https://naveropenapi.apigw.ntruss.com/nmt/v1/translation'

#####################################
########### 필요 함수################

def getData(text,source_lang,target_lang):
    """ return data format
    """
    val = {
    'source' : source_lang,
    'target' : target_lang,
    'text' : text
}
    return val
def checkStopword(s):
    stopword = ["\"","$","&","'","(",")","*","+",",","-",";","<","=",">","@","\\","^","_","`","|","~","·","—","——","‘","’","“","”","…","、","。","〈","〉","《","》"]
    return s in stopword

def spellCheckKo(text_list):
    return text_list

def preprocessSourceText(org_Text):
    """ split txt(unit: '\n')
    """
    paragraph = ""
    preprocessed_Text = []
    #flag = 0
    for s in org_Text:
        #check end of paragraph
        if s == '\n':
            if paragraph == "" or " " or "\n" or "\t":
                continue
            else:
                preprocessed_Text.append(paragraph)
                paragraph = ""
        else:
            if not checkStopword(s):
                paragraph += s
    '''
    for s in org_Text:
        #check end of paragraph
        if s == '\n':
            if flag == 1:
                if paragraph == "":
                    preprocessed_Text.append(paragraph)
                paragraph = ""
                flag = 0
            else:
                flag = 1
        else:
            flag = 0
            #check stopword
            if not(checkStopword(s)):
                paragraph += s
    '''
    if paragraph != '\n' and len(paragraph) > 0:
        preprocessed_Text.append(paragraph)

    spellCheckedText = spellCheckKo(preprocessed_Text)
    return spellCheckedText

def getErrorMsg(rescode):
    """return error msg
    """
    errorCode = json.loads(rescode.text)['errorCode']
    if errorCode == 'N2MT05':
        return 'source와 target이 동일합니다.'
    elif errorCode == 'N2MT07':
        return 'text 파라미터가 필요합니다.'
    elif errorCode == 'N2MT08':
        return 'text 파라미터가 최대 용량을 초과했습니다.'
    else:
        return errorCode +': 내부 서버 오류입니다.'

def requestPapagoNMT(org_Text, source_lang, target_lang):
    '''return translated text / error msg
    '''
    val = getData(org_Text, source_lang, target_lang)
    #proprocess Text
    preprocessedTextList = preprocessSourceText(org_Text)
    #print(preprocessedTextList)
    error = 0
    translatedText = []

    for t in preprocessedTextList:
        val['text'] = t
        response = requests.post(url, data=val, headers=headers)
        rescode = response.status_code

        if rescode != 200:
            error = 1
            return (error,getErrorMsg(response))
        tt = json.loads(response.text)
        translatedText.append(tt['message']['result']['translatedText'])

    return  (error,translatedText)
####################################
####################################

###################################
############## TEST ###############
# 번역할 text

#text = '네이버에서 클로바 사용했더니 기능이 좋더라? \n 네이버 커넥트 원 밥 맛이 좋더라'
f = open("./txt/case4.txt",mode='r',encoding='utf-8').read()
print('*'*5+"원본"+'*'*5)
print(f)
print('*'*5+"번역"+'*'*5)
print(requestPapagoNMT(f, 'ko', 'en'))
print('*'*5+"label"+'*'*5)
f2 = open("./txt/label4.txt",mode='r',encoding='utf-8')
print(f2.read())