#!/usr/bin/env python
# coding: utf-8
import io

def str_to_mkd(rcv_lst):
	with io.open('/Users/sababi/Documents/GitHub/darkslide/examples/markdown/out.md', 'w', encoding="utf-8") as f:
	    doc = []
	    for k,v in rcv_lst.items():
	        print('# '+k+'\n', file=f)
	        if type(v) == str:
	            print(v+'\n', file=f)
	        elif type(v) == list:
	            for i in v:
	                print(i+'\n', file=f)
	        print('---\n', file=f)
	    print('# Thank You!', file=f)

# example run
rcv_lst = dict()

제목 = '누뗄라'
rcv_lst[제목] = ''

단락_1 = '이탈리아 알바에 본사를 둔 페레로 社가 만들고 있는 헤이즐넛 스프레드. 100g당 545kcal의 고열량이므로 다이어트를 해야 하는 사람들은 반드시 피해야 할 칼로리 폭탄이다. 금박지로 포장된 동그란 초콜릿인 페레로 로쉐에 들어있는 초콜릿 잼이 바로 누텔라이다.'
단락_2 = 'Nutella is a brand of sweetened hazelnut cocoa spread. Nutella is manufactured by the Italian company Ferrero and was first introduced in 1964, although its first iteration dates to 1963.'
rcv_lst['단락'] = [단락_1, 단락_2]

키워드 = ['- 악마의똥','- 하나님','- 한번만']
rcv_lst['키워드'] = 키워드

이미지='img src="../_assets/nutella.jpeg" width="500" '
rcv_lst['이미지'] = '<'+이미지+'/>'

str_to_mkd(rcv_lst)
