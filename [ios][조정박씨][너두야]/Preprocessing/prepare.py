import os
import re
import warnings

import pandas as pd
from moviepy.video.io.ffmpeg_tools import ffmpeg_extract_subclip

import smipy as smipy

CSV_ENCODING = 'cp949'
REPLACE = False

##########################################
#
#       Read smi and parse/save tokenized data
#
############################################

eng_title_signal = ['ENCC', 'EnglishSC']
kor_title_signal = ['KRCC', 'KoreanSC']

#여러단어로 된 제거할 것들
proper_nouns = ['Cheesecake Factory', 'Big Bang Theory', 'nbsp']

#한단어로 된 제거할 것들
athe = ['a', 'the', 'an', 'it', 'I']

def make_indexing(sminames, output_name, movie_dir, verbose = False):
    if type(sminames) == type('subtitle.smi'):
        sminames =[sminames]

    indexing_result = []

    for sminame in sminames:
        smi = smipy.Smi(os.path.join(movie_dir, sminame))
        subtitles = smi.subtitles
        print('Processing {}'.format(sminame))

        if smi.sinc_verification:
            sinc = 'T'
        else:
            sinc = 'F'

        if smi.eng_signal is None:
            raise NameError('The english subtitle signal is not detected in {}'.format(sminame))
        if smi.kor_signal is None:
            warnings.warn('The korean subtitle signal is not detected')

        for ind, sub in enumerate(subtitles):
            eng_sentence = sub['eng']
            start_time = sub['start']
            end_time = sub['end']

            if eng_sentence is not None:
                token_list = to_tokens(eng_sentence)

                for word in token_list:
                    indexing_result.append(dict(
                        der_word=word, subtitle_ind=ind, eng_sent=eng_sentence,
                        video_code=''.join(sminame.split('.')[:-1]),
                        start=start_time, end=end_time, tokens = ' '.join(token_list),
                        movie_dir = movie_dir, sinc = sinc
                    ))

    df = pd.DataFrame(indexing_result)
    df.index.name = 'index'
    ####    Saving results

    df_path = get_save_path(dir=movie_dir, name=output_name, format = '.csv')
    df.to_csv(df_path, encoding=CSV_ENCODING)
    return df

