import psycopg2
import pandas as pd
import numpy as np
from copy import deepcopy

db = np.loadtxt("db.txt", dtype=str)
conn_string = "host='{}' dbname='{}' user='{}' password='{}' port='{}'".format(*db)
conn = psycopg2.connect(conn_string)
cur = conn.cursor()

batch = 1000
for epoch in range(121831//batch)[:10]:
    df = pd.DataFrame()
    # cur.execute("select game_id from matches where game_version = '10.3.307.1028' limit %d offset %d;" % (batch, batch*epoch))
    # game_id = cur.fetchall()
    #
    # df['game_id'] = game_id

    participants = []
    for gamer in range(10):
        cur.execute("select json #> '{participants, %d}' ->> 'championId' from matches where game_version = '10.3.307.1028' limit %d offset %d;" % (gamer, batch, batch*epoch))
        cId = cur.fetchall()

        df["my{}".format(gamer + 1)] = cId

        cur.execute("select json #> '{participants, %d}' #> '{stats, win}' from matches where game_version = '10.3.307.1028' limit %d offset %d;" % (gamer, batch, batch*epoch))
        win = cur.fetchall()

        df["win{}".format(gamer + 1)] = win

        for i in range(6):
            cur.execute("select json #> '{participants, %d}' #> '{stats, item%d}' from matches where game_version = '10.3.307.1028' limit %d offset %d;" % (gamer, i, batch, batch*epoch))
            item = cur.fetchall()

            df["gamer{}_item{}".format(gamer + 1, i + 1)] = item
        print("{}_get_gamer{}".format(epoch, gamer))

    for i in range(len(df)):
        if not df.iloc[i]['win1'][0]:
            for j in range(5 * 8):
                df.iat[i, j], df.iat[i, j + 5 * 8] = df.iat[i, j + 5 * 8], df.iat[i, j]
        print("change{}".format(i))

    for i in range(5):
        for j in range(6):
            df.drop('gamer{}_item{}'.format(i + 6, j + 1), axis=1, inplace=True)
        df.drop(['win{}'.format(i + 1), 'win{}'.format(i + 6)], axis=1, inplace=True)
        print("del{}".format(i))

    for i in range(5):
        df.rename(columns={'my{}'.format(i + 6): 'your{}'.format(i + 1)}, inplace=True)

    for i in range(5):
        now_df = deepcopy(df)
        now_df['target'] = None
        for j in range(5):
            for k in range(6):
                if i == j:
                    now_df.rename(columns={"gamer{}_item{}".format(j + 1, k + 1): "item{}".format(k + 1)}, inplace=True)
                    now_df['n'] = str(i+1)
                else:
                    now_df.drop("gamer{}_item{}".format(j + 1, k + 1), axis=1, inplace=True)

        ite = len(now_df)
        for j in range(ite):
            for k in range(6):
                item = now_df.iloc[j]['item{}'.format(k+1)][0]
                if item:
                    new_item = deepcopy(now_df.iloc[j])

                    new_item['item{}'.format(k+1)] = 0
                    new_item['target'] = item

                    now_df = now_df.append(new_item, ignore_index=True)
        for j in range(ite):
            now_df.drop(j, inplace=True)

        # now_df['n'].astype()
        keys = ", ".join(now_df.keys())
        vs = ("%s, " * len(now_df.keys()))[:-2]
        command = "insert into replace_matches (%s) values (%s);" % (keys, vs)
        for j in range(len(now_df)):
            cur.execute(command, now_df.iloc[j])
            print("insert{}_{}".format(i, j))
        conn.commit()

