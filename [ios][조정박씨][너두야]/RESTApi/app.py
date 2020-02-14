from flask import Flask, request, jsonify
import pandas as pd
import json
import os

app = Flask(__name__)

@app.route('/getdata', methods=['GET', 'POST', 'DELETE', 'PUT'])
def returndata():
    CSV_ENCODING = 'cp949'
    'sme_string'.encode('utf-8')
    reader = pd.read_csv(os.path.join('u_clips_db_mod.csv'), encoding = 'UTF-8', dtype=str)
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
            #    del row1['Unnamed: 0.1']
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

    with open('clips_db.json','w') as make_file:
        json.dump(a, make_file, indent="\t")

    return jsonify(a)

@app.route('/api/echo-json', methods=['GET', 'POST', 'DELETE', 'PUT'])
def add():
    data = request.get_json()
    print(data)
    # ... do your business logic, and return some response
    # e.g. below we're just echo-ing back the received JSON data
    return jsonify(data)


@app.route('/')
def HelloWorld():
    return "Naver AI Hackerton"


if __name__ == "__main__":
     app.run( host="0.0.0.0", port="5000",debug=False)
