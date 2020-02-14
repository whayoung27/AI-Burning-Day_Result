import sys
import os
import shutil

argvs = []
argvs.append(sys.argv[1])	#	DiviceId (Phone)
argvs.append(sys.argv[2])	#	speaker's Name (ex. 0, 1, 2)
argvs.append(sys.argv[3])	#	array of spaker's data for training

voiceFileDir = './voiceData'
tempFileDir = './test/upload'

if not os.path.exists(voiceFileDir):
    	os.mkdir(voiceFileDir)
if not os.path.exists(os.path.join(voiceFileDir, argvs[0])):
	os.mkdir(os.path.join(voiceFileDir, argvs[0]))
if not os.path.exists(os.path.join(os.path.join(voiceFileDir, argvs[0]), argvs[1])):
	os.mkdir(os.path.join(os.path.join(voiceFileDir, argvs[0]), argvs[1]))

shutil.copy(os.path.join(tempFileDir, argvs[2].split('/')[-1]), os.path.join(os.path.join(voiceFileDir, argvs[0]), argvs[1]))
