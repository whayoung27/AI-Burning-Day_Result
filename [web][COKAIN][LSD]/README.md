LSD : Life Shot Director
=================
## 0. Intro

인스타그램의 발전과 함께 **사진**을 중심으로하는 SNS가 대세가 되어가고있습니다. <br>
하지만 인스타그램 인플루언서들처럼 좋은 사진을 찍는 것은 어려운 일입니다. <br>
Life Shot director(LSD)는 사진에 익숙하지 않은 사람도 언제 어디서나 최적의 구도로 사진을 찍을 수 있도록 가이드 라인을 제시합니다. <br>

LSD는 Naver Pose Estimation API와 다양한 Machine learning model을 활용하여 유저가 찍은 배경사진에서 학습된 패턴을 감지, 가장 많은 사람들이 위치했던 자리를 찾습니다. 

<br>
<div>
<img src= 'https://user-images.githubusercontent.com/61034754/74500390-14898900-4f2a-11ea-8317-f0d1f2f5559c.png', width = 1000>
<div>
<br>
최종적으로 저희는 위의 사진처럼 사진을 찍고자하는 배경을 찍으면, 유저가 가장 예쁜 사진을 찍기 위해 서야하는 위치와 개략적인 자세를 제시하고자 합니다. 


## 1. Data preparation
+ Image collecting<br>
Model을 구축하기 위해 인스타그램에서 Image crawling을 진행하였습니다.<br>
Crawling과정에서 Selenium library 기반으로 ChromeDriver를 이용하였으며, 인스타그램의 해시태그 및 인스타그램이 자동으로 제공하는 사진의 하위 요소들을 활용하여 필터링하였습니다. 그 결과 총 2704개의 Training set과 588개의 test set을 구축했습니다.
<div>
<img src= 'https://user-images.githubusercontent.com/61034754/74502473-f96e4780-4f30-11ea-8f0d-bff239b125b2.PNG', width = 1000>
<div>
<br>

+ Pose estimation <br>
Crawling 된 img는 전처리 과정을 통해 학습 및 분석에 용이한 형태로 변형하였습니다. <br>
먼저 원본 사진에 대해 Naver Clova API-pose estimation을 활용, 사진에 존재하는 사람의 자세 및 위치를 얻었습니다. 이후, pose estimation의 position vector를 일렬로 배열하여 총 54개의 latent vector로 변환했습니다.
<div>
<img src='https://user-images.githubusercontent.com/61034754/74502946-a7c6bc80-4f32-11ea-92f7-5cc41732c901.png', width = 1000>
<div>
 
 + Data pre-processing <br>
또한, 이와 별개로 pre-trained model들을 활용, 사람이 존재하는 training용 사진에서 사람을 제거하고, 순수한 배경의 edge 정보만 남겼습니다. 구체적으로 사람을 지우고 위치를 학습시키기 위한 mask를 만들기 위해 Deeplabv3+을, Deeplabv3+에서 나온 mask를 기반으로 사진 상에 존재하는 사람을 제거하기 위해 DeepFill(inpainting)을, 최종적으로 사람이 제거된 사진의 edge만을 추출하기 위해 Holistically-nested edge detection(edge detection)을 사용하였습니다.
<div>
<img src='https://user-images.githubusercontent.com/61034754/74502943-a5fcf900-4f32-11ea-8ddd-f850a5cda0ab.png', width = 1000>
<div>

이 결과 나온 latent vector는 learning에서 정답셋으로, 사람이 제거된 배경사진은 input set으로 사용하였습니다.

## 2. Learning

* Learning은 크게 세 단계로 구성됩니다.
1. Edge image로부터 의미있는 latent vector를 얻어내는 CDAE(Convolutional Denoising Auto-Encoder) 모델
2. Naver pose estimation API를 기반으로 학습하여 배경사진으로 부터 Pose를 예측하는  PoseNet 모델
3. 예측된 pose 정보로부터 사진에서 최적 위치를 보여주는 MaskNet 모델입니다.
앞서 준비한 2,704개의 사진을 기반으로 위의 모델들을 학습하고, 사진 찍을 자리를 예측하는 통합 모델을 구축하였습니다.

## 3. Service

웹 사이트를 통해 웹 서버상에 이미지가 업로드되면, 서버가 백엔드에서 해당 이미지의 엣지를 디텍션해내고, 신경망을 통해 추출해낸 엣지 정보로부터 최적의 포즈를 추천해주는 서비스(웹)를 개발했습니다.


## 4. Citiation

**Deeplabv3+** : Encoder-Decoder with Atrous Separable Convolution for Semantic Image Segmentation, Liang-Chieh Chen and Yukun Zhu and George Papandreou and Florian Schroff and Hartwig Adam, ECCV, 2018 <br>

**DeepFill(inpainting)** : Generative Image Inpainting with Contextual Attention, Yu, Jiahui and Lin, Zhe and Yang, Jimei and Shen, Xiaohui and Lu, Xin and Huang, Thomas S, arXiv preprint arXiv:1801.07892, 2018 <br> yu2018free, Free-Form Image Inpainting with Gated Convolution, Yu, Jiahui and Lin, Zhe and Yang, Jimei and Shen, Xiaohui and Lu, Xin and Huang, Thomas S, arXiv preprint arXiv:1806.03589, 2018

**Holistically-nested edge detection (HED)** : Jia13caffe, Yangqing Jia, {Caffe}: An Open Source Convolutional Architecture for Fast Feature Embedding, 2013, http://caffe.berkeleyvision.org/ <br>
wu2016tensorpack, Tensorpack, Wu, Yuxin and others, https://github.com/tensorpack/, 2016

**VGG net** : simonyan2014deep, Very Deep Convolutional Networks for Large-Scale Image Recognition, Karen Simonyan and Andrew Zisserman, 2014, 1409.1556, arXiv, cs.CV
