<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
					"http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">

<head>
<meta charset="UTF-8">
<title>HTML Layouts</title>
<script type="text/javascript" src='http://code.jquery.com/jquery-1.10.1.min.js'></script>
<script type="text/javascript">
$(function(){
   $("#time_cal").click(function(){
      var vid = document.getElementById("script_audio");
      var pt = document.getElementById("pttime");
      pt.value=Math.round(vid.duration);
   });
});
</script>
<link rel="stylesheet" href="<%=request.getContextPath() %>/resources/translation.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">

</head>

<body>

   <header>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="main"><img width="60%" src='<%=request.getContextPath() %>/resources/images/logo.svg'/></a>
        </div>
        <ul class="nav navbar-nav">
         <li><a class="menuLink" href="newscript">스크립트번역</a></li>
			<li><a class="menuLink" href="#">발표연습</a></li>
			<li><a class="menuLink" href="alllecture">강의보기</a></li>
			<li><a class="menuLink" href="scriptlist">나의 발표관리</a></li>
			<li><a class="menuLink" href="login">로그아웃</a></li>
        </ul>
      </div>
    </nav>
   
   <section class="translation">
      <form id="userScript" action="newscript" method="post">
      <div class="translation_left">제목<input type="text" class="trans_title" name="title" value="${trans.title}" /> <br><br>
         <div>
           <select name=origin_lang size=1 class="transOption">
            <option value="ko" selected>한국어</option>
            <option value="en">영어</option>
            <option value="ja">일본어</option>
            <option value="zh-CN">중국어(간체)</option>
            <option value="zh-TW">중국어(번체)</option>
            <option value="es" >스페인어</option>
          </select>
         <img src='<%=request.getContextPath() %>/resources/images/forward.svg'/>
        
           <select name=target_lang size=1 class="transOption">
            <option value="ko">한국어</option>
            <option value="en" selected>영어</option>
            <option value="ja">일본어</option>
            <option value="zh-CN">중국어(간체)</option>
            <option value="zh-TW">중국어(번체)</option>
            <option value="es" >스페인어</option>
          </select>
         음성파일 성별:
           <select name=gender size=1 class="transOption">
            <option value="f"  selected >여성</option>
            <option value="m">남성</option>
         </select>
         <div class="ptTime">
          <span>발표 예상 시간</span><input type="number" id="pttime" name="pttime" readonly value="0"/>초<br>
        </div>
      </div>
        <textarea class="inputtext" rows="20" cols="30" name="content" id="content" required>${content }</textarea>
        <div class="buttons">
         <br/><input class="roundbtn" type="button" id="time_cal"  name="button" value="시간계산"> 
          <input class="roundbtn" type="submit" id="translation"  name="button" value="번역"> 
          <input class="roundbtn" type="submit" name="button" value="저장" />
        </div>
      </div>
        <div class="translation_right">
        <%-- <textarea class="outputtext" rows="20" cols="30" name="script" id="script" readonly="readonly">${trans.script }</textarea> --%>
        <br/>
        
        
         		
	   <c:forEach items="${translist }" var="vo">
			<textarea class="outputtext" rows="20" cols="30" name="content" id="content" readonly="readonly">${vo.content }</textarea>
			<p><img alt="" src="${contextPath}/plt/resources/images/icon.svg" />
			
			</p>
			
			<textarea class="outputtext" rows="20" cols="30" name="script" id="script" readonly="readonly">${vo.script }</textarea>
			<!-- 번역본 받아서 문단 나누기 -->
	
			<input type="button" id="copy"  value="복사"> &nbsp; 
			<!-- 인식된 오디오 소스 받기 --><br>
			<%-- ${contextPath}/plt/resources/voice/${script.voice } --%>
			<%-- ${contextPath}/plt/resources/voice/${trans.voice_path} --%>
			<!-- file:/Users/mcnl/eclipse/java-2019-03/Eclipse.app/Contents/MacOS/1581597094312.mp3 -->
			<audio id = "script_audio"
			src="${contextPath}/plt/resources/voice/${vo.voice_path}" controls > </audio>  <br>
			
			
			
			<%-- <h1>${contextPath}/plt/resources/voice/${trans.voice_path}</h1> --%>
			
			<input type="text" style="display:none" value="${vo.voice_path }" name="voice_path"> 
		</c:forEach>
         
         <!-- 번역본 받아서 문단 나누기 -->
    </div>

      </form>
   </section><br>   


</body>

</html>