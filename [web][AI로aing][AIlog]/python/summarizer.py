# -*- conding: utf-8 -*-
from gensim.summarization.summarizer import summarize
from konlpy.tag import Kkma
import konlpy.tag
import pymysql
import json
import time

import re
kkma = Kkma()
fname = "stopWord.txt"

count = 0
exceptWord = 'posJosa Josa Verb'
def preprocessing(text):
   
    stopwords = []
    with open(fname) as f:
        lines = f.readlines()
        lines = [line.rstrip('\n') for line in open(fname)]
        with open(fname, "r") as ins:
            lines = []
            for line in ins:
                stopwords.append(line)
   
    total_review = ''   
    
    for sentence in kkma.sentences(text):
        sentence = re.sub('([a-zA-Z])','',sentence)
        sentence = re.sub('[ㄱ-ㅎㅏ-ㅣ]+','',sentence)
        sentence = re.sub('[-=+,#/\?:^$.@*\"※~&%ㆍ!』\\‘|\(\)\[\]\<\>`\'…》]','',sentence)
        
        splitSentence = sentence.split()
        
        for sSentence in splitSentence:
            Okt = konlpy.tag.Okt()
            Okt_morphs = Okt.pos(sSentence)
            words = '';
            for word, pos in Okt_morphs:
                if pos == 'Noun' and word in stopwords:
                    continue
                if pos in exceptWord and word[-1].encode("UTF-8") == "다".encode("UTF-8"):
                    word += '\n'
                    global count
                    count += 1
                words += word
            total_review = total_review + words +' '
    
    return total_review

while(True):
    mysqlConn = pymysql.connect(host='localhost', user='root', password='', autocommit=True,
                                db='ailog', charset='utf8', cursorclass=pymysql.cursors.DictCursor)
    print("start")
    cursor = mysqlConn.cursor()

    selectSql = "SELECT * FROM record WHERE status = (%s)"
    cursor.execute(selectSql, "READY")
    updateSql = """UPDATE record SET summarize = (%s), status = 'DONE' WHERE id = (%s)"""
    for item in cursor:
        text = item['text']
        print(text)
        pp = preprocessing(text)
        if count != 0:
            su = summarize(pp)
        else:
            su = pp

        print(count)
        result = su
        print(result)
        cursor.execute(updateSql, (result, item['id']))

    count = 0
    mysqlConn.close()
    time.sleep(5)
    print("sleep end")
