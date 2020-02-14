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

	<header> <img id="logo" alt=""
		src="https://mblogthumb-phinf.pstatic.net/20160622_73/hhtthh82_1466581509899OrBaG_PNG/%B3%D7%C0%CC%B9%F6-%B7%CE%B0%ED-%B0%ED%C8%AD%C1%FA.png?type=w800"
		width="5%"> 
		<a href="login">로그인</a>
	<a href="main">홈으로</a> 

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
	<form action="join" method="post">
		<table id="loginform">
			<tr>
				<td>ID :</td>
				<td><input type="text" id="user_id" name="user_id" required />
				</td>
			</tr>

			<tr>
				<td>PW :</td>
				<td><input type="password" id="password" name="password"
					required /></td>
			</tr>

			<tr>
				<td>NAME :</td>
				<td><input type="text" id="name" name="name" required /></td>
			</tr>
			

			<tr>
				<td rowspan="2">
				<input type="submit" value="회원가입" /> &nbsp;
				<input type="reset" value="다시입력" />
				</td>
			</tr>

		</table>

	</form>
	</section>


	<footer>
	회사소개
	</footer>
</body>

</html>
