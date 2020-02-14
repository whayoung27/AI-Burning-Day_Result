# -*- coding: utf-8 -*-
from konlpy.tag import Kkma
from konlpy.tag import Okt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import normalize
import numpy as np
import re
import pandas as pd
import sys

def f(x):
    return x[1]

class SentenceTokenizer(object):
    def __init__(self):
        self.kkma = Kkma()
        self.okt = Okt()
        self.stopwords = [':', '네', '아니요', '잠깐', '안녕', '당신', '항상', '예', '진호', '태형']
        self.hour = re.compile('\d+[ ]*시')
        self.minute = re.compile('\d+[ ]*분')
        self.day = re.compile('[월화수목금토일][ ]*요일')
        self.location = re.compile('\S*[ ]*\S*에서')
        self.week = re.compile('\S\s*째\s*주')

    def txt2sentences(self, text):
        # input : text(str)
        # output : sentences(문장단위로 나뉨)
        sentences = self.kkma.sentences(text)
        for idx in range(0, len(sentences)):
            if len(sentences[idx]) <= 8:    # 문장의 최소 길이 보다 작으면 앞 문장이랑 합친다.
                sentences[idx-1] += (' ' + sentences[idx])
                sentences[idx] = ''

        return sentences

    def get_nouns(self, sentences):
        # input : sentences
        # output : nouns(문장을 명사로 나눔)
        nouns = []
        for sentence in sentences:
            if sentence is not '':
                nouns.append(' '.join([noun for noun in self.okt.nouns(str(sentence))
                                        if noun not in self.stopwords and len(noun) > 1]))
        return nouns

    def find_schedule(self, sentences):
        # input : sentences
        # output :
        for sentence in sentences:
            if sentence is not '':
                h = self.hour.search(sentence)
                m = self.minute.search(sentence)
                d = self.day.search(sentence)
                l = self.location.search(sentence)
                w = self.week.search(sentence)
                if w:
                    print('_w', w.group())
                if d:
                    print('_d',d.group())
                if h:
                    print('_h',h.group())
                if m:
                    print('_m',m.group())
                if l:
                    print('_p',l.group().rstrip('에서'))
        return


class GraphMatrix(object):
    def __init__(self):
        self.tfidf = TfidfVectorizer()
        self.cnt_vec = CountVectorizer()
        self.graph_sentence = []

    def build_sentence_graph(self, nouns):
        transformed_nouns = self.tfidf.fit_transform(nouns)
        tfidf_mat = transformed_nouns.toarray() # 단어에 가중치 부여된 메트릭스
        self.graph_sentence = np.dot(tfidf_mat, tfidf_mat.T)
        return self.graph_sentence

    def build_words_graph(self, sentence):
        cnt_vec_mat = normalize(self.cnt_vec.fit_transform(sentence).toarray().astype(float), axis=0)
        vocab = self.cnt_vec.vocabulary_
        return np.dot(cnt_vec_mat.T, cnt_vec_mat), {vocab[word] : word for word in vocab}

class Rank(object):
    def get_ranks(self, graph, d=0.85): # d = dampling factor
        A = graph
        matrix_size = A.shape[0]
        for id in range(matrix_size):
            A[id, id] = 0
            link_sum = np.sum(A[:, id])
            if link_sum != 0:
                A[:,id] /= link_sum
            A[:,id] *= -d
            A[id,id] = 1

        B = (1-d) * np.ones((matrix_size, 1))
        ranks = np.linalg.solve(A,B)
        return {idx: r[0] for idx, r in enumerate(ranks)}

class TextRank(object):
    def __init__(self, text, customs):
        self.text = text
        self.customs = customs
        self.sent_tokenize = SentenceTokenizer()

        self.sentences = self.sent_tokenize.txt2sentences(self.text)     # 문장 추출
        self.nouns = self.sent_tokenize.get_nouns(self.sentences)   # 명사 추출
        self.sent_tokenize.find_schedule(self.sentences)            # 시간, 장소 추출

        self.graph_matrix = GraphMatrix()
        self.sent_graph = self.graph_matrix.build_sentence_graph(self.nouns)
        self.words_graph, self.idx2word = self.graph_matrix.build_words_graph(self.nouns)

        self.rank = Rank()
        self.sent_rank_idx = self.rank.get_ranks(self.sent_graph)
        self.sorted_sent_rank_idx = sorted(self.sent_rank_idx, key=lambda k: self.sent_rank_idx[k], reverse=True)

        self.word_rank_idx = self.rank.get_ranks(self.words_graph)
        self.sorted_word_rank_idx = sorted(self.word_rank_idx, key=lambda k: self.word_rank_idx[k], reverse=True)

    def keysentences(self, sent_num=3):
        key_sentences = []
        custom_key_sentences = []
        index = []
        custom_idx = []

        # find custom keywords
        for idx in self.sorted_sent_rank_idx:
            for custom in self.customs:
                if custom in self.sentences[idx]:
                    #self.sentences[idx] = self.sentences[idx].replace(custom,'<b>' + custom + '</b>')
                    if idx not in custom_idx:
                        custom_idx.append(idx)


        i = 0
        while len(index) < sent_num and i < len(self.sorted_sent_rank_idx):
            idx = self.sorted_sent_rank_idx[i]
            if self.sentences[idx] != '':
                index.append(idx)
            i += 1

        for rank, time in enumerate(index):
            self.sentences[time] = str(rank) + '_' + self.sentences[time]

        index.sort()
        custom_idx.sort()

        for idx in index:
            key_sentences.append(self.sentences[idx])

        # rank_ 제거
        for idx in custom_idx:
            if '_' in self.sentences[idx]:
                d = re.compile('\d+_')
                self.sentences[idx] = self.sentences[idx].replace(d.search(self.sentences[idx]).group(), '')
            custom_key_sentences.append(self.sentences[idx])

        return key_sentences, custom_key_sentences

    def keywords(self, word_num = 9):
        rank = Rank()
        rank_idx = rank.get_ranks(self.words_graph)
        sorted_rank_idx = sorted(rank_idx, key=lambda k: rank_idx[k], reverse=True)
        keywords = []
        index = []
        for idx in sorted_rank_idx[:word_num]:
            index.append(idx)
        for idx in index:
            keywords.append(self.idx2word[idx])
        return keywords

