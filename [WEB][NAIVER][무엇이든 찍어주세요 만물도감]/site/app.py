# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, redirect
import json
import pymysql
import requests
import tensorflow.keras
from PIL import Image, ImageOps
import numpy as np
from flask_ngrok import run_with_ngrok

app = Flask(__name__)
run_with_ngrok(app)

client_id = "w8o6iqp9z4"
client_secret = "H9N0Ty3G7LZgGUdtoVolTNXzTO08R5QVHxm5hoga"

@app.route('/')
def index():
    return render_template('main.html')

###################################### 업로드 #######################################
@app.route('/upload_picture', methods = ['GET', 'POST'])
def upload_picture():
    try:
        if request.method == 'POST':
            f = request.files['file']
            upload_file_name = 'uploaded_img' + '.' + f.filename.split('.')[-1]
            upload_file_url = "./static/img/" + 'uploaded_img' + '.' + f.filename.split('.')[-1]
            f.save(upload_file_url)
###################이미지 전처리######################
            image = Image.open(upload_file_url)
            resize_image = image.resize((224, 224))
            resize_image = resize_image.convert("RGB")
            resize_image.save(upload_file_url , "JPEG", quality = 50)
    except KeyError:
        return render_template("error.html")
    
    return render_template('/waiting.html', upload_file_name = upload_file_name)

###################################### 예측 #######################################
@app.route("/prediction" , methods = ['GET' , "POST"])
def prediction():
    file_name = (request.form['name'])
    name = "./static/img/" + file_name #request.form['name']
    ############### naver api 사용
    url = "https://naveropenapi.apigw.ntruss.com/vision-obj/v1/detect"
    files = {'image': open(name, 'rb')}
    headers = {'X-NCP-APIGW-API-KEY-ID': client_id, 'X-NCP-APIGW-API-KEY': client_secret }
    response = requests.post(url,  files=files, headers=headers)
    rescode = response.status_code
    if(rescode==200):
        ############## NAVER API 제공한 dectection_name 가져오기
        response_json = json.loads(response.text)
        response_list = response_json['predictions']
        if response_list[0]['num_detections'] != 0:
            print(response_list)
            detection_names = response_list[0]['detection_names'][0]
        else:
            return render_template("error.html")
    else:
        return render_template("error.html")

    ########### 소분류될 카테고리
    small_category_lst = {
        'dog' : ["Chao", "Chihuahua", "Siberia"],
        'car' : ["Sonata", "Starex", "Avante"],
        'laptop' : ["LG", "Hansung", "Mac"],
        'cat' : ["Sphinx", "Scotishfold", "Korea"]
    }
    ############ keras 분석
    print('모델가져오는즁')
    if detection_names in small_category_lst: # 소분류 모델이 없을때 not in
        model = tensorflow.keras.models.load_model('./static/keras_model/keras_model_'+ detection_names + '.h5')
        print('완료')
        data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
        image = Image.open(name)
        image_array = np.asarray(image)
        normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
        data[0] = normalized_image_array
        prediction = model.predict(data)
        result = small_category_lst[detection_names][np.argmax(prediction[0])]
    else :
        print(detection_names)
        result = detection_names
        pass
    
    ############ mysql에서 ITEM table의 ITEMID 값을 가져옴
    db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
    cursor = db.cursor()
    item_sql = "select * from ITEM where ITEMID = '" + result + "'"
    cursor.execute(item_sql)
    rows=cursor.fetchall()
    if len(rows) == 0:
        desc = ''
    else:
        desc = rows[0][1]
    cursor.close()
    db.close()
    return render_template("prediction.html" , detection_name = detection_names , smallCategory = result, itemDesc = desc)

