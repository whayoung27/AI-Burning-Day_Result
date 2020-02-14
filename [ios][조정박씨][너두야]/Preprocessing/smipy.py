import re
import os
import codecs
import codecs
import pandas as pd
import prepare

SMI_PADDING = 60000

CSV_ENCODING = 'cp949'

class Smi:
    def __init__(self, filepath = None, **kwargs):
        self.eng_signal = None
        self.kor_signal = None
        self.raw_text = ''
        self.subtitles = []#dict(start=timestamp, end=None, kor='', eng=text)
        self._korsub = []
        self._engsub = []
        self.sinc_verification = False


        if filepath is not None:
            self.load(filepath = filepath, **kwargs)

    def load(self, filepath, eng_signal = None, kor_signal = None, encoding = None, debug = False):
        ####    Loading raw text
        if encoding:
            try:
                file = codecs.open(filepath, encoding=encoding)
                self.raw_text = file.read()
                file.close()
            except:
                raise SamitizeError(-2)
        else:
            try:
                file = codecs.open(filepath, encoding='EUC-KR')
                self.raw_text = file.read()
                file.close()
            except:
                try:
                    file = codecs.open(filepath, encoding='cp949')
                    self.raw_text = file.read()
                    file.close()
                except:
                    try:
                        file = codecs.open(filepath, encoding='UTF-8')
                        self.raw_text = file.read()
                        file.close()
                    except:
                        try:
                            file = codecs.open(filepath, encoding='ansi')
                            self.raw_text = file.read()
                            file.close()
                        except:
                            raise SamitizeError(-2)
        self.raw_text = self.raw_text.replace('\r\n', '\n')
        self.raw_text = self.raw_text.replace('\n\r', '\n')

        # Detecting signal for sinc verification
        #주석 <!--~-->
        re_comment = re.compile('<!--\n+(.+)\n+-->')
        re_sinc = re.compile('sinc =(.+)',flags=re.IGNORECASE)
        cms = re_comment.findall(self.raw_text)
        if cms is not None:
            for cm in cms:
                sinclst = re_sinc.findall(cm)
                if len(sinclst) >0 and 'true' in sinclst[0].lower():
                    self.sinc_verification = True

        # Detect Korean / English key
        # 한 키가 None이면 해당 자막은 없다고 보면 됨
        re_sig = re.compile('Class=(.*)>',flags=re.IGNORECASE)
        signals = set(re_sig.findall(self.raw_text))
        for sig in signals:
            if eng_signal is None:
                if 'english' in sig.lower():
                    self.eng_signal = sig
                elif 'en' in sig.lower():
                    self.eng_signal = sig
            if kor_signal is None:
                if 'korean' in sig.lower():
                    self.kor_signal = sig

                elif 'kr' in sig.lower():
                    self.kor_signal = sig
        tokenized_list = []
        buf = []
        re_line = re.compile('<SYNC Start=[0-9]+><P Class=\w+>.*',flags=re.IGNORECASE)

        start = False

        for line in self.raw_text.split('\n'):
            if re_line.match(line):
                start = True
                if len(buf) >0:
                    tokenized_list.append(' '.join(buf))
                    buf = []
                tokenized_list.append(line)
            else:
                if start:
                    buf.append(line)

        newtext = '\n'.join(tokenized_list)

        re_line2 = re.compile('<SYNC Start=([0-9]+)><P Class=(\w+)>\n?(.*)\n',flags=re.IGNORECASE)

        #패턴 : <SYNC Start=(1258654)><P Class=EnglishSC> 하고 (문자1이상) + \n<, greedy compile
        lines = re_line2.findall(newtext)

        if debug == True:
            re_line2 = re.compile('<SYNC Start=[0-9]+><P Class=\w+>\n?.*\n',flags=re.IGNORECASE)
            lines2 = re_line2.findall(self.raw_text)
            print(''.join(lines2[:50]))

        #한글 영어 따로해서 합치자
        eng_buffer = None
        kor_buffer = None
        for line in lines:

            timestamp, channel, text = line
            timestamp = int(timestamp)

            if channel == self.eng_signal:
                if eng_buffer is None:
                    if not 'nbsp' in text:
                        text = prepare.to_sentence(text)
                        eng_buffer = dict(start=timestamp, end=None, kor='', eng=text)
                else:
                    eng_buffer['end'] = timestamp
                    self._engsub.append(eng_buffer)
                    if 'nbsp' in text:
                        eng_buffer = None
                    else:
                        text = prepare.to_sentence(text)
                        eng_buffer = dict(start=timestamp, end=None, kor='', eng=text)

            if channel == self.kor_signal:
                if kor_buffer is None:
                    if not 'nbsp' in text:
                        text = prepare.to_sentence(text)
                        kor_buffer = dict(start=timestamp, end=None, kor=text, eng='')
                else:
                    kor_buffer['end'] = timestamp
                    self._korsub.append(kor_buffer)
                    if 'nbsp' in text:
                        kor_buffer = None
                    else:
                        text = prepare.to_sentence(text)
                        kor_buffer = dict(start=timestamp, end=None, kor=text, eng='')
        #끝날때는
        if len(self._korsub) >0:
            self._korsub[-1]['end'] = self._korsub[-1]['start'] + SMI_PADDING
        if len(self._engsub) >0:
            self._engsub[-1]['end'] = self._engsub[-1]['start'] + SMI_PADDING

        #두 채널 합치기
        if len(self._engsub) ==0:
            for s in self._korsub:
                self.subtitles.append(s)

        it_kor = iter(self._korsub)
        i_k = 0
        korlen = len(self._korsub)
        for engsub in self._engsub:
            #한글자막 끝났으면 영어자막만 추가
            if i_k == korlen:
                self.subtitles.append(engsub)
            #뒤지는 한글자막은 다 추가
            else:
                while i_k < korlen and self._korsub[i_k]['start'] < engsub['start']:
                    self.subtitles.append(self._korsub[i_k])
                    i_k += 1
                    if i_k == korlen: break

                if i_k < korlen and engsub['start'] == self._korsub[i_k]['start']:
                    s = engsub.copy()
                    s['kor'] = self._korsub[i_k]['kor']
                    self.subtitles.append(s)
                    i_k +=1



    def to_csv(self, title, dest ='./', all = False, encoding ='cp949'):
        subdf = pd.DataFrame.from_dict(self.subtitles)
        sub_path = prepare.get_save_path(dest, title, format ='.csv')
        print('Saving to {}'.format(sub_path))
        subdf.to_csv(sub_path, encoding=encoding)
        if all:
            kordf = pd.DataFrame.from_dict(self._korsub)
            kor_path = prepare.get_save_path(dest, title + '_k', format='.csv')
            print('Saving to {}'.format(kor_path))
            kordf.to_csv(kor_path, encoding=encoding)

            engdf = pd.DataFrame.from_dict(self._engsub)
            eng_path = prepare.get_save_path(dest, title + '_e', format='.csv')
            print('Saving to {}'.format(eng_path))
            engdf.to_csv(eng_path, encoding=encoding)

    def slice(self, start_time, end_time, slice_only = False):
        sent_list = []
        ind_list = []

        for ind, sent in enumerate(self.subtitles):
            if sent['start'] > start_time and sent['end'] < end_time:
                sent_list.append(sent)
                ind_list.append(ind)
        if slice_only:
            return sent_list
        else:
            return sent_list, ind_list


    def export(self, start_time = 0, end_time = 99999999, slice_manual = None):
        textlist = ['<SAMI>', '<BODY>']
        if slice_manual is not None:
            sentences = slice_manual
        else:
            sentences = [sent for sent in self.subtitles if sent['start'] >start_time and sent['end'] <end_time]

        return export_smi(sentences, start_time)

    def from_sentences(self, sentences):
        self.eng_signal = 'EnglishSC'
        self.kor_signal = 'KoreanSC'
        self.subtitles = sentences

        self.raw_text = export_smi(sentences)
        self._korsub = []
        self._engsub = []
        self.sinc_verification = False

