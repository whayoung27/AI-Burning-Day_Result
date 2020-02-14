import json
import pickle
import torch
from model.net import KobertCRF
from gluonnlp.data import SentencepieceTokenizer
from data_utils.utils import Config
from data_utils.vocab_tokenizer import Tokenizer
from data_utils.pad_sequence import keras_pad_fn
from pathlib import Path


class DecoderFromNamedEntitySequence():
    def __init__(self, tokenizer, index_to_ner):
        self.tokenizer = tokenizer
        self.index_to_ner = index_to_ner

    def __call__(self, list_of_input_ids, list_of_pred_ids):
        input_token = self.tokenizer.decode_token_ids(list_of_input_ids)[0]
        pred_ner_tag = [self.index_to_ner[pred_id] for pred_id in list_of_pred_ids[0]]

        print("len: {}, input_token:{}".format(len(input_token), input_token))
        print("len: {}, pred_ner_tag:{}".format(len(pred_ner_tag), pred_ner_tag))

        # ----------------------------- parsing list_of_ner_word ----------------------------- #
        list_of_ner_word = []
        entity_word, entity_tag, prev_entity_tag = "", "", ""
        for i, pred_ner_tag_str in enumerate(pred_ner_tag):
            if "B-" in pred_ner_tag_str:
                entity_tag = pred_ner_tag_str[-3:]

                if prev_entity_tag != entity_tag and prev_entity_tag != "":
                    list_of_ner_word.append(
                        {"word": entity_word.replace("▁", " "), "tag": prev_entity_tag, "prob": None})

                entity_word = input_token[i]
                prev_entity_tag = entity_tag
            elif "I-" + entity_tag in pred_ner_tag_str:
                entity_word += input_token[i]
            else:
                if entity_word != "" and entity_tag != "":
                    list_of_ner_word.append({"word": entity_word.replace("▁", " "), "tag": entity_tag, "prob": None})
                entity_word, entity_tag, prev_entity_tag = "", "", ""

        # ----------------------------- parsing decoding_ner_sentence ----------------------------- #
        decoding_ner_sentence = ""
        is_prev_entity = False
        prev_entity_tag = ""
        is_there_B_before_I = False

        for token_str, pred_ner_tag_str in zip(input_token, pred_ner_tag):
            token_str = token_str.replace('▁', ' ')  # '▁' 토큰을 띄어쓰기로 교체

            if 'B-' in pred_ner_tag_str:
                if is_prev_entity is True:
                    decoding_ner_sentence += ':' + prev_entity_tag + '>'

                if token_str[0] == ' ':
                    token_str = list(token_str)
                    token_str[0] = ' <'
                    token_str = ''.join(token_str)
                    decoding_ner_sentence += token_str
                else:
                    decoding_ner_sentence += '<' + token_str
                is_prev_entity = True
                prev_entity_tag = pred_ner_tag_str[-3:]  # 첫번째 예측을 기준으로 하겠음
                is_there_B_before_I = True

            elif 'I-' in pred_ner_tag_str:
                decoding_ner_sentence += token_str

                if is_there_B_before_I is True:  # I가 나오기전에 B가 있어야하도록 체크
                    is_prev_entity = True
            else:
                if is_prev_entity is True:
                    decoding_ner_sentence += ':' + prev_entity_tag + '>' + token_str
                    is_prev_entity = False
                    is_there_B_before_I = False
                else:
                    decoding_ner_sentence += token_str

        return list_of_ner_word, decoding_ner_sentence


import os

ABS_PATH = os.environ.get('BASEDIR')

model_dir = Path(f'{ABS_PATH}/experiments/base_model_with_crf_val')
model_config = Config(json_path=model_dir / 'config.json')

# Vocab & Tokenizer
tok_path = f"{ABS_PATH}/tokenizer_78b3253a26.model"
ptr_tokenizer = SentencepieceTokenizer(tok_path)

# load vocab & tokenizer
with open(model_dir / "vocab.pkl", 'rb') as f:
    vocab = pickle.load(f)

tokenizer = Tokenizer(vocab=vocab, split_fn=ptr_tokenizer, pad_fn=keras_pad_fn, maxlen=None)

# load ner_to_index.json
with open(model_dir / "ner_to_index.json", 'rb') as f:
    ner_to_index = json.load(f)
    index_to_ner = {v: k for k, v in ner_to_index.items()}

