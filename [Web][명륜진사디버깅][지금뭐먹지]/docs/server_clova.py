from flask import Flask, request, jsonify
from IPython.core.display import HTML
import requests
import urllib
from bs4 import BeautifulSoup
import json
import random


import pandas as pd
import numpy as np
import random
from datetime import datetime
import calendar
import cx_Oracle
from sqlalchemy import types, create_engine
import os
from bs4 import BeautifulSoup
from urllib.request import urlopen
from urllib import parse

def db_read():
    os.environ["NLS_LANG"] = ".AL32UTF8"
    START_VALUE = u"Unicode \u3042 3".encode('utf-8')
    END_VALUE = u"Unicode \u3042 6".encode('utf-8')

    conn = create_engine("oracle+cx_oracle://mrjs:asd135@49.50.165.142:1521/ORCL",encoding = "UTF-8")

    df_culture = pd.read_sql("SELECT * FROM CULTURE_SURVEY", con=conn)
    print("test1")
    df_ingredient = pd.read_sql("SELECT * FROM INGRE_SURVEY", con=conn)
    print("test2")
    df_food = pd.read_sql("SELECT * FROM FOOD_SURVEY", con=conn)
    df_keyword = pd.read_sql("SELECT * FROM KEYWORD_SURVEY", con=conn)
    df_keyword.drop("index", axis=1)
    preference = pd.merge(df_culture, df_ingredient, how ='inner', on='userID')
    preference = pd.merge(preference , df_food, how ='inner', on='userID')
    
    
culture_data = pd.read_csv("./datas/culture_survey.csv")
culture_data.set_index("userID", inplace = True)

ingredient_data = pd.read_csv("./datas/ingredient_survey.csv")
ingredient_data.set_index("userID", inplace = True)

food_data = pd.read_csv("./datas/food_survey.csv")
food_data.set_index("userID", inplace = True)

keyword_data = pd.read_csv("keyword_food.csv")
keyword_data.drop('Unnamed: 0', axis=1, inplace=True)

preference = pd.merge(culture_data, ingredient_data, how ='inner', on='userID')
preference = pd.merge(preference , food_data, how ='inner', on='userID')
    

def preference_score(user_id,menu,score):
    global df_keyword
    for i in range(len(preference.iloc[0])):
        df_keyword=df_keyword.replace(to_replace=preference.iloc[0].index[i],value=preference.iloc[0][i])
    menu_score= df_keyword[menu].astype("int")
    val_score= list(map(float, [preference.loc[user_id][i] for i in menu_score]))
    array_score = np.array(val_score)
    array_score += (score-3)/10
    array_score[array_score>5] = 5
    array_score[array_score<1] = 1
    
    return array_score


def recommend_u(user_id):
    key2 = preference.loc[user_id]#userid의 키워드별 선호도 값 반환
    global keyword_data
    df_keyword2=keyword_data
    for i in range(len(preference.loc[user_id])):#키워드 만큼 돈다.
        df_keyword2 = df_keyword2.replace(to_replace=key2.index[i],value=key2[i])
    food_data3 = [i[0] for i in sorted(dict(df_keyword2.astype('int').sum()).items(),
                      key=lambda x: x[1], reverse=True)[:3]]
    food_data3 = np.array(food_data3)
    food_data3 =food_data3.tolist()
    
    return food_data3

def crawler(gu,dong,food):

    url_get = gu+" "+dong + " "+ food
    url = "https://www.diningcode.com/list.php?query=" + parse.quote(url_get)
    print(url)
    soup = urlopen(url)
    bs = BeautifulSoup(soup, 'html.parser')

    rank_list = bs.select('a > span.btxt')
    menu_list = bs.select('a > span.stxt')
    feature_list = bs.select('a > span:nth-child(4)')
    address_list = bs.select('a > span:nth-child(5)')

    food_rank=[]
    food_menu=[]
    food_feature=[]
    food_address=[]

    for rank in rank_list:
        food_rank.append(rank.text.split(" ")[1])
    for menu in menu_list:
        food_menu.append(menu.text)
    for feature in feature_list:
        food_feature.append(feature.text)
    for address in address_list:
        food_address.append(address.text)

    span_style = bs.select('a > span.img')
    text_list=[]

    food_img=str(span_style[0]).split('\'')[1]
    text_list.append([food_rank[0],food_menu[0],food_feature[0],food_address[0][3:],food_img])

    return text_list[0]
# def processDialog(req):
# #     req=json.dumps(req, indent=4,ensure_ascii=False)
#     answer=req['queryResult']['fulfillmentText']
#     intentName=req['queryResult']['intent']['displayName']
    
    
#     if intentName=='query':
#         word=req['queryResult']['parameters']['any']
#         text=getTerms(word)[0]
#         res={'fulfillmentText': text}

#     elif intentName=='Weather':
#         date=req['queryResult']['parameters']['date']
#         geo_city=req['queryResult']['parameters']['geo-city']
#         info=getWeather(geo_city)
# #         res={ 'fulfillmentText'  :   f"{geo_city} 날씨정보 : {info['temp']} / {info['desc']}"  }
            
        
    
#     elif intentName=='order2':
#         params=req['queryResult']['parameters']['food_number']
#         price={"짜장면":6000,"짬뽕":8000,"탕수육":15000,"깐풍기":30000,"유산슬":20000}
#         output=[food.get('number-integer',1)*price[food['food']] for food in params]
        
        
#         res={'fulfillmentText':"%.i 원 입니다."%int(sum(output))}
#     else:
#         res={'fulfillmentText':answer}
#     return res




app=Flask(__name__)




 
@app.route('/', methods=['POST','GET'])
def home():
    return "SERVER OPENED"



@app.route('/review', methods=['POST','GET'])

def review():
    try:
        req=request.get_json(force=True)
        print(req)
        return "기록되었습니다"    
    except:
        return "기록이 실패되었습니다"

@app.route('/recommend', methods=['POST',"GET"])
def recommend():
    
#     if request.method=='GET':
#         a='명륜진사갈비'
#     else:        
    rec=recommend_u(0)
    print(rec)

    return rec[1]+'을(를) 추천합니다!'


@app.route('/recommend_with', methods=['POST',"GET"])
def food_with():
    rec0=recommend_u(0)
    rec1=recommend_u(2)
    
    common_rec=list(set(rec0).intersection(rec1))
    
    if len (common_rec)!=0:
        return common_rec[0]+'을(를) 추천합니다~!'
    
    else:
        return rec0[0]+ '을(를) 추천합니다!'
    

    
    
if __name__=='__main__':
    app.run(host='0.0.0.0', port=80,debug=True)    