##################################################################
# Class End
##################################################################

def encoding_edit(path, encoding = None):
    if encoding is None:
        text = open(path, 'r').read()
    else:
        text = open(path, 'r', encoding = encoding).read()
    open(path, 'w').write(text.encode('cp949', errors = 'replace').decode('cp949'))

def export_smi(sentences, start_time = 0):
    textlist = ['<SAMI>', '<BODY>']

    engsig_out = 'EnglishSC'
    korsig_out = 'KoreanSC'
    for sent in sentences:
        if len(sent['kor']) >= 1:
            textlist.append('<SYNC Start={}><P Class={}>\n{}'.format(
                sent['start'] - start_time, korsig_out, sent['kor']))

        if len(sent['eng']) >= 1:
            textlist.append('<SYNC Start={}><P Class={}>\n{}'.format(
                sent['start'] - start_time, engsig_out, sent['eng']))

        if len(sent['kor']) >= 1:
            textlist.append('<SYNC Start={}><P Class={}>{}'.format(
                sent['end'] - start_time, korsig_out, '&nbsp;'))

        if len(sent['eng']) >= 1:
            textlist.append('<SYNC Start={}><P Class={}>{}'.format(
                sent['end'] - start_time, engsig_out, '&nbsp;'))

    textlist.append('</BODY>')
    textlist.append('</SAMI>')
    return '\n'.join(textlist)

