# MindReader
![image](https://user-images.githubusercontent.com/12870549/74511011-51647880-4f48-11ea-86ff-6049b3e6d278.png)
![image](https://user-images.githubusercontent.com/12870549/74511660-d69c5d00-4f49-11ea-8518-edd263035241.png)
# For User

## Git Clone

```bash
git clone https://github.com/NaverBunningDay-ShareHouse/MindReader.git
```

## Build

```
# npm install
# npm run build:clean
```

```
# Setup
Chrome/ whale brower -> extension -> load unpacked extension -> select `dist` directory
```

# For developer

## Watch

```bash
# 명령어 실행 후 코드 수정시, dist 폴더에 컨텐츠, 백그라운드 스크립트 자동 번들링됨
# 바로 dist 폴더를 확장앱으로 실행시키면 작업하기 편하다
npm run watch
```


## Test

```
# chrome://extensions/ 접속
# '압축 해제된 확장앱 설치' 선택 후 'dist' 폴더 지정
# 참고. npm run watch로 코드 수정시 바로 번들링 되게하면 편함
```

## Deploy
```
# 배포 바로가기
https://store.whale.naver.com/developers/dashboard
npm run build:deploy

# 크롬 바로가기
chrome://extensions/
```

## 진행상황

[프로젝트 바로가기](https://github.com/NaverBunningDay-ShareHouse/MindReader/projects/1)

## WIKI

[WIKI 바로가기](https://github.com/NaverBunningDay-ShareHouse/MindReader/wiki)

