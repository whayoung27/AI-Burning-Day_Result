## Naver AI Burning Day


# **Dancing Star**  by Team Evolution


#### 이 어플리케이션은 K-POP 아이돌의 핵심 안무와, 사용자가 추는 안무의 정확도를 비교분석하여 점수를 측정해주는 어플입니다.
##### 사용한 API는 '__Clova Face Recognition__'과 '__Pose Estimation__'입니다. 

##### 안무의 정확도(accuracy)는 양팔과 다리의 각도/간격과 시선처리와 표정 등을 비교하여 점수를 계산하였습니다. 또한 18가지의 Pose keypoints를 high dimensional vector로 나타내어 각각 좌표 간의 distance를 계산한 뒤, 각 keypoint의 confidence에 따라 가중치를 부여하여 총 벡터의 distance(consistency)를 계산하였습니다. 안무 정확도 계산에서는 모든 프레임을 처리하지 않고 중요한 동작 몇 가지를 지정한 뒤 계산하였습니다. 또한 consistency는 1초 단위로 계산하여 사용자의 안무가 전반적으로 잘 진행이 되고 있는지를 수치로 측정하였습니다.


##### 백엔드 README.md : [README.md](https://github.com/jionchu/DancingStar/tree/master/Backend/dancing-star/README.md)


##### 개발언어 : Python, Java, Kotlin






-----------------------------------
###### 영상출처 : 
######  - [ITZY(있지) "달라달라(DALLA DALLA)" dance cover by Vis](https://www.youtube.com/watch?v=BwqrAn8YSpA)
