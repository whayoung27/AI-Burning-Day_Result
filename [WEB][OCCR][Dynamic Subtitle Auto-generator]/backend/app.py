from flask import Flask
from flask_cors import CORS, cross_origin

from flask import request, send_file, make_response
from download import download_from_url
import requests

import os
from os.path import join, dirname
from dotenv import load_dotenv

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

NCP_API_KEY_ID = os.environ.get("NCP_API_KEY_ID")
NCP_API_KEY = os.environ.get("NCP_API_KEY")

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Origin, X-Requested-With, Content-Type, Accept'
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

with open('.env','r') as f:
    env = f.readlines()

@app.route('/download')
def downalod_video():
    result = download_from_url(request.args.get('url'), request.args.get('name'))
    if result:
        return {"filename": f"{request.args.get('name')}.mp4", "path": os.path.join('static', request.args.get('name')+'.mp4'), "result": "success"}
    else:
        return {"result": "error"}

@app.route('/vtt')
@cross_origin()
def serve_vtt_file():
    vtt_name = request.args.get('name')
    # print('req:',vtt_name)
    res = make_response(send_file(os.path.join('vtt_org',vtt_name), mimetype='text/vtt'))
    res.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    return res


@app.route('/vtt/final')
@cross_origin()
def serve_vtt_final_file():
    vtt_name = request.args.get('name')
    res = make_response(send_file(os.path.join('vtt_final',vtt_name), mimetype='text/vtt'))
    res.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
    return res

@app.route('/vtt/download')
@cross_origin()
def downnload_vtt_final_file():
    vtt_name = request.args.get('name')
    res = make_response(send_file(os.path.join('vtt_final',vtt_name)))
    res.headers["Content-Disposition"] = "attachment; filename=final.vtt"
    res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    res.headers['Pragma'] = 'no-cache'
    res.headers['Expires'] = '0'
    return res



@app.route('/vtt/translate')
@cross_origin()
def downnload_translate_vtt():
    vtt_name = request.args.get('name')
    with open('vtt_final/'+vtt_name, 'r') as f:
        s=f.readlines()

    headers = {
        "X-NCP-APIGW-API-KEY-ID":NCP_API_KEY_ID,
        "X-NCP-APIGW-API-KEY":NCP_API_KEY,
        "Content-Type":"application/x-www-form-urlencoded"
    }
    
    data = {
        "source": "ko",
        "target": "en",
        "text": ''.join(s[4::4])
    }


    response = requests.post(url='https://naveropenapi.apigw.ntruss.com/nmt/v1/translation',headers=headers, data=data)
    res = response.json()

    s[4::4] = [line+'\n' for line in res['message']['result']['translatedText'].split('\n')]
    print(s[4::4])
    with open('vtt_final/translate.vtt', 'w') as f:
        f.writelines(s)

    res = make_response(send_file(os.path.join('vtt_final','translate.vtt')))
    res.headers["Content-Disposition"] = "attachment; filename=translate2.vtt"
    res.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    res.headers['Pragma'] = 'no-cache'
    res.headers['Expires'] = '0'
    return res

@app.route('/vtt/edit')
def modify_vtt_file():
    cue_id = request.args.get('cue_id')
    action = request.args.get('action')
    params = request.args.get('params')
    edit_val = request.args.get('edit_val')
    modify_vtt_from_parms(cue_id, action, params, edit_val)
    return {"result": 'true'}


def generate_vtt_lines(idx, cap):
    z_line = f"{idx}\n"
    one_line = f"{cap['start']} --> {cap['end']} position:{cap['x']}% line:{cap['y']}% align:left\n"
    two_line = f"{cap['text']}\n"
    return z_line, one_line, two_line



def modify_vtt_from_parms(cue_id, action, params, edit_value):

    parse_int_from_pos = lambda x: int(x.split(':')[-1].replace('%',''))

    with open('vtt_final/gen_06_edit.vtt', 'r') as f:
        s=f.readlines()
    target_index = s.index(f'{cue_id}\n')
    
    if action == "DELETE":
        del s[target_index-1:target_index+3]
    else:        
        target_cue = s[target_index:target_index+3]
        start_time, _, end_time, position, line, _= target_cue[1].split()

        target_dict = {
            "x": parse_int_from_pos(position),
            "y": parse_int_from_pos(line),
            "start": start_time,
            "end": end_time,
            "text": target_cue[2].strip()
        }
        target_dict[params] = edit_value
        s[target_index:target_index+3] =generate_vtt_lines(cue_id, target_dict)
    
    with open('vtt_final/gen_06_edit.vtt', 'w') as f:
        f.writelines(s)
        print("DONE!", len(s))
    return True








if __name__ == "__main__":
    # print(os.environ.get('NCP_API_KEY_ID'))
    app.run(host='0.0.0.0', debug=True)