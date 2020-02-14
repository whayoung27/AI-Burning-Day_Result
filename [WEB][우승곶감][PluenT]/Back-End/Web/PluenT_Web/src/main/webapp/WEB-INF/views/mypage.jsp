<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
					"http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">

<head>
<meta charset="UTF-8">
<title>페이지 이름</title>

</head>

<body>
	
	<header>
		<img id="logo" alt="" 
		src="https://mblogthumb-phinf.pstatic.net/20160622_73/hhtthh82_1466581509899OrBaG_PNG/%B3%D7%C0%CC%B9%F6-%B7%CE%B0%ED-%B0%ED%C8%AD%C1%FA.png?type=w800"
		width="5%">

		<a href="main">홈으로</a>
		<a href="logout">로그아웃</a>
	</header>

	<nav > 		
		<ul  id="topMenu">
			<li><a class="menuLink" href="newscript">스크립트번역</a></li>
			<li><a class="menuLink" href="#">발표연습</a></li>
			<li><a class="menuLink" href="alllecture">강의보기</a></li>
			<li><a class="menuLink" href="scriptlist">나의 발표관리</a></li>
		</ul>
	</nav>
	프로필 사진 : 
<img alt="" src="https://lh3.googleusercontent.com/proxy/
COoKYAlX1-zHxOThUBMIwKcDh14X747iihkv83Qkq_LRGNWTaz8ZuNAz6b63UV3IZQ7CGiw_KMYu0JdE24weOKnNFs42bPq9RXFmHZtkdOX-PmzB4nEm67i3lOlgjTnph-aJa8KONrvFZA"
height="200" width="200">
	<br>이름 : ${user.name }<br>
가입 날짜 : ${user.regDate}<br>

<a class="menuLink" href="scriptlist">나의 발표관리</a>
<a class="menuLink" href="mylecturelist">등록된 수업</a>


	<section>

	</section>
	
	<section>

	</section>

	<footer>
	회사소개
	</footer>
</body>

</html>
