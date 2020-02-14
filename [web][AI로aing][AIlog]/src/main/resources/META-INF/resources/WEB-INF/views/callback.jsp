<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script type="text/javascript" src="https://static.nid.naver.com/js/naverLogin_implicit-1.0.3.js" charset="utf-8"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>

</head>
<body>
    <script type="text/javascript">
        var naver_id_login = new naver_id_login("GaBXKL2aooUwswplSydJ", "https://10.83.36.31:8443/index");
        naver_id_login.get_naver_userprofile("naverSignInCallback()");
        function naverSignInCallback() {
            var data={
                        "token": naver_id_login.oauthParams.access_token,
                        "name": naver_id_login.getProfileData('name'),
                        "nickName": naver_id_login.getProfileData('nickname'),
                        "email": naver_id_login.getProfileData('email')
                }
                $("div").html(data.name)
      
                $.ajax({
                    type : "POST",
                    url : "https://10.83.36.31:8443/user",
                    data : data,
                    async : false,
                  success : function(res) {
                      $("div").html("@!!!")
                      $("div").append(res.name)
                      sessionStorage.setItem("name",res.name)
                      sessionStorage.setItem("email",res.email)
                      sessionStorage.setItem("token",res.token)
                      sessionStorage.setItem("nickName",res.nickName)
                      window.location.replace("https://10.83.36.31:8443/main")
                  },
                  error : function(xhr,status, error) {
                      $("div").html(xhr.statusText)
                  }
              })
        }
      </script>
</body>
</html>
