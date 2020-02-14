'''
프로젝트 내부의 다른 파일들은 참고용이고

이 파일로 어떻게 pandas 다루는지에 대해서 대략 예시를 보여줌

./clips 내부 word별로 자막과 mp4 클립 있음


'''

import os
import pandas as pd

#Open pandas data
#
worddf = pd.read_csv('./testwords.csv')

clip_path = './clips'

for i in range(len(worddf)):
    row = worddf.iloc[[i]] #i번째 row를 dictionary처럼 접근 가능
    ori = row['original_word'].item() #original word 기본형
    subindex = row['sub_index'].item() #subindex : 해당 word 예시의 구분코드
    out_name = '%s_%2d' % (ori, subindex)


    smitxt = open(os.path.join(clip_path, ori, out_name + '.smi'), 'r').read()# './clips/end/end_ 0.smi
    print('Smi file in {}'.format(os.path.join(clip_path, ori, out_name + '.smi')))
    print('\n'.join(smitxt.split('\n')[:5]))
    #movie 파일 경로는
    moviepath = os.path.join(clip_path, ori, out_name + '.mkv')# './clips/end/end_ 0.mkv