def make_word_list(originals, original_to_derivative,original_to_meaning, smi_df_lists, output_name,
                   before_window = 20000, after_window = 10000, output_dir ='./'):
    Author = 'YB'
    #####################################
    #
    #   word list 가지고 단어장 초안 만드는 과정
    #
    #####################################

    #### indexing of word bag
    ori_to_index = {}
    for index, original in enumerate(originals):
        ori_to_index[original] = index

    der_to_index = {}

    for index, original in enumerate(originals):
        ders = original_to_derivative[original]
        for der in ders:
            der_to_index[der] = index

    derivative_to_ori = {}
    derivatives = []

    for k, v in original_to_derivative.items():
        for der in v:
            derivatives.append(der)
            derivative_to_ori[der] = k

    ori_counter = {}
    for ori in originals:
        ori_counter[ori] = 0

    ori_counter_bigbang = {}
    for ori in originals:
        ori_counter_bigbang[ori] = 0

    # list가 아니면 list화
    if not type(smi_df_lists) == type([]):
        smi_df_lists = [smi_df_lists]

    # #df구조
    # indexing_result.append(dict(
    #     der_word=word, subtitle_ind=ind, eng_sent=eng_sentence,
    #     video_code=''.join(sminame.split('.')[:-1]),
    #     start=start_time, end=end_time, tokens=' '.join(token_list),
    #     movie_dir=movie_dir, sinc=smi.sinc_verification
    # ))

    res_list = []
    for df in smi_df_lists:
        #경로모드
        if type(df) == type('path.csv'):
            if df[-4:] == '.csv':
                df = df[:-4]
            df = pd.read_csv(os.path.join(output_dir, df + '.csv'), encoding = CSV_ENCODING)


        for derivative in derivatives:
            df_sel = df[df['der_word'] == derivative]
            # indexing_result.append(dict(
            #     der_word=word, subtitle_ind=ind, eng_sent=eng_sentence,
            #     video_code=''.join(sminame.split('.')[:-1]),
            #     start=start_time, end=end_time, tokens=' '.join(token_list),
            #     movie_dir=movie_dir, sinc=smi.sinc_verification
            # ))

            for _i in range(len(df_sel)):
                row = df_sel.iloc[_i]
                d = dict(row)

                ind = der_to_index[derivative]
                ori = derivative_to_ori[derivative]
                d['word_ind'] = der_to_index[derivative]
                d['ori_word'] = derivative_to_ori[derivative]
                d['clip_index'] = ori_counter[ori] + 10
                ori_counter[ori] +=1

                if d['video_code'][:2] == 'BB':
                    ori_counter_bigbang[ori] +=1

                # pick neighbors of sentences
                smipath = os.path.join(d['movie_dir'], d['video_code'] + '.smi')
                smi = smipy.Smi(smipath)
                neighbor_start = d['start'] - before_window
                neighbor_end = d['end'] + after_window
                cut_list, cut_ind = smi.slice(start_time=neighbor_start, end_time=neighbor_end)
                try:
                    _senti = cut_ind.index(d['subtitle_ind'])
                    before_list = cut_list[:_senti]
                    after_list = cut_list[_senti + 1:]
                except:
                    before_list = []
                    after_list = []

                before_text = '\n'.join([sent['eng'] for sent in before_list])
                after_text = '\n'.join([sent['eng'] for sent in after_list])
                _before_kr = '\n'.join([sent['kor'] for sent in before_list])
                _after_kr = '\n'.join([sent['kor'] for sent in after_list])

                d['_before_no'] = len(before_list)
                d['_after_no'] = len(after_list)

                d['before_text'] = before_text
                d['after_text'] = after_text

                d['_before_kor'] = _before_kr
                d['_after_kor'] = _after_kr

                d['word_meaning'] = original_to_meaning[ori]

                d['verify'] = 'F'

                if ori_counter_bigbang[ori] > 10:
                    pass
                else:
                    res_list.append(d)
        df = pd.DataFrame.from_dict(res_list)

    #abstract result
    abstract_result = []
    for ind, ori in enumerate(originals):
        no_occur = ori_counter[ori]
        abstract_result.append(dict(ori_word = ori, occurance = no_occur))
    df_abs = pd.DataFrame.from_dict(abstract_result)

    #Saving df

    out_path = get_save_path(dir = output_dir, name = output_name, format = '.csv')
    out_path_abs = get_save_path(dir=output_dir, name=output_name + '_abs', format='.csv')

    df.to_csv(out_path, encoding= CSV_ENCODING)
    df_abs.to_csv(out_path_abs, encoding = CSV_ENCODING)


