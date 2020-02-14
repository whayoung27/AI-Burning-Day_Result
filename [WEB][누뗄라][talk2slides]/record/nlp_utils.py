import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from collections import Counter, defaultdict
import spacy
from sklearn.preprocessing import normalize
import nltk
from nltk.stem import WordNetLemmatizer
from konlpy.tag import Kkma

kkma = Kkma()

def kkma_tokenize(sent):
    words = kkma.pos(sent, join=True)
    print(kkma.nouns(sent))
    words = [w for w in words if ('/NNP' in w or '/NNG' in w)]
    # words = [w for w in words if ('/NN' in w or '/XR' in w or '/VA' in w or '/VV' in w)]
    return words

nltk.download('wordnet')

wnl = WordNetLemmatizer()

def scan_vocabulary(sents, tokenize, min_count=2):
    counter = Counter(wnl.lemmatize(w) for sent in sents for w in tokenize(sent))
    counter = {w:c for w,c in counter.items() if c >= min_count}
    idx_to_vocab = [w for w, _ in sorted(counter.items(), key=lambda x:-x[1])]
    vocab_to_idx = {vocab:idx for idx, vocab in enumerate(idx_to_vocab)}
    return idx_to_vocab, vocab_to_idx

def cooccurrence(tokens, vocab_to_idx, window=2, min_cooccurrence=2):
    counter = defaultdict(int)
    for s, tokens_i in enumerate(tokens):
        vocabs = [vocab_to_idx[w] for w in tokens_i if w in vocab_to_idx]
        n = len(vocabs)
        for i, v in enumerate(vocabs):
            if window <= 0:
                b, e = 0, n
            else:
                b = max(0, i - window)
                e = min(i + window, n)
            for j in range(b, e):
                if i == j:
                    continue
                counter[(v, vocabs[j])] += 1
                counter[(vocabs[j], v)] += 1
    counter = {k:v for k,v in counter.items() if v >= min_cooccurrence}
    n_vocabs = len(vocab_to_idx)
    return dict_to_mat(counter, n_vocabs, n_vocabs)

def dict_to_mat(d, n_rows, n_cols):
    rows, cols, data = [], [], []
    for (i, j), v in d.items():
        rows.append(i)
        cols.append(j)
        data.append(v)
    return csr_matrix((data, (rows, cols)), shape=(n_rows, n_cols))

def word_graph(sents, tokenize=None, min_count=2, window=2, min_cooccurrence=2):
    idx_to_vocab, vocab_to_idx = scan_vocabulary(sents, tokenize, min_count)
    tokens = [tokenize(sent) for sent in sents]
    g = cooccurrence(tokens, vocab_to_idx, window, min_cooccurrence)
    return g, idx_to_vocab

def pagerank(x, df=0.75, max_iter=30):
    assert 0 < df < 1

    # initialize
    A = normalize(x, axis=0, norm='l1')
    R = np.ones(A.shape[0]).reshape(-1,1)
    bias = (1 - df) * np.ones(A.shape[0]).reshape(-1,1)

    # iteration
    for _ in range(max_iter):
        R = df * (A * R) + bias

    return R

def textrank_keyword(sents, tokenize, min_count, window, min_cooccurrence, df=0.85, max_iter=300, topk=-1):
    g, idx_to_vocab = word_graph(sents, tokenize, min_count, window, min_cooccurrence)
    R = pagerank(g, df, max_iter).reshape(-1)
    idxs = R.argsort()[::][:]
    keywords = [(idx_to_vocab[idx], R[idx]) for idx in reversed(idxs)]
    return keywords

def generate_bullet_points(ranked, threshold=1.0, exclude=set()):
    keywords = []
    for word_info, score in ranked:
        if score >= threshold:
            keywords.append(word_info.split('/')[0])
    md_list = '\n\n'
    for word in keywords:
        if word not in exclude:
            md_list += ('\n - ' + word)
    return md_list + "\n\n"

def kkma_tokenize(sent):
    words = kkma.pos(sent, join=True)
    print(kkma.nouns(sent))
    words = [w for w in words if ('/NNP' in w or '/NNG' in w)]
    # words = [w for w in words if ('/NN' in w or '/XR' in w or '/VA' in w or '/VV' in w)]
    return words

def get_keywords_list(ranked, threshold=1.0, exclude=set()):
    keywords = []
    for word_info, score in ranked:
        if score >= threshold and word_info.split('/')[0] not in exclude:
            keywords.append(word_info.split('/')[0])
    return keywords