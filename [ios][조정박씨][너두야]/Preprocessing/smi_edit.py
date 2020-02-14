import os
import smipy
from os.path import join as osj
dir = './bigbang'

def get_smi_true(dir):
    smilst = [n for n in os.listdir(dir) if n[:-4] == '.smi']
    for n in smilst:
        smi = smipy.Smi(os.path.join(dir, n))
        smi.to_csv(os.path.join(dir, n))
        open(os.path.join(dir, n), 'w').write(smi.export())

if __name__ == '__main__':
    #get_smi_true('./bigbang')

    name = 'BB508.smi'

    smi = smipy.Smi(os.path.join(dir, name))
    sinctext = smi.export(start_time=-1200)
    with open(osj(dir, name), 'w') as f:
        f.write(sinctext)