def make_clip(words_path, title, out_dir = './clips', pad = 2000, encoding = 'utf-8'):
    ##########################################
    #
    #   clip
    #   밑 변수 순서나 인덱싱 재정리할것!!
    #
    ##########################################
    try:
        worddf = pd.read_csv(words_path, encoding = encoding)
    except:
        worddf = pd.read_csv(words_path, encoding = CSV_ENCODING)

    clip_result_list = []
    for i in range(len(worddf)):

        row = dict(worddf.iloc[i])

        ori = row['ori_word']
        der = row['der_word']
        clip_index = row['clip_index']
        start_time = row['start'] - pad
        end_time = row['end'].item() + pad
        word_meaning = row['word_meaning']
        movie_dir = row['movie_dir']
        video_code = row['video_code']

        if video_code[:2] == 'BB' :
            video_name = 'Big Bang Theory'
        elif video_code[:2] == 'SI':
            video_name = 'Silicon Valley'
        elif video_code[:2] == 'FR':
            video_name = 'Friends'
        else:
            video_name = ''

        video_name = video_name + ' ' + 'Season {} Ep{}'.format(video_code[2], video_code[3:])



        eng_sent = row['eng_sent']
        word_ind = row['word_ind']

        word_loc = -1
        for _i, _w in enumerate(eng_sent.split(' ')):
            if der in ''.join(to_tokens(_w)):
                word_loc = _i

        clip_code = '{}'.format(11000000 + clip_index + int(row['word_ind']) * 1000)
        clip_code = clip_code[-7:]

        smipath = os.path.join(row['movie_dir'], row['video_code'] + '.smi')
        smi = smipy.Smi(smipath)


        # before after lines 중심으로 movie start end time 알아내기
        if type(row['before_text']) == type('sometext'):
            before_no = len(row['before_text'].strip().split('\n'))
        else:
            before_no = 0

        if type(row['after_text']) == type('sometext'):
            after_no = len(row['after_text'].strip().split('\n'))
        else:
            after_no = 0


        sub_index = row['subtitle_ind']
        kor_sent = smi.subtitles[sub_index]['kor']

        sub_slice = smi.subtitles[sub_index - before_no:sub_index + 1 + after_no]
        clip_start = sub_slice[0]['start'] - pad
        clip_end = sub_slice[-1]['end'] + pad

        sent_start = row['start'] - clip_start
        sent_end = row['end'] - clip_start

        # for debugging, lines of neighbors
        before_list = sub_slice[:before_no]
        after_list = sub_slice[-after_no:]

        whole_eng = '\n'.join([sent['eng'] for sent in sub_slice])
        whole_kor = '\n'.join([sent['kor'] for sent in sub_slice])
        # before_text = '\n'.join([sent['eng'] for sent in before_list])
        # after_text = '\n'.join([sent['eng'] for sent in after_list])
        # _before_kr = '\n'.join([sent['kor'] for sent in before_list])
        # _after_kr = '\n'.join([sent['kor'] for sent in after_list])

        # export smi
        cliptxt = smi.export(clip_start, clip_end, slice_manual=sub_slice)
        with open(os.path.join(out_dir, clip_code + '.smi'), 'w') as f:
            f.write(cliptxt)

        # export sliced video
        try:
            ffmpeg_extract_subclip(filename = os.path.join(movie_dir, video_code + '.mkv'),
                               t1 =clip_start / 1000, t2 =clip_end / 1000,
                               targetname=os.path.join(out_dir, clip_code + '.mp4'))
        except:
            print('error in {}'.format(video_code))
            continue
        # export final db for app
        d = dict(word_ind = word_ind, ori_word = ori, clip_code = clip_code,
                 eng_sent =eng_sent, kor_sent = kor_sent,
                 sent_start = sent_start, sent_end = sent_end, word_loc = word_loc, line_loc = before_no, whole_eng = whole_eng,
                 whole_kor = whole_kor, word_meaning = word_meaning, video_name = video_name,
                 _v_s = clip_start, _v_e = clip_end)
        clip_result_list.append(d)
    df = pd.DataFrame.from_dict(clip_result_list)
    df.to_csv(get_save_path(dir = out_dir, name = title, format = '.csv'), encoding = CSV_ENCODING)



#############################################################
#       Helpers
#############################################################
import time
def cur_string():
    tm = time.localtime()
    return '%2d%2d%2d'%(tm.tm_hour, tm.tm_min, tm.tm_sec)


def is_contain(word, sent_list):
    contain = False
    for sent in sent_list:
        if word == sent:
            contain = True
    return contain

def to_sentence(raw_sent):
    #처음나오는 - 지우기
    sent = re.sub('^\s?-', '', raw_sent)
    #\n모두지우기
    sent = re.sub('\n', ' ', sent)
    #<br>태그는 ' '로
    sent = re.sub('<BR>', ' ', sent)
    #나머지태그는 걍 제외
    sent = re.sub('<.{1,3}>', ' ', sent)

    sent = sent.strip()

    return sent

def to_tokens(eng_sent):
    nohan = re.compile('[a-zA-Z\'\"\s]+')
    out_sent = ''.join(nohan.findall(eng_sent))

    #lower and strip
    out_tokens = out_sent.lower().strip()

    #   여러단어로 된 토큰 제거
    #   like 고유명사
    for proper_noun in proper_nouns:
        if proper_noun.lower() in out_tokens:
            out_tokens = out_tokens.replace(proper_noun.lower(), '')

    #공백여러개있으면그거 지우기
    out_tokens = out_tokens.replace('  ', ' ')
    #어차피 나중에 다시 거를테니 큰신경 쓰지 말자

    #   한 단어로 된 토큰 제거
    #   like 관사
    _sent_list = out_tokens.split(' ')
    sent_list = [word for word in _sent_list if word not in athe]
    return sent_list


def get_save_path(dir, name, format, replace = REPLACE):
    format = format.replace('.', '')

    if len(name) >= len(format) and name[-len(format):] == format:
        name = name[:-len(format)].replace('.', '')

    if replace == True:
        output_path = os.path.join(dir, name + '.csv')
    else:
        if os.path.exists(os.path.join(dir, name + '.' + format)):
            for i in range(1, 100):
                if not os.path.exists(os.path.join(dir, name + '_{}'.format(i) + '.csv')):
                    break

            output_path = os.path.join(dir, name + '_{}'.format(i) + '.csv')
        else:
            output_path = os.path.join(dir, name + '.csv')


    return output_path

def video_code_to_name(video_code):
    return video_code