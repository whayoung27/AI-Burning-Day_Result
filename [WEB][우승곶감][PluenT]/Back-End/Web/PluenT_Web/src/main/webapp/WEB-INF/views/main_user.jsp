<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
					"http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">

<head>
<meta charset="UTF-8">
<title>유저 메인페이지</title>

</head>

<body>
	
	<header>
		<img id="logo" alt="" 
		src="https://mblogthumb-phinf.pstatic.net/20160622_73/hhtthh82_1466581509899OrBaG_PNG/%B3%D7%C0%CC%B9%F6-%B7%CE%B0%ED-%B0%ED%C8%AD%C1%FA.png?type=w800"
		width="5%">
		${user.name}님 안녕하세요!
		<a href="mypage">마이페이지</a>
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

	<section>
	<h1>더욱 완벽한 발표를 준비하는 당신을 위해,</h1>
	<button>PluentT 프리미엄 멤버십 가입하기</button>
	</section>

	<section>
	<h1>PluenT 주요 기능</h1>
	<article>발표 스크립트 번역</article> </section>

	<section>
	<h1>발표 예상 시간 측정</h1>
	<article>정해진 시간에 </article> </section>

	<section>
	<h1>발표연습 결과분석 제공</h1>
	<article>정해진 시간에 </article> </section>

	<footer>
	회사소개
	</footer>
</body>

</html>
