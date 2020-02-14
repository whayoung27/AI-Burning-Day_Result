def ApiDetection(base_dir, file_name):
    import requests
    from decouple import config
    from time import sleep
    import os

    # 모듈화 : 일단 필요할 때마다 불러다 쓸 수 있게 하자!
    # url = 'https://naveropenapi.apigw.ntruss.com/vision-pose/v1/estimate'
    url = 'https://naveropenapi.apigw.ntruss.com/vision-obj/v1/detect'

    headers = { 
        'X-NCP-APIGW-API-KEY-ID': config('CLIENT_ID'),
        'X-NCP-APIGW-API-KEY': config('CLIENT_SECRET'),
        # 'Content-Type': "multipart/form-data",
        # 'Content-Length': 96703
    }
    print('Object Detection: ')
    try:
        if file_name[-4:-1] != '.png' or file_name[-4:-1] != '.jpg':
            print(ErrorGenerate)
        # file_name = filename+'.png'
    except:
        print('파일형식 오류입니다! 파일 확장자명은 jpg or png이어야 합니다.')

    try:
        file_dir = os.path.join(base_dir,file_name)
        files = {'image': open(file_dir, 'rb')}

        file_dir=base_dir+file_name  #+'/baby'+ str(i)+'.jpg'
        # file_neme = 'baby6.jpg'
        # base_dir = './image/'
        files = {'image': open(file_dir, 'rb')}

        response = requests.post(url,  files=files, headers=headers)
        sleep(100)
        rescode = response.status_code
        if(rescode==200):
            print (response.text)
        else:
            print("Detection-Res Error Code:" + rescode)
    except:
            print('이미지는 2MB이하여야 합니다! 데이터 용량을 체크해주세요 file_dir :{}'.fomrat(file_dir))


        # except:
        #     print("Estimate Exception1 + Error2 (사진 파일의 jpg, png 확장자 모두 틀림 or 용량이 2MB넘는지 체크! 문제) )
        
            