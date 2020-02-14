<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="utf-8" />
    <title>AIlog</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script
      type="text/javascript"
      src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js"
      charset="utf-8"
    ></script>

    <style>
        * {
            box-sizing: border-box;
        }
        html,
        body {
            height: 100%;
            margin: 0;
            padding: 0;
            width: 100%;
        }
        html {
            overflow: hidden;
        }
        header {
            background: rgb(0,207,101);
            color: #fff;
            font-weight: bold;
            font-size: 20px;
            height: 56px;
            padding: 16px 16px 0 16px;
            position: fixed;
            width: 100%;
            z-index: 1000;
        }
        #controls{
            position: relative;
            top: 60px;
            height: 60px;
            width: 100%;
            margin-left:10px;
            margin-right: 10px;
        }
        #controls button{
            width: 30%;
            height: 60px ;
            font-size: 20px;
            background-color: none;
            border: none;
        }
        #submitForm{
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 60px;
        }
        #searchFileBtn{
            display: none;
        }
        label{
            position: relative;
            font-size: 20px;
            left: 5%;
        }

        #fileName{
            position: relative;
            left: 10px;
            width: 65%;
            height: 40px;
            font-size: 15px;
            padding-left: 5px;
            overflow: hidden;
        }
    </style>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <script>
        $(document).ready(function() {
          const recordAudio = () => {
            return new Promise(async resolve => {
              bufferSize =1024
              audioCtx = new (window.AudioContext||window.webkitAudioContext)()
              if (audioCtx.createJavaScriptNode) {
                audioNode = audioCtx.createJavaScriptNode(bufferSize, 1, 1)
              } else if (audioCtx.createScriptProcessor) {
                audioNode = audioCtx.createScriptProcessor(bufferSize, 1, 1)
              } else {
                throw 'WebAudio not supported!';
              }
              audioNode.connect(audioCtx.destination);
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
              const options = {mimeType: 'video/webm;codecs=vp9'}

              const mediaRecorder = new MediaRecorder(stream,options);
              const audioChunks = [];

              const downloadLink = $("download")
              mediaRecorder.addEventListener("dataavailable", event => {
                audioChunks.push(event.data);
              });

              const start = () => {
                mediaRecorder.start();
              };

              const stop = () => {
                return new Promise(resolve => {
                  mediaRecorder.stop();
                  mediaRecorder.addEventListener("stop", () => {
                    const audioBlob = new Blob(audioChunks,{type:'audio/wav; codecs=MS_PCM'});
                    var url = URL.createObjectURL(audioBlob)
                    var a =document.createElement("a")
                    const audioUrl = URL.createObjectURL(audioBlob);
                    const audio = new Audio(audioUrl);

                    document.body.appendChild(a)
                    a.style = "display: none";
                    a.href = url;

                    a.download = "recfile.wav";
                    a.click();
                    window.URL.revokeObjectURL(url);


                    var formData = new FormData();
                    var fileReader = new FileReader()

                    var reader = new FileReader();
                    var data = null;
                    reader.onload = function(event) {
                      data = event.target.result;

                      var blobFile = new File([data], "test.wav", {type : 'audio/wav'});


                      formData.append("token", sessionStorage.getItem("token"));
                      formData.append("uploadFile", data);
                      $.ajax({
                        type: 'POST',
                        url : "https://10.83.36.31:8443/record/bytes",
                        processData: false,
                        contentType: false,
                        async : false,
                        data: formData,
                        success: function(result){
                        },
                        error: function(e){
                          alert("처리중 오류가 발생하였습니다.");
                        }
                      });


                    };
                    reader.readAsDataURL(audioBlob);
                   
                    resolve({ audioBlob, audioUrl });
                  });

                });
              };

              resolve({ start, stop });
            })
          };

          //file 선택해서 보내기
          var searchFileBtn = $("#searchFileBtn");
          var submitBtn = $("#submitBtn");
          var fileName=$("#fileName")
          searchFileBtn.change(function(e) {
            var file = e.target.files[0];
            if (file != null) {
              submitBtn.addClass("active");
              fileName.attr("value", file.name);
            }
          });
  
           // ==========녹음하는 부분
      var startBtn = $("#recordBtn");
      var pauseBtn = $("#pauseBtn");
      var stopBtn = $("#stopBtn");
  
      var recorder;
      var audio;
      startBtn.click(function(){
        startBtn.attr('disabled');
          stopBtn.removeAttr('disabled');
          pauseBtn.removeAttr('disabled');
        if(!checkPermission()){
        }
        
        (async () => {
            recorder = await recordAudio();
            recorder.start();
        })()
  
  
      });

      stopBtn.click(function(){
        (async () => {
        audio = await recorder.stop();
      })();
  
      })
  
      
  
        });
        function checkPermission(){
          navigator.permissions.query({name:'microphone'}).then(function(result){
            if(result.state == 'granted'){
              return true
            }else{
              return false
            }
          })
        }
  
        //보내기
      </script>
</head>
<body>
    <header>AIlog</header>
    <main class="main">
        <div id="controls">
          <button id="recordBtn" >Record</button>
          <button id="pauseBtn" disabled>Pause</button>
          <button id="stopBtn" disabled>Stop</button>
        </div>
        <div id ="submitForm">
          <input id="token" hidden>
          <input id="searchFileBtn"
            type="file"
            name="uploadFile"
            onChange = "uploadFile()" />

        <input id="fileName" type="text" value="no file">
        <label for="searchFileBtn">SEARCH FILE</label>
        </div>
      </main>
</body>

<script>
    
    if ('serviceWorker' in navigator) {
     window.addEventListener('load', () => {
       navigator.serviceWorker.register('/service-worker.js')
           .then((reg) => {
           });
        
     });
   }

    function uploadFile(){

      var formData = new FormData();
      formData.append("token", sessionStorage.getItem("token"))
      formData.append("uploadFile", $("input[name='uploadFile']")[0].files[0]);
      $.ajax({
        type: 'POST',
        url : "https://10.83.36.31:8443/record",
        processData: false,
        contentType: false,
        async : false,
        data: formData,
        success: function(result){
        },
        error: function(e){
          alert("처리중 오류가 발생하였습니다.");
        }
      });
    }
</script>
</html>
