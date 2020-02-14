<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
   
    <title>AIlog</title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- <link rel="stylesheet" type="text/css" href="styles/inline.css"> -->

    <script type="text/javascript" src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js" charset="utf-8"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

    <style>
     

     html,body{
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        #naver_id_login{
            width: 100%;
            margin-top:100px;

        }
        #logo{
            width: 100%;
            text-align: center;
            color: rgb(0,207,101);
            font-size: 100px;
            font-weight: bold;
            margin-top: 30vh;
        }

    </style>

</head>
<body>
    <main class="main">
        <div id="logo">AIlog

            <div id="naver_id_login" style="border: 0 !important;">
            </div>
        </div>
        

        <script type="text/javascript">
            var naver_id_login = new naver_id_login("GaBXKL2aooUwswplSydJ", "https://10.83.36.31:8443/callback");
            var state = naver_id_login.getUniqState();
            naver_id_login.setButton("white", 3,60);
            naver_id_login.setDomain("https://10.83.36.31:8443");
            naver_id_login.setState(state);
            naver_id_login.init_naver_id_login();
        </script>
    </main>
</body>
</html>
