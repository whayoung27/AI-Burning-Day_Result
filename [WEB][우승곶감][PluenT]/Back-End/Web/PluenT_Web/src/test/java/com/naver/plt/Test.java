package com.naver.plt;

import org.json.JSONObject;

public class Test {
	public void jsonParsing1() {
	   
		String j = "{\"title\": \"how to get stroage size\","
	            + "\"url\": \"https://codechacha.com/ko/get-free-and-total-size-of-volumes-in-android/\","
	            + "\"draft\": false,"
	            + "\"star\": 10"
	            + "}";

	    // JSONObjet를 가져와서 key-value를 읽습니다.
	    JSONObject jObject = new JSONObject(j);
	    String title = jObject.getString("title");
	    String url = jObject.getString("url");
	    Boolean draft = jObject.getBoolean("draft");
	    int star = jObject.getInt("star");

	    System.out.println("title: " + title);
	    System.out.println("url: " + url);
	    System.out.println("draft: " + draft);
	    System.out.println("star: " + star);
	    
	    
	    
//	    
//	    """
//	    utils for mnt service 
//	    __auther__ = 'drumyseong'
//	    """
//	    import requests
//	    import json
//	    import re
//	    from bs4 import BeautifulSoup
//	    ############################################
//	    #           FUNCTIONS                      #
//	    ############################################
//	    def checkLen(text):
//	        return (len(text) < 500)
//
//	    def findLastIdx(text):
//	        pre_i = 0
//	        while True:
//	            idx = text.find("."or"!"or"?")
//	            if idx >= 0 and idx+pre_i <= 500:
//	                pre_i += idx
//	                text = text[idx+1:]
//	            else:
//	                break
//	        return pre_i+1
//
//	    def checkSpellKo(text):
//	        checkedText = []
//	        #parameter type is string
//	        if isinstance(text,str):
//	            if checkLen(text):
//	                return getCorrectedKo(text)
//	            else:
//	                checkedText = ""
//	                while(True):
//	                    idx = findLastIdx(text)
//	                    if idx <= 1:
//	                        break
//	                    checkedText += checkSpellKo(text[:idx])
//
//	                    text = text[idx:]
//
//	        #parameter type is list
//	        else:
//	            #recrusive call
//	            for t in text:
//	                checked = checkSpellKo(t)
//	                checkedText.append(checked)
//
//	        return checkedText
//
//	    def getCorrectedKo(q):
//	        #completed
//	        #use naver API
//
//	        callback = "jQuery112404813373148364377_1581593168003"
//	        url = "https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy?_callback=" + callback + '&q=' + q + "&where=nexearch&color_blindness=0&_=1581593168005"
//
//	        headers = {
//	            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.100 Safari/537.36'
//	        }
//
//	        response = requests.get(url, headers=headers)
//
//	        if 'json' in response:
//	            response = response.text
//	            response = response.replace(callback + '(', '')
//	            response = response.replace(');', '')
//	            response_dict = json.loads(response)
//	            checked = response_dict['message']['result']['html']
//	            checked = BeautifulSoup(checked, "html.parser").text
//
//	            return checked
//	        else:
//	            return q
	}
}
