import pandas as pd
import os
import json
from moviepy.editor import *
import smipy

from subprocess import check_output
from naverapi import slice_video, get_audio, stt

def make_subtitle(movie_name, directory, overlap = 1):
    format_m = '.mp4'
    print('making subtitle {}'.format(movie_name))

    all_names = [n for n in os.listdir(directory) if n[:len(movie_name) + 1] == movie_name + '_']
    clip_names = [n for n in all_names if n[-4:] == format_m]
    text_names = [n for n in all_names if n[-4:] == '.txt']
    clip_names.sort()

    durations = []

    for cn in clip_names:
        clip = VideoFileClip(os.path.join(directory, cn))
        dur = clip.duration
        durations.append(dur)


    times = []
    for ind, dur in enumerate(durations):
        start_time = round(sum(durations[:ind]) - (ind) * overlap, 2) + overlap
        end_time = start_time + dur - overlap
        times.append((int(start_time * 1000), int(end_time * 1000) - 2))

    subs = []
    for ind, tn in enumerate(text_names):
        _js = open(os.path.join(directory, tn), 'r').read()
        txt = json.loads(_js)['text']
        s, e = times[ind]
        subs.append(dict(start=s, end=e, eng=txt, kor=''))

    smi = smipy.Smi(

    )
    smi.from_sentences(subs)

    smitext = smi.export()
    smi_path = os.path.join(directory, movie_name.split('.')[0] + '.smi')
    print('saving subtitle {}'.format(smi_path))
    with open(smi_path, 'w') as f:
        f.write(smitext)

if __name__ == '__main__':
    movie_names = ['FR1' + '{}'.format(1000 + i)[-2:] for i in range(1,3)]
    directory = './stt'
    for movie_name in movie_names:
        make_subtitle(movie_name, directory)


