# Dynamic Caption Generator 

> 본 프로젝트는 NAVR AI Burning Day 에서 진행한 프로젝트입니다.
> Clova OCR API를 기반으로 하여 다이내믹한 자막을 생성하고 이를 수정할 수 있습니다.

시연 영상: https://www.youtube.com/watch?v=zkR_4aC83iA

## 1.1 영상 캡쳐
> 주요 파일: [capture.py](./backend/capture.py)

- [x] (Optional) Youtube 링크 입력시 0.3초마다 스크린샷 생성
- [x]  영상 업로드시 초당 1~4장의 Frame 스크린샷 생성
- [x] 생성된 스크린샷을 OCR API로 전송

## 1.2 자막 생성
> 주요 파일: [generator.py](./backend/generator.py)

- [x] API Response Data Preprocessing) 위치 정보 기반하여 같은 문장 묶음
- [x] 통일된 데이터 형식 제작 필요
- [x] 가공된 데이터를 바탕으로 webVTT 생성


## 1.3 자막 에디터 만들기
> 주요 파일: [React VideoContainer.jsx](./frontend/src/components/VideoContainer.jsx)
- [x] 1. 리액트로 기본 틀 잡기
- [x] 2. actviecue를 이용한 실시간 자막 송출
- [x] 3. 자막 수정하기 (Text, position)
- [x] 4. 수정된 자막 정보 id값에 담아 api로 전송 
- [x] 5. 최종본으로 다운로드 하기 버튼
- [x] 6. 일본어로 번역하기 버튼

자막 에디터 화면 구성
- 유튜브 링크 입력
- 자막 에디터
- 최종 다운로드 버튼 / 번역 다운로드 버튼


## 1.4 전용 API 서버 제작

> 주요 파일: [Flask app.py](./backend/app.py) / Flask 기반

- [x] 5. api에서 vtt 파일 서빙 
- [x] 5. api에선 해당 id값의 caption 수정 
- [x] 6. 수정된 자막 정보에 맞게 webVTT 재생성 -> 200 Return
- [x] 7. webVTT 정보 중 Text만 읽은 뒤 Papago 번역 서비스 실행
- [x] 8. 새로운 번역본  webVTT생성 및 다운로드 Response

```
python app.py
```




