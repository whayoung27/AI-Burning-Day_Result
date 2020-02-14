import pandas as pd
import os

def to_unicode(dir, name):
    reslist = []
    df = pd.read_csv(os.path.join(dir, name), encoding = 'cp949')
    # for i in range(len(df)):
    #     resdic = {}
    #     row = dict(df.iloc[i])
    #     for k, v in row.items():
    #         resdic[k] = v
    #     reslist.append(resdic)
    #
    # pd.DataFrame.from_dict(reslist).to_csv(os.path.join(dir, 'u_' + name), encoding='utf-8')
    df.to_csv(os.path.join(dir, 'u_' + name))
    df2 = pd.read_csv(os.path.join(dir, 'u_' + name))
    print(df2.iloc[1])


def dummy_meaning_insert():
    df1 = pd.read_csv('./u_final_words.csv')
    df2 = pd.read_csv('./u_clips_db.csv')

    result_list = []
    for i in range(len(df2)):
        row = dict(df2.iloc[i])
        d = {}
        for k, v in row.items():
            d[k] = v
            if row['ori_word'][0] == 'e':
                d['word_meaning'] = '끝'

            else:
                d['word_meaning'] = '놀라다'
        result_list.append(d)

    df1 = pd.DataFrame.from_dict(result_list)
    df1.to_csv('./u_clips_db_m.csv')

# to_unicode('./', 'final_words.csv')
to_unicode('./', 'clips_db_mod.csv')

df = pd.read_csv('./u_clips_db_mod.csv')

