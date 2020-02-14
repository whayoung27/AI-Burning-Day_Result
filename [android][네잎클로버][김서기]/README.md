# naverBurningDay

### 목차
1. 팀 소개(#네잎클로버-Team-Member)
2. Android(#Android)
3. REST API Reference(#REST-API-Reference)
4. NLP(#NLP)

# SecretaryKim\_김서기 (NAVER AI BURNINGDAY 2020)

## 네잎클로버 Team Member

- [김태형](https://github.com/KimTaeHyeong17, "KimTaeHyeong Repo") Android Engineer
- [장유리](https://github.com/JangYuri, "JangYuri Repo") Server Engineer
- [정진호](https://github.com/zzzinho, "zzzinho Repo") Machine Learning Engineer
- [양진화]() Product Designer

### 협업툴
- 피그마, 제플린, 트렐로
![image](https://user-images.githubusercontent.com/37135317/74510222-aacba800-4f46-11ea-8bfa-68935b7a8b93.png)

### 시연영상
[![시연영상](https://user-images.githubusercontent.com/37135317/74507850-f1b69f00-4f40-11ea-9781-eef2f5d497b6.png)](https://youtu.be/H_aWZa-e52w)


## Android
### 사용한 라이브러리
- network moodule : loopj android-async-http library
```
public class Network {
    public static String BASE_URL = "http://--.--.---.---";

    private static AsyncHttpClient client = new AsyncHttpClient();

    public static void get(Activity act, String url, RequestParams params, AsyncHttpResponseHandler responseHandler) {
        if(Useful.isNetworkConnected(act) == false){
            Useful.showAlertDialog(act, "알림", "네트워크에 연결되어 있지 않습니다.\n네트워크 연결 후 다시 시도해 주세요.");
            return;
        }
        client.get(BASE_URL + url, params, responseHandler);
    }

    public static void post(Activity act, String url, RequestParams params, AsyncHttpResponseHandler responseHandler) {
        if(Useful.isNetworkConnected(act) == false){
            Useful.showAlertDialog(act, "알림", "네트워크에 연결되어 있지 않습니다.\n네트워크 연결 후 다시 시도해 주세요.");
            return;
        }
        if(params!=null){
            String countryCode = Locale.getDefault().getCountry();
            params.put("country_code", countryCode);
            params.put("order_device", "pos");
        }
        client.setURLEncodingEnabled(false);
        client.post(BASE_URL + url, params, responseHandler);
    }
}
```
- parsing json : GSON
- tag View : Cutta:TagView:1.3


### ScreenShot
![image1](https://user-images.githubusercontent.com/37135317/74507938-32aeb380-4f41-11ea-93cc-335ede1a5f16.png)
![image2](https://user-images.githubusercontent.com/37135317/74507962-40fccf80-4f41-11ea-86c8-d54238d171d3.png)
### Features
 - Analyze audio file and return script 
 - Analyze script file and shows you keyword and information(appointment, reservation) about script.
 - Analyze script file and show Summary of text
 
 ### Permissions
 - Full Network Access.
 - View Network Connections.
 - Read and Write access to external and internal Storage.
 - Read Phone Call state and Record Audio.
 - Read Audio File.




## REST API Reference

- Server :
    - http://49.50.165.233
- Common response : 
    - 음성파일 리스트 조회 GET /voices
    - 음성파일 업로드 POST /voices
    - 음성파일 정보 조회 GET /voices/:id
    - 음성파일 즐겨찾기 등록 PUT /voices/:id/star
    - 음성파일 즐겨찾기 등록 해제 DELETE /voices/:id/star
    - 일정 리스트 조회 GET /schedules
    - 사용자 지정 키워드 리스트 조회 GET /keywords
    - 사용자 지정 키워드 설정 POST /keywords

* api 가이드 문서
https://cyrjang21.gitbook.io/naverclova/


## NLP
 - TextRan: key sentences와 keywords를 추출
 - Konlpy: 한국어 단어 단위로 분해 
 - sklearn: TfidfVectorizer를 사용해서 단어와 문장의 가중치 계산
 

### Reference
 - https://excelsior-cjh.tistory.com/93
 - https://lovit.github.io/nlp/2019/04/30/textrank/

