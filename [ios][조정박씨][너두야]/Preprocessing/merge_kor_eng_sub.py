import os
import smipy

# 대략 이런식으로 하면 됨
#
# merge two files

def lf_to_crlf(path):
    with open(path , 'rb') as f:
        cont = f.read()
    cont = cont.replace(b'\r\n', b'\n')
    cont = cont.replace(b'\r\n', b'\n')
    cont = cont.replace(b'\n\r', b'\n')
    cont = cont.replace(b'\n', b'\r\n')
    cont = cont + b'\r\n'
    with open(path, 'wb') as f:
        f.write(cont)
    with open(path, 'r') as f:
        cont = f.read()
    cont = cont.strip()
    with open(path, 'w') as f:
        f.write(cont)

if __name__ == '__main__':
    directory = './merge'
    engsmis = [n for n in os.listdir(directory) if '_k' not in n and n[-4:] == '.smi']

    kornames = [n for n in os.listdir(directory) if '_k' in n and n[-4:] == '.smi']
    # for n in engsmis:
    #     print(n)
    #     text = open(os.path.join(directory,n), 'r', encoding='utf-8').read()
    #     open(n, 'w').write(text.encode('cp949', errors = 'replace').decode('cp949'))
    # for n in kornames:
    #     print(n)
    #     text = open(os.path.join(directory,n), 'r', encoding = 'euc-kr').read()
    #     open(n, 'w').write(text.encode('cp949', errors = 'replace').decode('cp949'))

    print(engsmis)
    for engname in engsmis:
        korname = engname.split('.')[0] + '_k' + '.smi'
        smieng = smipy.Smi(os.path.join(directory, engname))
        smikor = smipy.Smi(os.path.join(directory, korname))

        smieng.to_csv(engname, dest=directory)
        smikor.to_csv(korname, dest = directory)

        # engsubtitles = []

        # for sub in smieng.subtitles:
        #     line = sub['kor'] + sub['eng']
        #     line = line.strip()
        #     engsubtitles.append(dict(start=sub['start'], end=sub['end'], kor='', eng=line))
        #
        # allsent = []
        # allsent.extend(engsubtitles)
        # allsent.extend(smikor.subtitles)
        # allsent = smipy.sort_sentence(allsent)
        #
        # smiall = smipy.Smi()
        # smiall.from_sentences(allsent)
        # smiall.to_csv(title=engname.split('.')[0], dest=directory, all=True)


    # if __name__ == '__main__':
#     for n in kornames:
#         lf_to_crlf(os.path.join(directory, n))


# korsent = smipy.csv_to_sentences('./bb501.smi_k.csv')
# engsent = smipy.csv_to_sentences('./bb501.smi_e.csv')
# allsent = []
# allsent.extend(korsent)
# allsent.extend(engsent)
# allsent = smipy.sort_sentence(allsent)
#
# smi = smipy.Smi()
# smi.from_sentences(allsent)
# newtext = smi.to_csv(title='newcsv.csv', dest='./')
# # open('./newtxt.smi', 'w').write(newtext)
# newline_rev = smipy.csv_to_sentences('./newcsv_rev.csv')
# newline_rev = smipy.sort_sentence(newline_rev)
# smi = smipy.Smi()
# smi.from_sentences(newline_rev)
# smi.to_csv(title='newcsv_rev_new')
