<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
					"http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">

<head>
<meta charset="UTF-8">
<title>나의 발표관리</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/style.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
</head>

<body>
	
	<header>
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <a class="navbar-brand" href="main"><img width="60%" src='<%=request.getContextPath() %>/resources/images/logo.svg'/></a>
        </div>
        ${user.name }님 안녕하세요!
        <ul class="nav navbar-nav">
         <li><a class="menuLink" href="newscript">스크립트번역</a></li>
			<li><a class="menuLink" href="#">발표연습</a></li>
			<li><a class="menuLink" href="alllecture">강의보기</a></li>
			<li><a class="menuLink" href="scriptlist">나의 발표관리</a></li>
			<li><a class="menuLink" href="login">로그아웃</a></li>
        </ul>
      </div>
    </nav>
	<section>
		
		<table style="position:relative; left:30%; border: 1px solid; width:500px; height:600px; margin-left:30px; 
		padding-left:20px; padding-bottom:20px; ">
			<tr>
				<th>글 번호</th>
				<th>글 제목</th>
				
				<th>저장일</th>
			</tr>
			<c:forEach items="${scriptlist }" var="vo">
				<tr> 
				<td><a href="/plt/onescript?script_id=${vo.script_id }">${vo.script_id }</a></td>
				<td>  ${vo.title}</td>
				
				<td> ${vo.regdate} </td>
				</tr>
			</c:forEach>
		</table>
	</section>
	
	<section>

	</section>
	
	<footer class="page-footer font-small teal pt-4">
  <div class="container-fluid text-center text-md-left">
    <div class="row">
        <p>(주)우승곶감 | 서울특별시 서대문구 이화여대길51 | 개인정보 취급방침 | 이용 약관
          대표자: 정성원 | 사업자등록번호: 1886-1886 | 통신판매업신고번호: 2020-서울서대문구-1886</p>
    </div>
  </div>
  <div class="footer-copyright text-center py-3">© 2020 Copyright: GotGam</div>
</footer>


</body>

</html>