def keywords_in_text(text, customs):
    for custom in customs:
        text = text.replace(custom, '<b>' + custom + '</b>')
    return text

#text = "약국 몇시에 여시나요 어제부터입니다 방역 마스크 있나요 네 있습니다 박카스 한 박스 얼마인가요 8000원입니다 삼성 페이로 결제 되나요 어딜가나 합니다 처방전 돌려 주시나요 안약 처방전은 약국에 보관 합니다"
#text = "오늘 저녁 식사 어떠세요? 좋습니다. 6시 30분에 역앞에서 뵐께요. 넹"
# text = "진호:태형씨, 안녕하세요.태형:예, 안녕하세요.진호:다름이 아니라 당신에게 제안하고 싶은 내용이 있는데 지금 2~3분 잠깐 시간 되시는지요?태형:예, 괜찮습니다. 이야기하시죠. 진호:다름이 아니라 제가 얼마 전에 새로운 사업을 시작했습니다.진호:전 항상 사업을 예약하고 싶었는데 그런 기회가 생긴다면 당신과 같이 하면 참 좋을 거라고 생각했습니다.진호:당신은 하는 일마다성공했고 사람들과 사교적이잖아요.진호:제 부탁을 하나 들어 주실래요.  태형:그러죠 무엇인데요.진호:저는 당신이 사는 지역에 저를 도와서 제 사업을 확장시킬 분을 찾고 있습니다. 진호:당신과 만나서 상의를 하고 싶은데 어떻게 생각하세요?태형:오 그래요. 좋아요.  진호:목요일이나 금요일에 제가 시간을 낼 수 있는데 언제가 좋으시겠어요.태형:둘 째 주 금요일이 좋겠네요.  진호:좋습니다. 진호:그 날 점심이나 같이 하시죠.태형:그렇게 하죠.진호:그럼 네트워크 카페에서 12시에 뵙도록 하겠습니다.태형:네 그때 뵙겠습니다."
#text = "펜션 예약 하려 하는데 1박에얼마인가요 기분 하루 8만원이야 바베큐장은 이용하면 얼마예요 1인에 2만원씩 추가 하시면 됩니다 이번주 토요일에 1박 하고 싶은데 예약 할까요 네 가능해요 퇴실 시간은 언제나 오전 11시에요 결제는 삼성 페이 되나요 네 제자들께야 "
#text = "지금 배달 되나요 알아 듣느라 짬뽕에는 어떤 게 있나요 잘 나가는 점포 있나요 엄 특 공연 복 들어가는 건의 특혜를 전복 시켜야 되요 전복 짬뽕 시키면 전복이 들어 져 전복 들어 가고 여러가지 또 딴것도 들어가 좋네 아 찰 점포 법원 돼지고기 들어가나요 짬뽕은 돼지고기 약간식 들어갑니다 여기 칠성동 1가인데 배달 되나요 색상도 일간은 배달 안됩니다"
#text = "지금 배달 되나요 알아 듣느라 짬뽕에는 어떤 게 있나요 잘 나가는 점포 있나요 엄 특 공연 복 들어가는 건의 특혜를 전복 시켜야 되요 전복 짬뽕 시키면 전복이 들어 져 전복 들어 가고 여러가지 또 딴것도 들어가 좋네 아 찰 점포 법원 돼지고기 들어가나요 짬뽕은 돼지고기 약간식 들어갑니다 여기 칠성동 1가인데 배달 되나요 색상도 일간은 배달 안됩니다"

customs = sys.argv[2:]#['전복', '배달']

tr = TextRank(sys.argv[1], customs)
#print('custom keywords: ', customs)

key_sentences, custom_key_sentences = tr.keysentences(5)

for sentence in key_sentences:
    print(sentence)

for sentence in custom_key_sentences:
    print(sentence)

print(tr.keywords())

print(keywords_in_text(sys.argv[1], customs))
