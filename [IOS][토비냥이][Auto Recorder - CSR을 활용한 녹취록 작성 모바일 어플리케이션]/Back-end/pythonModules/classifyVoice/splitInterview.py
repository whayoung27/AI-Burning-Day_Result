import sys
import os
import shutil
import librosa
import math

argvs = []
argvs.append(sys.argv[1])	#	DiviceId (Phone)

interviewFileDir = './FullInterviewData'
interviewFileDir = os.path.join(interviewFileDir, argvs[0])
fileName = ''

for findwav in os.listdir(interviewFileDir):
	if findwav[-3:] == 'wav':
		fileName = findwav
		break

y, sr = librosa.load(os.path.join(interviewFileDir, fileName), sr=16000)

os.system("ffmpeg -i " + os.path.join(interviewFileDir, fileName) + " -af silencedetect=noise=-30dB:d=0.3 -f null - 2> "+os.path.join(interviewFileDir, "silence_logs.txt"))

with open(os.path.join(interviewFileDir, "silence_logs.txt"), 'r') as silenceDetecter:
	silenceLog = []
	start_Time = 0
	finish_Time = 0

	for line in silenceDetecter:
		if line[:14] == '[silencedetect':
			silenceLog.append(line.rstrip('\n').split())

	for i in range(0, len(silenceLog)- 1): # 마지막 엔드 미포함
		if silenceLog[i][3] == 'silence_end:':
			start_Time = float(silenceLog[i][4])
			finish_Time = float(silenceLog[i+1][4])

			start_with_sr = math.floor(start_Time * sr)
			finish_with_sr = math.floor(finish_Time * sr)
			print(start_with_sr)

			librosa.output.write_wav(interviewFileDir + '/seperated/cutted_' + fileName + '_' + str(start_Time) +'.wav', y[start_with_sr:finish_with_sr], sr)

