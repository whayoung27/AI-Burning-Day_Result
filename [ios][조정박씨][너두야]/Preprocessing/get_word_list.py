import pandas as pd
from moviepy.editor import  *

CSV_ENCODING = 'cp949'

# originals = ['_','end', 'wonder' ]
# ori_to_der = {
#     '_' : ['_'],
#     'end' : ['end', 'ended'],
#               'wonder' : ['wonder', 'wondered']
# }
def get_oris_ori2der(verbose = False):
    df = pd.read_csv('final_words.csv', encoding=CSV_ENCODING)
    originals = []
    ori_to_meaning = {

    }
    ori_to_der = {

    }

    for i in range(len(df)):
        row = dict(df.iloc[i])
        word_ori = row['word']
        meaning = row['meaning']
        der = row['der'].split(' ')
        if verbose:
            print('word {} / der {}'.format(word_ori, der))
        originals.append(word_ori)
        ori_to_der[word_ori] = der
        ori_to_meaning[word_ori] = meaning

    lstofdict = [dict(word=word, meaning=ori_to_meaning[word], der=' '.join(der)) for word, der in ori_to_der.items()]
    df_out = pd.DataFrame.from_dict(lstofdict)
    df_out.to_csv('final_words_debug.csv', encoding=CSV_ENCODING)
    return originals, ori_to_der,ori_to_meaning

if __name__ == '__main__':
    get_oris_ori2der()