############ db instert
@app.route('/add', methods = ['GET', 'POST'])
def add():
    data = request.get_json()
    print(data)
    smallCategory = data['smallCategory']

    db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
    cursor = db.cursor()
    add_sql = "select * from USER_ITEM where ITEMID = '" + smallCategory + "'"
    cursor.execute(add_sql)
    rows=cursor.fetchall()
    add_sql = "INSERT INTO `user_item` (`USERID`, `ITEMID`, `X_ITEM`, `Y_ITEM`, `Z_ITEM`, `WIDTH`, `HEIGHT`) VALUES ('admin', '" + smallCategory + "', '30', '30', '99', '30', '30')"
    cursor.execute(add_sql)
    rows=cursor.fetchall()
    db.commit()
    db.close()
    return jsonify(data)

############ user_item s컬럼 값 update하기
@app.route('/show', methods = ['GET', 'POST'])
def show():
    data = request.get_json()
    print(data)
    INDEX_ITEM = data['INDEX_ITEM']
    if data['s'] == '0':
        s = 0
    else:
        s = 1
    print(s)

    db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
    cursor = db.cursor()
    show_sql = f"update USER_ITEM SET s = '{s}' where INDEX_ITEM = '{INDEX_ITEM}'"
    cursor.execute(show_sql)
    db.commit()
    db.close()
    return jsonify(data)






################################### 저장소 ####################################
@app.route('/repository')
def container():
    db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
    cursor = db.cursor()
    backcolor_sql = "select * from USER_SETTING where USERID = 'admin'" 
    cursor.execute(backcolor_sql)
    rows=cursor.fetchall()
    row_headers=[x[0] for x in cursor.description]
    backcolor = dict(zip(row_headers,rows[0]))['repo_color']
    #print(backcolor)
    # 데이터베이스에서 사용자 이미지 가져오기
    item_sql = "select * from USER_ITEM where USERID = 'admin' AND s = 1" 
    cursor.execute(item_sql)
    rows=cursor.fetchall() 
    row_headers=[x[0] for x in cursor.description]
    json_data=[]
    for result in rows:
        json_data.append(dict(zip(row_headers,result)))
    cursor.close()
    db.close()
    return render_template('repository.html',json_data = json_data, backcolor= backcolor)

############ 이미지 변경
@app.route('/image', methods = ['GET', 'POST'])
def image():
    if request.method == 'POST':
        data = request.get_json()
        for i in data:
            i = json.loads(i)
            INDEX_ITEM = i['INDEX_ITEM']
            x = i['x']
            y = i['y']
            z = i['z']
            width = i['width']
            height = i['height']

            db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
            cursor = db.cursor()
            item_sql = f"UPDATE USER_ITEM SET X_ITEM = {x}, Y_ITEM = {y}, Z_ITEM = {z}, WIDTH = {width}, HEIGHT = {height} where (INDEX_ITEM = '{INDEX_ITEM}')"
            cursor.execute(item_sql)
            db.commit()
            db.close()
    return jsonify(data)


############ 배경색 변경
@app.route('/backcolor', methods = ['GET', 'POST'])
def backcolor():
    if request.method == 'POST':
        db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
        cursor = db.cursor()
        # 데이터베이스에서 사용자 이미지 가져오기
        data = request.get_json()
        item_sql = f"update USER_SETTING SET repo_color = '{data['backcolor']}' where USERID = 'admin'"
        cursor.execute(item_sql)
        db.commit()
        db.close()
    return jsonify(data)




############ predict 페이지에서 홈버튼을 눌렀을 시 index 페이지로 이동
@app.route('/go_main')
def go_main():    
    return redirect(url_for('index'))
@app.route('/go_repository')
def go_repository():    
    return redirect(url_for('container'))
@app.route('/storage')
def storage():
    db = pymysql.connect(host="127.0.0.1", user="root",passwd="1234", db='tests', port=3306)
    cursor = db.cursor()
    ############ 데이터베이스에서 사용자 이미지 가져오기
    item_sql = "select * from USER_ITEM where USERID = 'admin'" 
    cursor.execute(item_sql)
    rows=cursor.fetchall() 
    row_headers=[x[0] for x in cursor.description]
    json_data=[]
    for result in rows:
        json_data.append(dict(zip(row_headers,result)))
    cursor.close()
    db.close()
    print(json_data)
    return render_template('storage.html',json_data = json_data)



if __name__ == '__main__':
    #서버 실행
    app.run()