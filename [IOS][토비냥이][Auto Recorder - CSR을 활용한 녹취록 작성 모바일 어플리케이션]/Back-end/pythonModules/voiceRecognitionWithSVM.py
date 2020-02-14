from pyAudioAnalysis import audioTrainTest as aT
import sys
import os

argvs = []
argvs.append(sys.argv[1])	#	DiviceId (Phone)

voiceFileDir = './voiceData'

listOfSpeakerDirectory = []

for i in range(0, len(os.listdir(os.path.join(voiceFileDir, argvs[0]))), 1):
	listOfSpeakerDirectory.append(os.path.join(os.path.join(voiceFileDir, argvs[0]),str(i)))

aT.extract_features_and_train(listOfSpeakerDirectory, 1.0, 1.0, aT.shortTermWindow, aT.shortTermStep, "svm", os.path.join(os.path.join(voiceFileDir, argvs[0]), "svmSMtemp"), False)