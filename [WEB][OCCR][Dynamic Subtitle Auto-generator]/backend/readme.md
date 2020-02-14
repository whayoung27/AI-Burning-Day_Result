# Backend

기능별 스크립트 만들기 -> 생성된 스크립트 바탕으로 API 제작

> [Requirements.txt](./requiremnets.txt)

## 1.4 전용 API 서버 제작

> 주요 파일: [app.py](./app.py) / Flask 기반

- [x] 5. api에서 vtt 파일 서빙 
- [x] 5. api에선 해당 id값의 caption 수정 
- [x] 6. 수정된 자막 정보에 맞게 webVTT 재생성 -> 200 Return
- [x] 7. webVTT 정보 중 Text만 읽은 뒤 Papago 번역 서비스 실행
- [x] 8. 새로운 번역본  webVTT생성 및 다운로드 Response

```
python app.py
```

## 1.2 자막 생성
> 주요 파일: [generator.py](./generator.py)

- [x] API Response Data Preprocessing) 위치 정보 기반하여 같은 문장 묶음
- [x] 통일된 데이터 형식 제작 필요
- [x] 가공된 데이터를 바탕으로 webVTT 생성

```
python generator.py 
```


## 1.1 영상 캡쳐
> 주요 파일: [capture.py](./capture.py)

- [x] (Optional) Youtube 링크 입력시 0.3초마다 스크린샷 생성
- [x]  영상 업로드시 초당 1~4장의 Frame 스크린샷 생성
- [x] 생성된 스크린샷을 OCR API로 전송

``` shell
pip instal pytube
pip install pytube3 --upgrade

brew install opencv
pip install opencv-python numpy

```
