import os
import sys
import urllib.request
import json

# 추후 파일 읽기 형식으로 바꿔야 함.
client_id = "mi91095qps"
client_secret = "YgL7jawCVTaCasBy1rW7kKtzZYDdUhqGFvtr3EES"

def translate_NMT(input_text):
	encText = urllib.parse.quote(input_text)
	data = "source=en&target=ko&text=" + encText
	url = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation"
	request = urllib.request.Request(url)
	request.add_header("X-NCP-APIGW-API-KEY-ID", client_id)
	request.add_header("X-NCP-APIGW-API-KEY", client_secret)
	response = urllib.request.urlopen(request, data=data.encode("utf-8"))
	
	rescode = response.getcode()
	if rescode == 200:
		response_body = response.read()
		response = response_body.decode("utf-8")
		#print(response_body.decode("utf-8"))
		translatedText = extract_translatedText(response)
		print(translatedText)
		return translatedText
	else:
		print("Error Code: " + rescode)


def extract_translatedText(response):
	data = json.loads(response)
	translatedText = data['message']['result']['translatedText']

	return translatedText


if __name__ == "__main__":
	# 테스트 입력
	strings = "i love you but i hate you so get out of here no no come here."

	test_code = sys.argv[1]
	# nmt인 경우
	if test_code == "nmt":
		translate_NMT(strings)
