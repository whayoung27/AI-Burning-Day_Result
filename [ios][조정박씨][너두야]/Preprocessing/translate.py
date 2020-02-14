import pandas as pd
import os
import smipy
import naverapi
from os.path import join as osj
import numpy as np

threshold_ms = 20000



directory = './friends'
smi_names = [n for n in os.listdir(directory) if n[-4:] == '.smi']

bundle = 10

for n in smi_names:
    print(n)
    smi = smipy.Smi(osj(directory, n))
    smi.kor_signal = 'KRCC'
    sub_len = len(smi.subtitles)
    bundle_len = int(np.ceil(sub_len/bundle))

    for i_bundle in range(bundle_len):
        start = i_bundle*bundle
        end = start+bundle
        st = smi.subtitles[start:end]
        st = [s['eng'] for s in st]
        engtext = '\n'.join(st)
        tr = naverapi.papago_translate(engtext)
        if tr is not None:
            tr_list = tr.split('\\n')
            print(len(st), len(tr_list))
            for ind, kor in enumerate(tr_list):
                if ind == len(st)-1:#last
                    smi.subtitles[start + ind]['kor'] = ' '.join(tr_list[ind:])
                else:
                    smi.subtitles[start + ind]['kor'] = kor
        else:
            print('ERR in line')


    # for ind, line in enumerate(smi.subtitles):
    #     tr = naverapi.papago_translate(line['eng'], verbose=True)
    #     if tr is not None:
    #         line['kor'] = tr
    #     else:
    #         print('ERR in line {}'.format(line['eng']))
    smitxt = smi.export()
    with open(os.path.join(directory, 't_' + n), 'w') as f:
        f.write(smitxt)