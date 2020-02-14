# 소리보다<br>

* 팀명 : DFP(Development For People)
* 팀원 : 김민섭

## 프로젝트 개요
* 소리와 보다가 합쳐진 단어로 소리정보를 볼 수 있도록 만들어진 ios app 서비스 입니다.
* 청각장애인분들은 소리로 전달되는 정보들(각종 경고음, 안내방송, 수업 등)을 제대로 인지 할 수 없기 때문에 고안된 서비스 입니다.

## 작업환경
* Xcode Version 11.3.1
* Alemofire 4.4
* python 3.7.2
* tensorflow 1.14.0

## 주요 기능
### 음성인식 기능
* CSR(Clova Speech Recognition)모바일 SDK를 활용하여 음성인식을 진행하고 이를 텍스트로 표시해 줍니다.
* CSR의 Auto 모드로 동작하며 버튼이 선택되어 있는 동안은 작동이 완료되면 다시 자동으로 작동 할 수 있도록 설계되었습니다.

### 경고음 알림 기능
* 약 8천개의 소리 dataset인 UrbanSound8k data를 활용하여 소리를 분류한 모델을 활용하였습니다.(10가지 종류의 소리 분류)
(출처 : https://github.com/rickiepark/tfk-notebooks/tree/master/urban-sound-classification)
* 4초를 주기로 녹음하고 RESTapi를 호출하여 분석된 소리 결과를 받아옵니다.
* 경고음 알림 기능이 작동되어 사이렌 소리 및 경적같은 경고음이 감지되면 Alert와 Notification으로 사용자에게 알려줍니다.
* Background 에서도 작동이 가능하도록 진행하였습니다.








