var {PythonShell} = require('python-shell');
const soundClassifier = require('./classifyVoice/classifyVoices');

module.exports.ClassifySpeakersSoundFile = function (deviceID, speakerDiscriminator, filesNameList){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [deviceID, speakerDiscriminator, filesNameList],
		pythonPath: 'python'
	};
	PythonShell.run('./pythonModules/classifySpeakersVoiceFile.py', options, function (err) {
		if (err) 
			throw err;
		else
			console.log(String(speakerDiscriminator) + " is Stored Successfully!");
	});
}


module.exports.startRecognitionTraining = function (deviceID){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [deviceID],
		pythonPath: 'python'
	};

	PythonShell.run('./pythonModules/voiceRecognitionWithSVM.py', options, function (err) {
		if (err) 
			throw err;
		else
			console.log("training Completed Successfully!");
	});
}

module.exports.moveFullInterview = function (deviceID, fileName){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [deviceID, fileName],
		pythonPath: 'python'
	};

	PythonShell.run('./pythonModules/moveFullInterview.py', options, function (err) {
		if (err) 
			throw err;
		else{
			console.log("interview file moved Successfully!");
			soundClassifier.splitInterview(deviceID);
		}
	});
}