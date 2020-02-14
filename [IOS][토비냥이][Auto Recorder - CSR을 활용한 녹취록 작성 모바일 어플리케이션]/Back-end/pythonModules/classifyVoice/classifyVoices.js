var {PythonShell} = require('python-shell');

module.exports.splitInterview = function (deviceID){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [deviceID],
		pythonPath: 'python'
	};
	PythonShell.run('./pythonModules/classifyVoice/splitInterview.py', options, function (err) {
		if (err) 
			throw err;
		else{
			console.log("Split interview Completed Successfully!");
			classifyMasterOfSound(deviceID)
		}

	});
}

function classifyMasterOfSound(deviceID){
	var options = {
		mode: 'text',
		encoding: 'utf8',
		pythonOptions: ['-u'],
		scriptPath: '',
		args: [deviceID],
		pythonPath: 'python'
	};
	PythonShell.run('./pythonModules/classifyVoice/classifyMasterOfSound.py', options, function (err) {
		if (err) 
			throw err;
		else
			console.log("classification Completed Successfully!");
	});
}

//여기에 자르는 함수 넣으면 끝
