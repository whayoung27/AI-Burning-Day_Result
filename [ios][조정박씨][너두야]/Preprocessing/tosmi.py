from pycaption import SRTReader, SAMIWriter
import os

dir = './srt'

srtnames = [n for n in os.listdir(dir) if n[-4:] == '.srt']

for name in srtnames:
    puretxt = open(os.path.join(dir, name), 'r', encoding = 'utf-8').read()
    content = SRTReader().read(puretxt)
    smitext = SAMIWriter().write(content)
    print(smitext)