def sort_sentence(sentences):
    sentences = sorted(sentences, key = lambda x : x['start'])
    same_time_buffer = []
    results = []
    for s in sentences:
        if len(same_time_buffer) ==0:
            same_time_buffer.append(s)
        else: # list has some indices
            if same_time_buffer[-1]['start'] == s['start'] and same_time_buffer[-1]['end'] == s['end']:
                same_time_buffer.append(s)
            else:
                if len(same_time_buffer) ==1:
                    results.append(same_time_buffer[0])
                    same_time_buffer = []
                else:
                    #merge
                    res = dict(start=same_time_buffer[0]['start'],
                               end=same_time_buffer[0]['end'], kor='', eng='')
                    for sames in same_time_buffer:
                        if len(sames['kor']) >0 and sames['kor'] != 'nan':
                            res['kor'] += ' ' + sames['kor']
                        if len(sames['eng']) >0 and sames['eng'] != 'nan':
                            res['eng'] += ' ' + sames['eng']
                    res['kor'] = res['kor'].strip()
                    res['eng'] = res['eng'].strip()
                    results.append(res)
                    same_time_buffer = []

                same_time_buffer.append(s)
    results.extend(same_time_buffer)
    return results

def csv_to_sentences(path, encoding = CSV_ENCODING):
    #빈거 읽을때 char타입으로 있게 하기
    # 안전하게 가기

    df = pd.read_csv(path, encoding = encoding)
    listofdicts = []
    for row in df.iloc:
        d = dict(row)
        if d['eng'] == 'nan' or type(d['eng']) != type('text'): eng = ''
        else: eng = d['eng']

        if d['kor'] == 'nan' or type(d['kor'])!=  type('text') : kor = ''
        else: kor = d['kor']

        listofdicts.append(dict(start=int(d['start']), end=int(d['end']), kor='{}'.format(kor), eng='{}'.format(eng)))

    return listofdicts

class SamitizeError(Exception):

    messages = (
        "Cannot access to the input file.",
        "Cannot find correct encoding for the input file.",
        "Cannot parse the input file. It seems not to be a valid SAMI file.\n(Verbose option may show you the position the error occured in)",
        "Cannot convert into the specified format. (Suppored formats : vtt, plain)",
        "Unknown error occured."
    )

    def __init__(self, code):
        try:
            code = int(code)
            if code > -1 or code < -5:
                code = -5
        except:
            code = -5
        self.code = code
        self.message = self.messages[-(code + 1)]

    def __repr__(self):
        return "{} ({})".format(self.message, self.code)

    def __str__(self):
        return self.__repr__()

    def __unicode__(self):
        return self.__str__()
