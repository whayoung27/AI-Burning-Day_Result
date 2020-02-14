from youtube_transcript_api import YouTubeTranscriptApi as YTA
import sys
import os
import urllib.request

class Youtube():
    
    def __init__(self, video_id, file_name, LANGUAGE_LIST=['en'], DEBUG_MODE=True):
        self.video_id = video_id
        self.file_name = file_name
        self.DEBUG_MODE = DEBUG_MODE
        self.LANGUAGE_LIST = LANGUAGE_LIST
        print(video_id)
        print(type(video_id))
    # 
    def ATL(self):
        atl = YTA.list_transcripts(self.video_id)
        ret = None
    
        if DEBUG_MODE:
            try:
                ret = atl.find_manually_created_transcript(self.LANGUAGE_LIST)
            except Exception as e:
                ret = atl.find_generated_transcript(self.LANGUAGE_LIST)

        return ret
    # 유튜브 자막 가져오기 
    def TL(self):
        try:
            transcript_list = YTA.get_transcript(self.video_id, languages=self.LANGUAGE_LIST)
            
            if self.DEBUG_MODE:
                for subtitle in transcript_list:
                    print(subtitle)
            return ' '.join(transcript_list)
    
        except Exception as e:
            print('자막이 없음.')
   
    def RDF(self):#Read Dummy File
        f = open(self.file_name, 'r')
        segment_script=[]
        while True:
            line = f.readline()
            if not line: break
            if self.DEBUG_MODE:
                print(line)
            segment_script.append(line)
        f.close()
    
        return segment_script

# 문장이랑 시간 매칭
def FST2(sentence, script):
    last_use_time = -1;
    sen_time = []
    scr_word_time = []
    
    for scr in script:
        now_time = scr['start']
        script_split = scr['text'].split(' ')
    
        for scr_spl in script_split:
            scr_word_time.append([now_time, scr_spl])
        
    ind = 0
    
    for sen in sentence:
        sen_len = len(sen.split(' '))
        scr_word_start = scr_word_time[ind][0]
            
        if scr_word_start == last_use_time:
            next_time = scr_word_start
                
            for i in range(ind, ind+sen_len):
                if next_time != scr_word_time[i][0]:
                    next_time = scr_word_time[i][0]
                    break;
    
            ind += sen_len
            sen_time.append([next_time, sen])
            last_use_time = next_time
        else :
            sen_time.append([scr_word_start, sen])
            ind += sen_len
            last_use_time = scr_word_start
    
    return sen_time

if __name__ == '__main__':
    video_id = sys.argv[1]
    dummyFile = sys.argv[2]

    file_sub = open('subtitle', 'a')

    youtube = Youtube(video_id, dummyFile)

#    atl = youtube.ATL()
#    print(atl)

    tl = youtube.TL()
    print(tl)
    
    rdf = youtube.RDF()

    for sub in tl:
        print(sub['text'], end=' ')

    print('\n')
    fst = FST2(rdf, tl)

    for f in fst:
        file_sub.write(str(f[0])+', '+str(f[1])+'\n')
    file_sub.close()
