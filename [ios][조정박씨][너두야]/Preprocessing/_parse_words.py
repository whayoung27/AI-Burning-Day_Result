# import re
# import pandas as pd
# # #
# # word_txt = open('./pagoda_words_raw.txt', 'r', encoding = 'utf-8', newline = '').read()
# #
# # #
# # # word_txt = word_txt.encode(encoding = 'cp949')
# # word_txt_list = word_txt.replace('\n\n','\n')
# # word_txt_list = word_txt_list.split('\n')
# # # 04 committed adj. 헌신적인
# # #eng_and_kor = re.compile('[0-9]*\s.*\s[a-z]{0,4}\s.*')
# # #('[0-9]{0,2}\s.*\s[a-z]{1,3}\s.*')
# #
# #
# # enkor_re = re.compile('([a-z\s]*)\s([a-z]{1,3}\..*)')
# # no_re = re.compile('([0-9]{0,2})(.*)')
# # lst = []
# # for wordline in word_txt_list:
# #     wordline = wordline.strip()
# #     s = no_re.findall(wordline)[0]
# #     no = s[0]
# #     word_and_meaning = s[1]
# #     if '.' not in word_and_meaning:
# #         meaning = word_and_meaning
# #         word = ''
# #     else:
# #         word_raw = word_and_meaning.split('.')[0]
# #         meaning_raw = '.'.join(word_and_meaning.split('.')[1:])
# #
# #         word_raw_l = word_raw.split(' ')
# #         word = ' '.join(word_raw_l[:-1])
# #         pumsa = word_raw_l[-1]
# #         meaning = pumsa + '.' + meaning_raw
# #
# #     d = dict(no = no, word = word.strip(), meaning = meaning.strip())
# #     lst.append(d)
# # df = pd.DataFrame.from_dict(lst)
# # df.to_csv('word_csv.csv', encoding = 'utf-8')
# # word_csv = open('word_csv.csv', 'r', encoding = 'utf-8').read()
# # word_csv = word_csv.encode('cp949', errors = 'xmlcharrefreplace')
# # open('word_csv_cp949.csv', 'wb').write(word_csv)
#
# # words = pd.read_csv('./word_csv_original.csv', encoding = 'cp949', index_col = None)
# # out_list = []
# # for row in words.iloc:
# #     word = row['word']
# #     meaning = row['meaning']
# #     if type(word) == type('someword') and not ' ' in word:
# #         out_list.append(dict(word = word, meaning = meaning))
# #
# # df = pd.DataFrame.from_dict(out_list)
# # df.to_csv('w_nospace.csv', encoding = 'cp949')
#
# from pattern.en import conjugate, lemma, lexeme
#
# word_df = pd.read_csv('./w_nospace.csv', encoding = 'cp949')
# pos_re = re.compile('[a-z]+\.')
# results = []
# for i in range(len(word_df)):
#     d = dict(word_df.iloc[i])
#     word = d['word']
#     meaning = d['meaning']
#     pos_list = pos_re.findall(meaning)
#     #for pos in pos_list
#
#
#     v_der = lexeme(word)
#     der_string = ' '.join(v_der)
#     d['der'] = der_string
#
#     print('w {} : {}'.format(word, der_string))
#
#     results.append(d)
#
# pd.DataFrame.from_dict(results).to_csv('with_der.csv', encoding = 'cp949')
#
#     # for pos in pos_list:
#     #     pos_str
#     #     if pos not in ['n.','v.','adj.','prep.', 'a.','adv.' ]:
#     #         print(pos)
