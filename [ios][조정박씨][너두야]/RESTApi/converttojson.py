import json
import pandas as pd
import os
CSV_ENCODING = 'cp949'
'sme_string'.encode('utf-8')

if True:
    reader = pd.read_csv(os.path.join('u_clips_db_mod.csv'), dtype=str)
    a = dict()
    count2 = 0
    for i3 in range(len(reader)):
        c = list()
        row = reader.iloc[i3]
        row = dict(row)
        for j in a.keys():
            if (j == row['ori_word']):
                count2 = count2 + 1
                break
        if ((0 == count2)):
                for i4 in range(len(reader)):
                    row1 = reader.iloc[i4]
                    row1 = dict(row1)
                 #   del row1['Unnamed: 0.1']
                    del row1['Unnamed: 0']
                    del row1['word_ind']
                    del row1['word_meaning']
                    if (row['ori_word'] == row1['ori_word']):
                        del row1['ori_word']
                        c.append(row1)
                b = dict()
                b["meaning"] = row['word_meaning']
                b["tracks"] = c
                a[row['ori_word']] = b
        else:
            count2 = count2 - 1

    json_val = json.dumps(a)
    with open('clips_db.json','w') as make_file:
        json.dump(a, make_file, indent="\t")

with open('clips_db.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)
print(json_data)