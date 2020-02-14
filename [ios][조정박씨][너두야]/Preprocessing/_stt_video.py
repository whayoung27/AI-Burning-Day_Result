import urllib
import urllib.request

import requests
import smipy
import os
import pandas as pd

import re
from prepare import get_save_path

from moviepy.editor import *
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_audio
import moviepy
import numpy as np

CSV_ENCODING = 'cp949'

NAVER_CLIENT_ID = '78kh5kk9mi'
with open('./secret.txt', 'r') as f:
    NAVER_CLIENT_SECRET = f.read()
NAVER_CLIENT_SECRET = NAVER_CLIENT_SECRET.strip()

###############################
#
#   60초 단위로 자르자
#   60초단위 자르는데 오버랩은 일단생각하지말고
#   빅뱅이론 한 세트를 통으로 잘라볼까? 몇번까지 한번에 요청가능하지?
#
###############################

def slice_video(video_name, dir, sec = 55):
    clip = VideoFileClip(os.path.join(dir, video_name))
    author = 'YB'
    duration = clip.duration
    out_names = []
    for i in range(int(np.ceil(duration/sec))):
        out_name = video_name.split('.')[0] + '_%2d'%i+ '.' + video_name.split('.')[1]
        ffmpeg_extract_subclip(filename = os.path.join(dir, video_name), t1 = i*sec, t2 = (i+1)*sec,
                               targetname= os.path.join(dir, out_name))
        out_names.append(out_name)
    return out_names

def get_audio(video_name, dir):
    #clip = VideoFileClip(os.path.join(dir, video_name))
    ffmpeg_extract_audio(os.path.join(dir, video_name),
        output = os.path.join(dir, ''.join(video_name.split('.')[:-1]) + '.mp3'))


def stt(name, dir, verbose = False):
    lang = "Eng"  # 언어 코드 ( Kor, Jpn, Eng, Chn )
    url = "https://naveropenapi.apigw.ntruss.com/recog/v1/stt?lang=" + lang
    data = open(os.path.join(dir, name), 'rb')
    headers = {
        "X-NCP-APIGW-API-KEY-ID": NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": NAVER_CLIENT_SECRET,
        "Content-Type": "application/octet-stream"
    }
    response = requests.post(url, data=data, headers=headers)
    rescode = response.status_code

    if (rescode == 200):
        print(response.text)
        output_path = os.path.join(dir, ''.join(name.split('.')[:-1]) + '.txt')
        with open(output_path, 'w') as f:
            f.write(response.text)
    else:
        print("Error : " + response.text)


if __name__ == '__main__':
    #video_names = slice_video('BB501.mkv', './stt')
    video_names = [_n for _n in os.listdir('./stt') if _n[-4:] == '.mkv' and '_' in _n]

    for n in video_names:
        get_audio(n, './stt')
    for n in video_names:
        audioname = ''.join(n.split('.')[:-1]) + '.mp3'
        stt(audioname, './stt')


    # clip = VideoFileClip(os.path.join('./stt', 'BB501.mkv'))
    # author = 'YB'#clip.duration = 1292.74
    # csv_loc = './translate'
    # csvnames = ['testbb501.csv']
    #
    # for csvname in csvnames:
    #     df = pd.read_csv(os.path.join(csv_loc, csvname), encoding=CSV_ENCODING)
    #     engsubs = ['{}'.format(str) for str in list(df['eng']) if type(str) == type('line')][:100]
    #     engsubs = '\n'.join(engsubs)
    #
    #     # get data
    #     kortexts = papago_translate(engsubs, verbose = True)
    #     korsubs = kortexts.split('\\n')
    #
    #     korsubs = pd.Series(korsubs)
    #     df.insert(loc=5, column='kor_trans', value=korsubs)
    #
    #     save_path = get_save_path(dir = csv_loc, name = csvname.split('.')[0] + '_t', format='csv', replace = False)
    #
    #
    #     df.to_csv(save_path, encoding=CSV_ENCODING)