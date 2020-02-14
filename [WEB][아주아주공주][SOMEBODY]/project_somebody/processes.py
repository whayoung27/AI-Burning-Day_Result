from flask import render_template, flash
from pydub import AudioSegment
import os, cv2, requests, json, random, subprocess, shutil
import numpy as np
from collections import Counter


# 영상 -> 사진 분할. 매개변수로는 영상 제목 넘겨줌.
# 1초에 1번, n= 2 : 1초에 2번캡처
def movie_divide(vname,n):
    print("METHOD : movie_divide")
    dir = os.path.abspath("./static/uploads")
    fdir = os.path.join(dir, vname)

    img_dir = "./static/uploads/images"
    # image 폴더 있다면 삭제
    if os.path.exists(img_dir) and os.path.isdir(img_dir):
        shutil.rmtree(img_dir)
    # image 폴더 생성
    os.mkdir(img_dir)

    vidcap = cv2.VideoCapture(fdir)
    count = 0

    # find frame rate of a video
    fps = vidcap.get(cv2.CAP_PROP_FPS)
    ## fps 반올림
    print("video 프레임 rate :", round(fps))
    s_vidfps = round(fps) / n

    while (vidcap.isOpened()):
        # Capture frame-by-frame
        success, image = vidcap.read()
        # count 값 업데이트 기준으로 frame 업데이트됨
        if success == True:
            if count % s_vidfps == 0:
                cv2.imwrite(os.path.join(img_dir,"frame{:02d}.jpg".format(int(count / s_vidfps))),image)  # save frame as JPEG file
            count += 1
        else:
            break

    return get_json(vname)


