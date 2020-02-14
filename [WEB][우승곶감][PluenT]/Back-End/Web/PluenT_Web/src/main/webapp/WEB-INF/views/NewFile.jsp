<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
					"http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">


<head>
<meta charset="UTF-8">
<title>HTML Layouts</title>
<script type="text/javascript">
$(function(){
	$("#time_cal").click(function(){
		var vid = document.getElementById("script_audio");
		var pt = document.getElementById("pttime");
		pt.value=Math.round(vid.duration);
	});
});


</script>

<script type="text/javascript" src='http://code.jquery.com/jquery-1.10.1.min.js'></script>

</head>

<body>

	<header> <img id="logo" alt=""
		src="https://mblogthumb-phinf.pstatic.net/20160622_73/hhtthh82_1466581509899OrBaG_PNG/%B3%D7%C0%CC%B9%F6-%B7%CE%B0%ED-%B0%ED%C8%AD%C1%FA.png?type=w800"
		width="5%"> 
		<a href="mypage">마이페이지</a> 
		<a href="logout">로그아웃</a> </header>

	<nav > 		
		<ul  id="topMenu">
			<li><a class="menuLink" href="newscript">스크립트번역</a></li>
			<li><a class="menuLink" href="#">발표연습</a></li>
			<li><a class="menuLink" href="alllecture">강의보기</a></li>
			<li><a class="menuLink" href="scriptlist">나의 발표관리</a></li>
		</ul>
	</nav>
	
	<section>
		<form id="userScript" action="newscript" method="post">
			제목:<input type="text" name="title" value="${title}" /> <br><br>
			
				<!-- 인식된 번역본 받기 -->
			원래 언어:
			<select name=origin_lang size=1>
		        <option value="ko" selected>한국어</option>
		        <option value="en">영어</option>
		        <option value="ja">일본어</option>
		        <option value="zh-CN">중국어(간체)</option>
		        <option value="zh-TW">중국어(번체)</option>
		        <option value="es" >스페인어</option>
	    	</select><br>
	    	<br><br>번역 언어:
			<select name=target_lang size=1>
		        <option value="ko">한국어</option>
		        <option value="en" selected>영어</option>
		        <option value="ja">일본어</option>
		        <option value="zh-CN">중국어(간체)</option>
		        <option value="zh-TW">중국어(번체)</option>
		        <option value="es" >스페인어</option>
	    	</select>
	    	<br>음성 목소리 성별:
			<select name=gender size=1>
		        <option value="f"  selected >여자</option>
		        <option value="m">남자</option>
	    	</select>
	    		<br>
	    		내용넣기:<textarea rows="20" cols="30" name="content" id="content" required>${content }</textarea>
	    		<hr>
	    		
	    <c:forEach items="${translist }" var="vo">
			내용:<textarea rows="20" cols="30" name="content" id="content" readonly="readonly">${vo.content }</textarea>
			
			번역본:
			<textarea rows="20" cols="30" name="script" id="script" readonly="readonly">${vo.script }</textarea>
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
		발표 예상 시간 : <input type="number" id="pttime" name="pttime" readonly value="0"/>(s) <br> 
			<!-- 버튼 설정 -->
			<input type="button" id="time_cal"  name="button" value="시간계산"> &nbsp;&nbsp;
			<input type="submit" id="translation"  name="button" value="번역"> &nbsp;&nbsp;
		<!-- 	<input type="submit" id="voi"  name="button" value="음성파일 불러오기"> &nbsp;&nbsp; -->
			<input type="submit" name="button" value="저장" />
		</form>
	</section><br>	
	


	<footer>
	회사소개
	</footer>
</body>

</html>