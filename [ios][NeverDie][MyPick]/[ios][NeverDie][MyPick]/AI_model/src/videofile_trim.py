from moviepy.editor import VideoFileClip, concatenate
import os
import extract_time

def pick_people (mypick, timelist):
    # mypick! 멤버를 고른다.
    people_list = {0: 'jennie', 1: 'jisoo', 2: 'lisa', 3: 'rose'}
    pick = people_list[mypick]
    time_data1 = [timelist[pick]]

    return time_data1

def assemble_cuts(inputfile, cuts, outputfile):
    """ Concatenate cuts and generate a video file. """
    '''
    input :::
    inputfile (str) : 작업할 비디오 파일 dir.
    cuts (list) : 클립할 영상의 시작점과 끝점을 넣는다. [[시작점1, 끝점1],[시작점2,끝점2],...]
    outputfile (str) : 저장할 파일명

    return ::: 편집된 영상파일이 저장된다.
    (None) 
    '''
    video = VideoFileClip(inputfile)
    final = concatenate([video.subclip(start, end)
                         for (start, end) in cuts[0]])
    # 파일 저장 경로를 설정하고 싶으면 사용한다.
    # os.chdir('/home/pirl/PycharmProjects/NAVER_hack/save_video')
    final.to_videofile(outputfile)

    video.reader.close()
    video.audio.reader.close_proc()

# ##USAGE
# # 작업할 비디오 파일을 넣어준다.
# inputfile = "C:\\Users\\green\\PycharmProjects\\pj1\\test.mp4"


# 시작점과 끝 점을 pair로 리스트 형식으로 넣어준다.
# # which can be expressed in seconds (15.35), in (min, sec), in (hour, min, sec), or as a string: '01:03:05.35'.
# cuts = [['0:0:0.966','0:0:3.33'], ['0:0:5.100','0:0:9.233']]
#
# assemble_cuts(inputfile, cuts, "dog_1.mp4")

# mypick = input('who is your pick?: jennie/jisoo/lisa/rose')
# cut_time = pick_people (mypick, time_data)
# cut = extract_time.extract_timedata(cut_time)
#
# #영상 자르기
# assemble_cuts(inputfile, cut, "mypick_2.mp4")