# API 요청해 json 파일 받기
def get_json(vname):
    print("METHOD : get_json")

    count = 1
    dir = os.path.abspath("./static/uploads/images")
    fname = sorted(os.listdir(dir))
    fdir = list()

    client_id = "ikkq6wbgvq" # API client 아이디랑 secret key
    client_secret = "DzLfqBH0jvOALQT536QR2eEsrvGxwxlbxY21IKlE"
    url = "https://naveropenapi.apigw.ntruss.com/vision-pose/v1/estimate"

    # 영상 속 인물에 대한 pose estimation api 이용
    for i in fname:
        fdir.append(os.path.join(dir, i))
    for i in fdir:
        print("Requesting... %s" % i)
        files = {'image': open(i, 'rb')}
        headers = {'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret }
        response = requests.post(url,  files=files, headers=headers)
        rescode = response.status_code

        if(rescode == 200):
            strTodict = json.loads(response.text)
            with open("./static/uploads/json/test%02d.json" % count, 'w', encoding='utf-8') as make_file:
                json.dump(strTodict, make_file, indent="\t")
            count += 1
        else:
            print("Error Code:" + str(rescode))

    return change_cal(vname)


def abs_diff_dict(d1,d2):
    d1 = Counter(d1)
    d2 = Counter(d2)
    
    d2.subtract(d1)
    d2 = dict(d2)
    
    return np.abs(d2['x']) + np.abs(d2['y'])


# 좌표 변화량 산출
def change_cal(vname):
    print("METHOD : change_cal")
    jsondir = os.path.abspath("./static/uploads/json")
    fname = sorted(os.listdir(jsondir))
    fdir = list()
    for i in range(len(fname)):
        fdir.append(os.path.join(jsondir, fname[i]))
    data = list()
    for i in fdir:
        with open(i, 'r') as f:
            data.append(json.load(f))

    for i in range(len(data)):
        if len(data[i]['predictions'])>1:
            for file in os.scandir(jsondir):
                os.remove(file.path)
            flash('두 명 이상의 사람 detect','error')
            return render_template("upload.html")

    diff = list() 

    body_list = ['0','1','3','4','6','7','9','10','12','13']

    for i in range(len(data)-1):
        body_diff = []
        for body in body_list:
            try:
                d1 = data[i]['predictions'][0][body]
                d2 = data[i+1]['predictions'][0][body]
                body_diff.append(abs_diff_dict(d1,d2))
                
            except KeyError:  # 신체 부위가 인식이 안 된 경우.
                body_diff.append(0)

        diff.append(body_diff)

    for file in os.scandir(jsondir):
        os.remove(file.path)

    return make_music(diff, vname)


def make_music(diff, vname):
    print("METHOD : make_music")
    
    final_diff=list()
    sound = list()
    tmp_list=[0,1,2,3,4,5,6,7,8,9]

    all_avg=0
    tmp_avg=0
    avg=list()

    rhythm = [[1000],[500,500],[400,200,400],[300,300,400]]
    
    for i in range(len(diff)): #40
        for j in range(len(diff[0])): #10 
            tmp_avg+=diff[i][j]
        avg.append(tmp_avg)
        tmp_avg=0


    for i in range(len(avg)):
        all_avg+=avg[i]

    all_avg/=len(avg)

        
    for k in range(len(diff)):
        for i in range(len(tmp_list)-1):
            for j in range(len(tmp_list)-i-1):
                if diff[k][tmp_list[j]]<diff[k][tmp_list[j+1]]:
                    tmp_list[j],tmp_list[j+1]=tmp_list[j+1], tmp_list[j]
        final_diff.append(tmp_list)
        tmp_list=[0,1,2,3,4,5,6,7,8,9]


    sound = list()

    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/crash.mp3")-6)
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/hat.mp3")-6)
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/tom H.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/kick.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/snare.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/bongo H.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/clap.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/cow bell.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/maracas.mp3"))
    sound.append(AudioSegment.from_mp3("./static/uploads/music_source/ride.mp3"))
    base_music = AudioSegment.from_mp3("./static/uploads/music_source/rim.mp3")

    for i in range(len(sound)):
        sound[i] = sound[i][:500]


    base_music=base_music[:500] #base

    base=base_music
    music = sound[1].overlay(sound[2])+sound[3].overlay(sound[4])
    final_diff_len = 0

    for i in range(len(final_diff)):
        final_diff_len+=len(final_diff[i])
        
    print("final 길이 : ", final_diff_len)

    for i in range(final_diff_len):
        base+=base_music

    for i in range(len(final_diff)):
            music += sound[final_diff[i][0]].overlay(sound[final_diff[i][1]])
            music += (sound[final_diff[i][2]].overlay(sound[final_diff[i][3]]))-12

    mel_dir = os.path.abspath("./static/uploads/music_source/blues_scale")
    melody_l = os.listdir(mel_dir)
    melody_lst=list()

    for i in range(len(melody_l)):
        melody_lst.append(os.path.join(mel_dir, melody_l[i]))

    melody=list()

    for i in range(len(melody_lst)):
        melody.append(AudioSegment.from_mp3(melody_lst[i])-4)
    
    mel = melody[6]
    cur = 6
    cre = 0


    for i in range(len(avg)-1):
        ch_rhythm=random.randint(0, len(rhythm)-1)
        for i in range(len(rhythm[ch_rhythm])):
            if(avg[i]<all_avg):
                if(cur==0):
                    cre +=1
                    avg[i]=all_avg+1
                    cur+=1
                    mel+= (melody[cur][:rhythm[ch_rhythm][i]])+cre
                else:
                    cre -=1
                    cur-=1
                    mel += (melody[cur][:rhythm[ch_rhythm][i]])+cre
            else:
                if(cur==len(melody)-1):
                    cre-=1
                    avg[i]=all_avg-1
                    cur-=1
                    mel += (melody[cur][:rhythm[ch_rhythm][i]])+cre
                else:
                    cre+=1
                    cur+=1
                    mel += (melody[cur][:rhythm[ch_rhythm][i]])+cre

    mel += melody[6]

    music= music.overlay(base)
    music = music.overlay(mel)

    music.export("./static/uploads/music.mp3", format="mp3")
    
    return make_mv(vname, diff)


# 원본 동영상과 제작한 사운드 결합
def make_mv(vname, diff):
    print("METHOD : make_mv")
    dir = os.path.abspath("./static/uploads")
    fdir = os.path.join(dir, vname)
    rmfdir = os.path.join(dir, "rm.mp4")
    finaldir = os.path.join(dir, "final.mp4")
    mdir = os.path.join(dir, "music.mp3")
    subprocess.call(  # 비디오 내 오디오 삭제
        'ffmpeg -y -i %s -c copy -an %s' % (fdir, rmfdir),
        shell=True)
    subprocess.call(  # 비디오와 새로운 오디오 합성
        'ffmpeg -y -i %s -i %s -c:v copy -c:a aac -strict experimental %s' % (mdir, rmfdir, finaldir),
        shell=True
    )
    return render_template('app.html', up_file="final.mp4", soundlog=active_body_stat(diff, 0.1))


# change_cal 통해 만들어진 변화량 통해 사운드 로그 생성
def active_body_stat(diff, threshold):
    active_body_lst = []
    cnt = 0

    body_dict = {
        0: '머리',
        1: '배',
        3: '오른팔꿈치',
        4: '오른팔',
        6: '왼쪽팔꿈치',
        7: '왼팔',
        9: '오른쪽무릎',
        10: '오른발',
        12: '왼쪽무릎',
        13: '왼쪽발'
    }

    for i, body in zip(range(10), body_dict.values()):
        body_cnt_by_thres = len(np.where(np.array(diff[i]) > threshold)[0])
        print(body)
        if body in ['머리', '오른팔', '왼팔', '오른발', '왼쪽발']:
            active_body_lst.append((body, body_cnt_by_thres))
    print(active_body_lst)
    print(diff)
    return active_body_lst
