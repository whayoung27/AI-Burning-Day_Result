import os
from prepare import make_indexing, make_word_list, make_clip
import smipy as smipy
import pandas as pd

#################################################
#
#   구현한 함수들을 실제 사용하는 예제
#   smiparser에서 파싱하는 함수,
#   우리가 필요한 단어만 뽑는 함수를 실제 이용함
#
###################################################
bb = './friends'
Encoding = 'cp949'

# smilist = [name for name in os.listdir(bb) if name.split('.')[-1] == 'smi']
# make_indexing(smilist, movie_dir=bb, output_name='friends', verbose = False)



# df = pd.read_csv(os.path.join(bb, 'bigbang.csv'), encoding = Encoding)

from get_word_list import get_oris_ori2der
originals , ori_to_der ,ori_to_meaning = get_oris_ori2der()

# make_word_list(originals, ori_to_der, ori_to_meaning, ['bigbang.csv','silicon.csv','friends.csv'], 'wordlist_raw')

# make_clip('wordlist_mod.csv', title = 'clips_db', pad = 1000)

df = pd.read_csv('./u_clips_db_mod.csv')

print(df)