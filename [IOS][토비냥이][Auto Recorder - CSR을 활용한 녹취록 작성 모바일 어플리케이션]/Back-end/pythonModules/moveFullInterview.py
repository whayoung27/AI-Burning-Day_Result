import sys
import os
import shutil

argvs = []
argvs.append(sys.argv[1])	#	DiviceId (Phone)
argvs.append(sys.argv[2])	#	FileLocation

interviewFileDir = './FullInterviewData'
tempFileDir = './test/upload'

if not os.path.exists(interviewFileDir):
    	os.mkdir(interviewFileDir)
if not os.path.exists(os.path.join(interviewFileDir, argvs[0])):
	os.mkdir(os.path.join(interviewFileDir, argvs[0]))
if not os.path.exists(os.path.join(os.path.join(interviewFileDir, argvs[0]),'seperated')):
	os.mkdir(os.path.join(os.path.join(interviewFileDir, argvs[0]),'seperated'))

shutil.copy(os.path.join(tempFileDir, argvs[1].split('/')[-1]), os.path.join(interviewFileDir, argvs[0]))
