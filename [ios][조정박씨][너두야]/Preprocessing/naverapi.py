import urllib
import urllib.request

import requests

import re
from prepare import get_save_path

from moviepy.editor import *
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_audio
import numpy as np
import smipy
import prepare
import pandas as pd

CSV_ENCODING = 'cp949'
RAW_DATA_PATH = './rawdata'


###############################
#
#   번역 쪼개서도 가능함. 근데 굳이 그래야 할까?
#   일단 너무많이 한번에 하면 안된다는거만 알자.
#
#   wordlist_rev 받아서 번역하기
#
#   자막만들기는 완료. 번역은 아직 노!!
#
###############################
NAVER_CLIENT_ID = '78kh5kk9mi'
with open('./secret.txt', 'r') as f:
    NAVER_CLIENT_SECRET = f.read()
NAVER_CLIENT_SECRET = NAVER_CLIENT_SECRET.strip()



def papago_translate(text, verbose = False):


    '''
    POST /nmt/v1/translation HTTP/1.1
    HOST: naveropenapi.apigw.ntruss.com
    User-Agent: curl/7.49.1
    Accept: */*
    Content-Type: application/x-www-form-urlencoded; charset=UTF-8
    X-NCP-APIGW-API-KEY-ID: {애플리케이션 등록 시 발급받은 client id 값}
    X-NCP-APIGW-API-KEY: {애플리케이션 등록 시 발급받은 client secret 값}
    Content-Length: 51
    '''
    # "translatedText": "우리 형이 버나뎃을 엄청 좋아해요\n다시 인도로 돌아가는 거야?"
    testparser = re.compile('"translatedText"\s?:\s?"(.*)"')


    encText = urllib.parse.quote(text)
    data = "source=en&target=ko&text=" + encText
    url = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation"
    request = urllib.request.Request(url)
    request.add_header("X-NCP-APIGW-API-KEY-ID", NAVER_CLIENT_ID)
    request.add_header("X-NCP-APIGW-API-KEY", NAVER_CLIENT_SECRET)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if (rescode == 200):
        response_body = response.read()
        if verbose:
            print(response_body.decode('utf-8')[:1000])
        text = testparser.findall(response_body.decode('utf-8'))[0]
        return text
    else:
        print("Error Code:" + rescode)
        return None

###############################
#
#   60초 단위로 자르자
#   60초단위 자르는데 오버랩은 일단생각하지말고
#   빅뱅이론 한 세트를 통으로 잘라볼까? 몇번까지 한번에 요청가능하지?
#
###############################

def slice_video(video_name, directory, sec = 14.8, overlap = 1):
    #with overlap
    # 15초에 오버랩 주기 수정
    clip = VideoFileClip(os.path.join(directory, video_name))
    duration = clip.duration
    n_slice =  int(np.ceil((duration - overlap)/(sec-overlap)))

    clip_names = []
    for i in range(n_slice):

        clip_name = video_name.split('.')[0] + '_' + ('{}'.format(1000000+i))[-2:]+ '.' + video_name.split('.')[1]
        clip_start = i*(sec-overlap)
        clip_end = clip_start + sec
        ffmpeg_extract_subclip(filename = os.path.join(directory, video_name), t1 = clip_start, t2 = clip_end,
                               targetname= os.path.join(directory, clip_name))

        clip_names.append(clip_name)

        #시간 다 다르므로 여기서 clip_names 만 주기
    return clip_names


def get_audio(video_name, directory):
    #clip = VideoFileClip(os.path.join(dir, video_name))
    ffmpeg_extract_audio(os.path.join(directory, video_name),
                         output = os.path.join(directory, ''.join(video_name.split('.')[:-1]) + '.mp3'))


def stt(name, directory, verbose = False):
    lang = "Eng"  # 언어 코드 ( Kor, Jpn, Eng, Chn )
    url = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + lang
    data = open(os.path.join(directory, name), 'rb')
    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
        "Content-Type": "application/octet-stream"
    }
    response = requests.post(url, data=data, headers=headers)
    rescode = response.status_code

    datare = re.compile('{"text":"(.*)"}')

    if (rescode == 200):
        if verbose:
            print(response.text)
        output_path = os.path.join(directory, ''.join(name.split('.')[:-1]) + '.txt')
        with open(output_path, 'w') as f:
            f.write(response.text)
        puretext = ''.join(datare.findall(response.text))
        return puretext

    else:
        print("Error : " + response.text)
        return None

def slice_and_stt(video_names, directory, **kwargs):
    if type(video_names) == 'name.avi':
        video_names = [video_names]

    verbose = kwargs.pop('verbose', False)
    #out_info.append(dict(out_name=out_name, clip_start=clip_start,
    #                    clip_end=clip_end, sub_start=sub_start, sub_end=sub_end))
    log_list = []
    for video_name in video_names:
        clip_names = slice_video(video_name, directory, **kwargs)

        # mp3 만들고 대본 만들기 까지만! smi는 노
        for clipname in clip_names:
            get_audio(clipname, directory=directory)

        for clipname in clip_names:
            audio_name = clipname.split('.')[0] + '.mp3'
            txt = stt(audio_name, directory=directory, verbose = verbose)

        log_list.append(dict(video_name=video_name, clip_names=' '.join(clip_names)))

    df = pd.DataFrame.from_dict(log_list)
    df_path = prepare.get_save_path(dir=directory, name='slice_stt_log{}'.format(prepare.cur_string()),
                                    format='.csv',
                                    replace=False)
    df.to_csv(df_path, encoding= CSV_ENCODING)

if __name__ == '__main__':
    #####################
    #
    #   자막합치기!
    #   태스크별로 따로 메인파일만들기 이거 자막만들기 메인으로 넘겨!!
    #
    ##############################
    video_names = ['FR1' + ('{}'.format(i + 1000))[-2:] + '.mp4' for i in range(1,8)]
    print(video_names)
    slice_and_stt(video_names=video_names, directory='./stt', sec = 15, overlap = 0.5, verbose = True)

    #마지막 로그 저장
    ################
    #   돌려논데이터 가지고 smi는 따로 만들자.

    # smi = smipy.Smi()
    # smi.from_sentences(sentences)
    # smitext = smi.export()
    # smi_name = ''.join(video_name.split('.')[:-1]) + '.smi'
    # with open(os.path.join(directory, smi_name), 'w') as f:
    #     f.write(smitext)