# Model
model = KobertCRF(config=model_config, num_classes=len(ner_to_index), vocab=vocab)
# model = KobertBiGRUCRF(config=model_config, num_classes=len(ner_to_index), vocab=vocab)

# load
model_dict = model.state_dict()
checkpoint = torch.load(
    f"{ABS_PATH}/experiments/base_model_with_crf_val/best-epoch-12-step-1000-acc-0.960.bin",
    map_location=torch.device('cpu'))

convert_keys = {}
for k, v in checkpoint['model_state_dict'].items():
    new_key_name = k.replace("module.", '')
    if new_key_name not in model_dict:
        print("{} is not int model_dict".format(new_key_name))
        continue
    convert_keys[new_key_name] = v

model.load_state_dict(convert_keys)
model.eval()
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

model.to(device)

decoder_from_res = DecoderFromNamedEntitySequence(tokenizer=tokenizer, index_to_ner=index_to_ner)


def infer(input_text: str):
    list_of_input_ids = tokenizer.list_of_string_to_list_of_cls_sep_token_ids([input_text])
    x_input = torch.tensor(list_of_input_ids).long()

    list_of_pred_ids = model(x_input)

    list_of_ner_word, decoding_ner_sentence = decoder_from_res(list_of_input_ids=list_of_input_ids,
                                                               list_of_pred_ids=list_of_pred_ids)
    print("list_of_ner_word:", list_of_ner_word)
    print("decoding_ner_sentence:", decoding_ner_sentence)
    return list_of_ner_word, decoding_ner_sentence


from flask_restplus import Api, Resource
from flask_restplus import Resource, Namespace
from flask import request, send_file

ns = Namespace(name='', description='version-1')

import requests
import re
import logging

logging.basicConfig()
logger = logging.getLogger(__name__)
logger.setLevel("DEBUG")


def _get_msg(msg=None):
    return {'errors': msg}


def _norm_words(words):
    words = words[5:-5]
    words = words.strip()
    return words


TAG_DICT = {
    'MNY': '금액',
    # 'PER': '사람이름',
    # 'ORG': '기관',
    'LOC': '장소',
    # 'POH': '고유명사',
    'DAT': '날짜',
    'TIM': '시간',
    # 'DUR': '기간',
    # 'PNT': '비율',
    # 'NOH': '단위',
}


def _make_ret(words_infered, words):
    words = words.strip()
    list_of_ner_word, decoded_sentence = words_infered[0], words_infered[1]
    # remove [CLS] and [SEP]
    if decoded_sentence[:4] == '[CLS]' and decoded_sentence[-5:] == '[SEP]':
        return _get_msg('model error')

    decoded_sentence = _norm_words(decoded_sentence)

    t_idx = 0
    t_dict = {}  # word idx, word
    for each in list_of_ner_word:
        k = each['word']
        k = k.strip()
        tag = each['tag']
        if k in words and tag in TAG_DICT:
            words = re.sub(k, f' @{t_idx} ', words)
            t_dict[f'@{t_idx}'] = (k, tag)
            t_idx += 1

    logger.info(f'words after ner inserted={words}')
    words = words.split()

    ret = {}
    ret_str = ''
    for idx, each in enumerate(words):
        if each.startswith('@'):
            w, t = t_dict[each]
            ret[idx] = {
                'word': w,
                'tag': t,
            }
            ret_str += f' {TAG_DICT[t]} {w}'
        else:
            ret[idx] = {
                'word': each,
                'tag': None,
            }
            ret_str += f' {each}'

    ret_str = ret_str.lstrip()
    # tk : plz 1string

    return ret_str


from nltk.tokenize import sent_tokenize


@ns.route('/ner')
class Index(Resource):
    @ns.doc('ner', params={'words': 'sentence or sequence of words by whitespace to be inferenced'})
    def get(self):
        words = request.args.get('words')

        if isinstance(words, list):
            words = ' '.join(words)

        words = sent_tokenize(words)

        # if not isinstance(words, str):
        #     logger.info('NO string')
        #     return _get_msg('words is not string')
        data = []

        for each in words:
            words_infered = infer(each)

            logger.info(f'original words: {each}')
            logger.info(f'inferenced words: {words_infered[0], words_infered[1]}')

            ret = _make_ret(words_infered, each)
            ret = ret.split()
            ret = ' '.join(ret)
            data.append(ret)

        return {
            'data': data,
            'errors': None,
        }


api = Api(version='0.1', title='AI BURNING!', description='NER API')

api.add_namespace(ns)
