from pyAudioAnalysis import audioTrainTest as aT
import sys
import os

argvs = []
argvs.append(sys.argv[1])	#	DiviceId (Phone)

interviewFileDir = './FullInterviewData'
voiceFileDir = './voiceData'

final_loc = os.path.join(os.path.join(interviewFileDir, argvs[0]),'seperated') #각 폴더 내부에 sperated 폴더를 만들어 분할파일을 저장할 것이다.
trained_data_loc = os.path.join(os.path.join(voiceFileDir, argvs[0]), "svmSMtemp")

if not os.path.join(os.path.join(interviewFileDir, argvs[0]), 'class_log.txt'):
	text = open(os.path.join(os.path.join(interviewFileDir, argvs[0]), 'class_log.txt'), 'w')
else:
	text = open(os.path.join(os.path.join(interviewFileDir, argvs[0]), 'class_log.txt'), 'a')

temp = os.listdir(final_loc)
temp.sort(key=lambda x: float(x.split('_')[-1][:-4]))

for file_name in temp:
	class_id, probability, classes = aT.file_classification(os.path.join(final_loc, file_name), trained_data_loc, "svm")
	text.write('['+file_name.split('_')[-1][:-4]+'] [Speaker: '+str(int(class_id))+']'+'\n')

text.close()
