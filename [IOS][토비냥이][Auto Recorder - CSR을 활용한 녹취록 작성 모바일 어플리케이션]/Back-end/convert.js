const { execSync } = require('child_process');

//exec(command,(err,stdout,stderr)=>{
module.exports.audioConvert = {
    convertRecordingFile: (inputFileName, filePath) => {

        let splitInputFileName = inputFileName.split('.');
        let outputFileName = splitInputFileName[0].concat('.wav');
        let command = `ffmpeg -i ${inputFileName} -hide_banner -ac 1 ${outputFileName}`
        options = {
            cwd: './test/upload/',
            encoding: 'utf-8'
        };
        console.log('done');

        let child_proc = execSync(command, options, (err, stdout, stderr) => {
            if (err) {
                console.log(err);
                console.log(stderr);
                console.log("FAIL Converting...")
            } else {
                console.log("COMPLETE Converting!!!");
                console.log(stdout);

            }
            console.log(err);
            console.log(stderr);
            console.log(stdout);
        });
        process.on('exit', ()=>{
            child_proc.kill();
        });


        return outputFileName;
    }
}