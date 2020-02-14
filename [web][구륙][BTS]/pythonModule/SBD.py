import os
import sys
import json
import urllib.request
import configparser

from youtube_transcript_api import YouTubeTranscriptApi as YTA

from deepsegment import DeepSegment


class SBD:

        scr_word_time = []
        ind = 0
        
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

        # ?†ÌäúÎ∏åÏóê???êÎßâ, ?úÍ∞Ñ ?ïÎ≥¥ Í∞Ä?∏Ïò§Í∏?        def get_subtitle_info(self):
                try:
                        transcript_list = YTA.get_transcript(self.video_id, languages = self.LANGUAGE_LIST)

                        if self.DEBUG_MODE:
                                for subtitle in transcript_list:
                                        print(subtitle)
                        return transcript_list
                except Exception as e:
                           print('?êÎßâ???ÜÏäµ?àÎã§')

        def window_segment(self, strings):
                segmenter = DeepSegment('en')
                sentences = segmenter.segment_long(strings)

                return sentences


        # ?ÖÎ†•: ?úÏ§ÑÎ°úÎêú ?êÎßâ ?çÏä§??        # Ï∂úÎ†•: segmentation??Î¨∏Ïû•??Î¶¨Ïä§???ïÌÉú)
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

        def block_process(self, block_path, filename, strings, script):
                idx = 0
                segmented = []
                remain_string = strings.split(' ')
                start_ind = 0; end_ind = -1; past_start_ind = 0; thr = 0;
                remain_len = len(remain_string)
                is_last_block = 1
                word_num = 70
                temp_segment_block = []
                save_filename = filename
                block_path = block_path + self.video_id + "/"

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
                                temp_segment_block.append(segmented_block[i])
                        
                        sentence_time = self.block_match_sentence_to_time(temp_segment_block, script)
                        save_filename = str(idx) + filename
                        self.save_block_text(block_path, save_filename, sentence_time)
                        print("idx:{}".format(idx))
                        idx += 1
                        temp_segment_block = []
                        
                return segmented
        
        def preprocess_sentence_time(self, script):
                for scr in script:
                        now_time = scr['start']
                        script_split = scr['text'].split(' ')
                        
                        for scr_spl in script_split:
                                 SBD.scr_word_time.append([now_time, scr_spl])


        # ?ÖÎ†•: segmentation??Î¨∏Ïû•??Î¶¨Ïä§???ïÌÉú), ?úÍ∞Ñ ?ïÎ≥¥ script
        def block_match_sentence_to_time(self, sentence, script):
                last_use_time = -1;
                sen_time = []
                # print("len sentences: {}".format(sum([len(sen.split(' ')) for sen in sentence])))
                # print("len script: {}".format(sum([len(sc['text'].split(' ')) for sc in script])))
                # print(sentence)
                for sen in sentence:
                        sen_len = len(sen.split(' '))
                        # print("sen_len:{}".format(sen_len))
                        # print("ind:{}".format(SBD.ind))
                        # print("scr_word_time:{}".format(len(SBD.scr_word_time)))
                        # print("sen:{}".format(', '.join(sen.split(' '))))
                        # print("sen_scr_word_time:", end=': ')
                        # print(SBD.scr_word_time[SBD.ind:(SBD.ind+sen_len)]) 
                        # print("ind:{}".format(SBD.ind))
                        scr_word_start = SBD.scr_word_time[SBD.ind][0]
                        #print("ind:{}".format(SBD.ind))
                        #print("scr_word_time:{}".format(len(SBD.scr_word_time)))
                        if scr_word_start == last_use_time:
                                next_time = scr_word_start

                                for i in range(SBD.ind, SBD.ind+sen_len):
                                        if next_time != SBD.scr_word_time[i][0]:
                                                next_time = SBD.scr_word_time[i][0]
                                                break;
    
                                SBD.ind += sen_len
                                sen_time.append([next_time, sen])
                                last_use_time = next_time
                        else:
                                sen_time.append([scr_word_start, sen])
                                SBD.ind += sen_len
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

        def save_block_text(self, path, filename, infos):
               with open(path+filename, 'w') as wf:
                       block = ' '.join([info[1] + "." for info in infos])
                       tl_text = self.translate_NMT(block)
                       sens = tl_text.split('.')
                       for info, sen in zip(infos, sens):
                               wf.write(str(info[0]) + ":" + sen + "\n")



        def save_final_text(self, filename, new_filename, infos):
                with open(filename, 'w') as wf:
                        for info in infos:
                                tl_text = self.translate_NMT(info[1])
                                wf.write(str(info[0]) + ":" + tl_text + "\n")

                os.rename(filename, new_filename)

def config_parser():
        with open('./config/config.json', 'r') as cr:
                config = json.load(cr)
        return config


def main():
        # ?åÎùºÎØ∏ÌÑ∞ ?§Ï†ï
        model_param = "./pretrained/deeppunct_params_en"
        checkpoint = "./pretrained/deeppunct_checkpoint_google_news"
        config = config_parser()
        client_id = config['NMT']['client_id']
        client_secret = config['NMT']['client_secret']
        
        video_id = sys.argv[1]
        block_path = "/home/node/BTS_NAVERAIBURNINGDAY/pythonModule/subtitle/"
        block_filename = "_" + video_id+".txt"
        
        # ?êÎßâ ?åÏùº ?ùÏÑ± ?ÑÎ°ú?∏Ïä§ ?§Ìñâ
        test_sbd = SBD(video_id, client_id, client_secret, model_param, checkpoint)
        infos = test_sbd.get_subtitle_info()
        text = ' '.join([info['text'] for info in infos])
        test_sbd.preprocess_sentence_time(infos)
        if not os.path.exists(block_path + video_id + "/"):
                os.mkdir(block_path + video_id + "/")
        test_sbd.block_process(block_path, block_filename, text, infos)
         


if __name__ == "__main__":
        main()
