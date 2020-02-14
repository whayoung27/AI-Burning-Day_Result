const express = require('express');
//const bodyParser = require('body-parser')
const multer = require('multer')
const session = require('express-session');
const FileStore = require('session-file-store')(session);
//const upload = multer({ dest: 'upload/' })
const formidable = require('formidable')
const { audioConvert } = require('./convert')
const path = require('path');
const { csr } = require('./csr');
const config = require('./config');
const fs = require('fs');
const arrangeSoundFiles = require('./pythonModules/voiceRecognition');
const soundClassifier = require('./pythonModules/classifyVoice/classifyVoices');
const fileDir = config.fileDir;
const language = config.laguage;
const users = {};
const temp = [];


app = express()
app.use(session({  // 2
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.post('/training', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = fileDir;
    form.keepExtensions = true;
    var sessionId = req.session.id;

    await form.parse(req, async (err, fields, files) => {
        try {
            var filePath = files.audio.path.split('\\')
            var fileName = filePath[filePath.length - 1]

            outputFileName = await audioConvert.convertRecordingFile(fileName, form.uploadDir);
            outputFilePath = form.uploadDir.concat(outputFileName);
            
            var foo = fields;
            
            foo.path = outputFilePath;
            console.log('foo: ' + foo);
            temp.push(foo);
            console.log('temp: ' + temp);
            if ((fields['isFinish'] === 'true')) {
                users[sessionId] = await temp;
                async () => {
                    for (let i = 0; i < temp.length; i++) {
                        await temp.pop();
                    }
                }
                users[sessionId].forEach((i)=> {
                    console.log("반복문: " + i);
                    console.log(i['path']);
                    arrangeSoundFiles.ClassifySpeakersSoundFile(sessionId, i['userNumber'], i['path']);
                });
                console.log('트레이닝 스타트');
                arrangeSoundFiles.startRecognitionTraining(sessionId);
                
                console.log('트레이닝 종료');
            }

            
            
            res.send('ok');
            return;
        } catch (error) {
            console.log(error)
        }
    });
    return;

})


app.post('/voice', async (req, res) => {
    const form = new formidable.IncomingForm();
    form.uploadDir = fileDir;
    form.keepExtensions = true;
    var sessionId = req.session.id;
    var tts_list = [];
    var tts_log = "";
    await form.parse(req, async (err, fields, files) => {
        try {
            var filePath = files.audio.path.split('\\')
            var fileName = filePath[filePath.length - 1]

            outputFileName = await audioConvert.convertRecordingFile(fileName, form.uploadDir);
            outputFilePath = form.uploadDir.concat(outputFileName);
            
            await arrangeSoundFiles.moveFullInterview(sessionId, outputFilePath);
            //soundClassifier.splitInterview(sessionId);

            console.log(fields);

            var files = fs.readdirSync(path.join(process.cwd(), 'FullInterviewData')+'/' + sessionId + '/seperated');
                files.sort( function(a, b) {
                    a_num = "" + a.split('_')[-1];
                    b_num = "" + b.split('_')[-1];
                    
                    return parseFloat(a_num.substring(0, a_num.length - 4)) < parseFloat(b_num.substring(0, b_num.length - 4)) ? -1 : parseFloat(a_num.substring(0, a_num.length - 4)) > parseFloat(b_num.substring(0, b_num.length - 4)) ? 1 : 0;
            });

            for (let i = 0; i < files.length; i++){
                await csr.stt(language, './FullInterviewData/' + sessionId + '/seperated/' + files[i], (body) => {
                    console.log("RESULT: " + body.text);
                    tts_list.push(body.text);
                });
            }

            for (let i = 0; i < tts_list.length; i++){
                tts_log += tts_list[i] + '\n'
            }

            fs.writeFile('./FullInterviewData/' + sessionId + 'tts_log.txt', tts_log, function(err){ 
                if (err === null){ 
                    console.log('success');
                } 
                else { 
                    console.log('fail'); 
                } 
            });


            return;
        } catch (error) {
            console.log(error)
        }
    });
})


app.listen(3000, () => {
    console.log(`Server is running on 3000`);
})

