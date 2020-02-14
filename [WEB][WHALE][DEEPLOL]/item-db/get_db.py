import psycopg2
import pandas as pd
import numpy as np
import json

with open("item_combination.json", 'r') as fs:
    combination = json.load(fs)

db = np.loadtxt("db.txt", dtype=str)
conn_string = "host='{}' dbname='{}' user='{}' password='{}' port='{}'".format(*db)
conn = psycopg2.connect(conn_string)
cur = conn.cursor()

participants = []
for gamer in range(10):

    cur.execute("select json #> '{participants, %d}' from matches limit 3;" % gamer)
    participant = cur.fetchall()

    data = pd.DataFrame()
    data["gamer{}".format(gamer)] = win

    for i in range(7):
        command = "select json #> '{participants, %d}' #> '{stats, item%d}' from matches limit 3;" % (gamer, i)
        cur.execute(command)
        item = cur.fetchall()
        key = "gamer{}_item{}".format(gamer, i)
        data[key] = item

    participants.append(data)
participants = pd.concat(participants, axis=1)
pass