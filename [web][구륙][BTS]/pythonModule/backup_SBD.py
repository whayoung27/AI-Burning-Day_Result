import os
import sys
import json
import urllib.request

from youtube_transcript_api import YouTubeTranscriptApi as YTA

from deepsegment import DeepSegment


class SBD:
        def __init__(self, video_id, client_id, client_secret, model_params, checkpoint, DEBUG_MODE=False, LANGUAGE_LIST=['en']):
                self.video_id = video_id
                self.client_id = client_id
                self.client_secret = client_secret
                self.model_params = model_params
                self.checkpoint = checkpoint
                self.DEBUG_MODE=DEBUG_MODE
                self.LANGUAGE_LIST=LANGUAGE_LIST

        def extract_translatedText(self, response):
                data = json.loads(response)
                translatedText = data['message']['result']['translatedText']
                return translatedText

        # 유튜브에서 자막, 시간 정보 가져오기
        def get_subtitle_info(self):
                try:
                        transcript_list = YTA.get_transcript(self.video_id, languages = self.LANGUAGE_LIST)

                        if self.DEBUG_MODE:
                                for subtitle in transcript_list:
                                	print(subtitle)
                        print(transcript_list)
                        return transcript_list
                except Exception as e:
                           print('자막이 없습니다')

        def window_segment(self, strings):
                segmenter = DeepSegment('en')
                sentences = segmenter.segment_long(strings)

                return sentences


        # 입력: 한줄로된 자막 텍스트
        # 출력: segmentation된 문장들(리스트 형태)
        def texts_segmentation(self, strings):
                segmented = []
                sdone = False
                remain_string = strings.split(' ')
                start_ind = 0; end_ind = -1; past_start_ind = 0; thr = 0;
                remain_len = len(remain_string)
                is_last_block = 1
                word_num = 70

                while start_ind < remain_len:
                        if (start_ind == past_start_ind):
                                thr += 30            
                        else:
                                thr = 0

                        past_start_ind = start_ind
                        end_ind = start_ind + word_num + thr
        
                        if end_ind > remain_len:
                                end_ind = remain_len
                                is_last_block = 0
                                thr = 0

                        one_block = ' '.join(remain_string[start_ind:end_ind+1])
                        segmented_block = self.window_segment(one_block)
                        seg_block_len = len(segmented_block)

                        for i in range(seg_block_len-is_last_block):
                                start_ind += len(segmented_block[i].split(' '))
                                segmented.append(segmented_block[i])
    
                return segmented

        # 입력: segmentation된 문장들(리스트 형태), 시간 정보 script
        def match_sentence_to_time(self, sentence, script):
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
                        else:
                                sen_time.append([scr_word_start, sen])
                                ind += sen_len
                                last_use_time = scr_word_start
                return sen_time

        def translate_NMT(self, input_text):
                encText = urllib.parse.quote(input_text)
                data = "source=en&target=ko&text=" + encText
                url = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation"
                request = urllib.request.Request(url)
                request.add_header("X-NCP-APIGW-API-KEY-ID", self.client_id)
                request.add_header("X-NCP-APIGW-API-KEY", self.client_secret)
                response = urllib.request.urlopen(request, data=data.encode("utf-8"))

                rescode = response.getcode()
                if rescode == 200:
                        response_body = response.read()
                        response = response_body.decode("utf-8")
                        #print(response_body.decode("utf-8"))
                        translatedText = self.extract_translatedText(response)
                        # print(translatedText)
                        return translatedText
                else:
                        print("Error Code: " + rescode)
                        return '0'

        def save_final_text(self, filename, new_filename, infos):
                with open(filename, 'w') as wf:
                        for info in infos:
                                tl_text = self.translate_NMT(info[1])
                                wf.write(str(info[0]) + ":" + tl_text + "\n")

                os.rename(filename, new_filename)


def main():
        # 1: 유튜브 자막 가져오기ㅑ
        model_param = "./pretrained/deeppunct_params_en"
        checkpoint = "./pretrained/deeppunct_checkpoint_google_news"
        client_id = "mi91095qps"
        client_secret = "YgL7jawCVTaCasBy1rW7kKtzZYDdUhqGFvtr3EES"
        
        video_id = sys.argv[1]
        path = "./subtitle/"
        init_filename = video_id
        temp_filename = path + "temp_" + init_filename + ".txt" 
        new_filename = path + init_filename + ".txt"
        sbd = SBD(video_id, client_id, client_secret, model_param, checkpoint)

        infos = sbd.get_subtitle_info()
        text = ' '.join([info['text'] for info in infos])
        sentences = sbd.texts_segmentation(text)

        results = sbd.match_sentence_to_time(sentences, infos)
        sbd.save_final_text(temp_filename, new_filename, results)


if __name__ == "__main__":
        main()

