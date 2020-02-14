from moviepy.editor import VideoFileClip, concatenate
from parse import compile
import datetime
from datetime import timedelta
from datetime import time
import re
import os



def chech_mecsc(time_str):
    t = re.compile(r"\d+[:]+\d+[:]+\d+[.]+([0-9]+)")
    tmp_t = t.search(time_str)
    error_ms = tmp_t.group(1)

    if len(error_ms) > 4:
        # print('error!')
        # print('1st time_str', time_str, type(time_str))
        change_error = error_ms[:3]
        # print('change_error', change_error)
        # print('error_ms', error_ms)
        p = re.compile(error_ms)
        change_time = p.sub(change_error, time_str)
        # print('change_time',change_time)
    else:
        change_time = time_str

    return change_time

# 등장한 프레임만 추출한다.
# 등장한 프레임만 추출한다.
def appearance_timedata (timedata):
    # 1 등장한 프레임만 찾는다.
    # input : single list
    alltheframe = []

    for i in timedata:
        if i[1] == 1:
            timenow = i[0]
            change_time = chech_mecsc(timenow)
            [change_time, 1]
            alltheframe.append([change_time, 1])

    return alltheframe

def band_time(alltheframe):
    # 2 등장 시간을 묶는다.
    # output : [[],[],...]
    whole_time = []
    show_time = []

    show_time.append(alltheframe[0][0])

    for i in range(1, len(alltheframe)):
        pick_time = datetime.datetime.strptime(alltheframe[i][0], "%H:%M:%S.%f")
        pick_time_1 = datetime.datetime.strptime(alltheframe[i - 1][0], "%H:%M:%S.%f")

        if pick_time.second == 0 and pick_time.minute == 0:
            pick_time.second = 1

        if (pick_time - pick_time_1) < datetime.timedelta(seconds=2.5):
            show_time.append(alltheframe[i][0])

            if i == len(alltheframe) - 1:
                show_time.append(alltheframe[i][0])
                whole_time.append(show_time)

        else:
            if i == len(alltheframe) - 1:
                whole_time.append(show_time)
                show_time = []
                show_time.append(alltheframe[i][0])

            whole_time.append(show_time)
            show_time = []
            show_time.append(alltheframe[i][0])

    return whole_time

def merge_time(_show):
    # 가까운 타임셋을 병합한다.
    # _show = [[st,et],[st,et],...]
    mergeall = []
    mergetime = ['s', 'e']
    start_point = 0
    end_point = 0

    for idx in range(len(_show)):
        if idx == 0 :
            mergetime[0] = _show[idx][0]

        elif idx == len(_show)-1 :
            mergetime[1] = _show[idx][1]
            mergeall.append(mergetime)

        else:
            n_list = _show[idx]
            pre_list = _show[idx-1]
            end_point = pre_list[1]
            mergetime[1] = end_point

            if datetime.datetime.strptime(n_list[0], "%H:%M:%S.%f") - datetime.datetime.strptime(pre_list[1], "%H:%M:%S.%f") > datetime.timedelta(seconds=1.5) :
                mergeall.append(mergetime)
                mergetime = [n_list[0],'e']

            else:
                end_point = n_list[1]
                mergetime[1] = end_point

    return mergeall

def extract_timedata(timedata):
    people_list = ['jennie','jisoo','lisa','rose']
    appearance_timeset_result = []
    appearance_timeset = []

    for idx, appearance_frame in enumerate(timedata):
        # print('='*18, people_list[idx])
        appearance_time = []
        extend_time = []

        # 1 등장한 프레임만 찾는다. (시간, 1)
        alltheframe = appearance_timedata(appearance_frame)
        # print('alltheframe',alltheframe)

        #2 등장 시간을 묶는다.
        whole_time = band_time(alltheframe)
        # print(len(alltheframe))
        # print('main whole_time',whole_time)

        appearance_timeset.append(whole_time)
        # print('main appearance_timeset',appearance_timeset)

        for idx, _timeset in enumerate(whole_time):
            st = _timeset[0]; et = _timeset[-1];
            st_tmp = datetime.datetime.strptime(st, "%H:%M:%S.%f")
            et_tmp = datetime.datetime.strptime(et, "%H:%M:%S.%f")

            if len(whole_time) == 1:
                pass

            elif idx == 0:
                et = et_tmp + datetime.timedelta(seconds=1)
                et = et.strftime("%H:%M:%S.%f")

            elif idx == len(whole_time)-1:
                st = st_tmp - datetime.timedelta(seconds=1)
                st = st.strftime("%H:%M:%S.%f")

            else:

                st = st_tmp - datetime.timedelta(seconds=1)
                st = st.strftime("%H:%M:%S.%f")
                et = et_tmp + datetime.timedelta(seconds=1)
                et = et.strftime("%H:%M:%S.%f")

            appearance_time.append([st, et])
        mergetime = merge_time(appearance_time)

        appearance_timeset_result.append(mergetime)

    return appearance_timeset_result
