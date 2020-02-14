import os
import json
import glob

TOTAL_FRAME = 30

def loads_json_from_file(path):
    """
    Json Load용 util 함수
    """
    with open(path,'r') as f:
        result_js = json.loads(f.read())
    return result_js

def get_lines_from_json(result_js):
    """
    Json에서 각 라인별 데이터 취합
    """
    lines = {}
    for word in result_js['words']:
#         print(f"g: {word['group']} / lg: {word['lineGroup']} / text: {word['text']}")
        if not lines.get(word['lineGroup']):
            lines[word['lineGroup']] = [word]
            continue
        lines[word['lineGroup']].append(word)
    return lines

xy_to_per = lambda x: (round(x[0],2),round(x[1],2))

def merge_lines_bbox(flines, index):
    """
    각 라인별 단어에서 BBOX X,y좌표 및 텍스트 데이터 병합
    """
    word_in_frame_bbox = {}
    for k in flines.keys():
        bbox = [
            flines[k][0]['boundingBox'][0], # Left-Top
            flines[k][-1]['boundingBox'][1], # Right-Top
            flines[k][-1]['boundingBox'][2], # Right-Bottom
            flines[k][0]['boundingBox'][3], # Left-Bottom
        ]
        text = ' '.join([word['text'] for word in flines[k]])
        word_in_frame_bbox[xy_to_per(tuple(bbox[0]))] = {"bbox": bbox, "text":text, 'tidx': index}
    return word_in_frame_bbox

def generate_vtt_lines(idx, cap):
    """
    캡션당 VTT 자막 생성함수
    """
    z_line = f"{idx}\n"
    one_line = f"{cap['start']} --> {cap['end']} position:{cap['x']}% line:{cap['y']}% align:left\n"
    two_line = f"{cap['text']}\n"
    return z_line, one_line, two_line
    

def write_vtt_from_captions(captions, filename):
    """
    webVTT 자막 생성 함수
    """
    with open(filename,'w') as f:
        f.write('WEBVTT\n')
        for idx, cap in enumerate(captions):
            z_line, one_line, two_line = generate_vtt_lines(idx+1, cap)
            f.write('\n'+z_line)
            f.write(one_line)
            f.write(two_line)


get_ms_by_frame = lambda current_frame, total_frame: int(round_3(current_frame/total_frame)*1000)
round_3 = lambda x: round(x,3)
assert round_3(get_ms_by_frame(28,30) - get_ms_by_frame(21,30)) == 233

sec_ms_to_time = lambda sec, ms: f"00:{sec//60:02d}:{sec%60:02d}.{ms:03d}"
assert sec_ms_to_time(3520,233) == '00:58:40.233'

def index_to_sec_ms(filename, total_frame):
    filename = filename.split('.')[0]
    sec = int(filename.split('_')[1])
    ms = get_ms_by_frame(int(filename.split('_')[2]),total_frame)
    return (sec, ms)


def check_duplicate(result_lines, xy_key, i):
    if i != 0 and not result_lines[i-1].get(xy_key) and result_lines[i-1][xy_key]['text'].strip() == result_lines[i][xy_key]['text'].strip():
        return True
    return False

def genarte_caption_from_line(from_sec, from_ms, to_sec, to_ms, text, xy_key):
    return {
        "x": int(xy_key[0]*100),
        "y": int(xy_key[1]*100),
        "start": sec_ms_to_time(from_sec, from_ms),
        "end": sec_ms_to_time(to_sec, to_ms),
        "text": text
    }



if __name__ == '__main__':
    frame_jsons = glob.glob('auto-subtitle-generator/infer/*') # frame 정보 불러오기
    frame_jsons.sort() # frame 시간 순대로 정렬
    get_filename = lambda x: os.path.basename(x) # filename 추출 함수 생성
    results_index2 = [get_filename(path) for path in frame_jsons] # 파일명 배열 생성
    results = [loads_json_from_file(path) for path in frame_jsons] # file -> Dictionary Array
    # 각 frame에서 줄단위로 단어들 병합
    result_lines = [merge_lines_bbox(get_lines_from_json(res), i) for i, res in enumerate(results)]
    # 파일명 -> 초, 밀리초 인덱스 생성
    secms_index = [index_to_sec_ms(index_name, TOTAL_FRAME) for index_name in results_index2]
    # 최종 결과 저장용 배열 생성
    caption_arr = []
    buffer_captions = result_lines[0] #버퍼용 배열
    result_lines.append({}) 
    secms_index.append((5,0)) # 종료를 위한 끝 시간 추가

    assert len(secms_index) == len(result_lines)

    # Frame별 자막 데이터를 위치 중복에 따라 병합하여 자막 메타 정보 생성
    for i in range(1, len(secms_index)):
        sec, ms = secms_index[i]
        for xy_key in list(buffer_captions):
            if result_lines[i].get(xy_key) and buffer_captions[xy_key]['text'].strip() == result_lines[i][xy_key]['text'].strip():
                # Buffer에 있는게 다음 프레임에 이미 해당 자막이 존재하는 경우
                del result_lines[i][xy_key]
                continue
            # Buffer 중 다음 프레임에서 사라진 것들 -> caption 화 필요
            f_sec, f_ms = secms_index[buffer_captions[xy_key]['tidx']]
            caption = genarte_caption_from_line(f_sec, f_ms, sec, ms, buffer_captions[xy_key]['text'], xy_key)
            caption_arr.append(caption)
            del buffer_captions[xy_key]
        for key, val in result_lines[i].items():
            buffer_captions[key] = val

    # 자막 파일 생성
    write_vtt_from_captions(caption_arr, 'gen_07.vtt')