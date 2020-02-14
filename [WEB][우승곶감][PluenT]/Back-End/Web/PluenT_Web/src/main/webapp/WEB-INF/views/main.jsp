<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
					"http://www.w3.org/TR/html4/loose.dtd">
<html lang="ko">

<head>
<meta charset="UTF-8">
<title>HTML Layouts</title>
<link rel="stylesheet" type="text/css" href="<%=request.getContextPath() %>/resources/style.css" />

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
   </head>
  <body>
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
  <div id="slide">
      <input type="radio" name="pos" id="pos1" checked>
      <input type="radio" name="pos" id="pos2">
      <input type="radio" name="pos" id="pos3">
      <input type="radio" name="pos" id="pos4">
      <ul>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <p class="pos">
        <label for="pos1"></label>
        <label for="pos2"></label>
        <label for="pos3"></label>
      </p>
    </div>
            <div class="Main_section">
              <div class="Main_intro">
              <div class="Main_text">
                <h3 class="Intro_Title">발표 스크립트 번역</h3>
                <p class="Intro_Exp">더 이상 어색한 g 번역은 그만!<br/>인공지능 기반 네이티브 번역을 제공합니다.<br/>
                플루언트는 한/중/일/영/스어 번역을 제공하고 있습니다.</p>
              </div>
              <section class="Main_img">
                <img src="<%=request.getContextPath() %>/resources/images/function1.svg"/>
              </section>
              </div>
              <div class="Main_intro">
              <div class="Main_text">
                <h3 class="Intro_Title">발표 예상시간 측정</h3>
                <p class="Intro_Exp">정해진 시간 안에 사용자가 발표를 진행할 수 있도록<br/>
                플루언트에서는 발표 예상시간을 측정하여 제공합니다.</p>
                <p class="Intro_Exp">플루언트를 사용해보세요.<br/>모든 것이 계획대로 가능해집니다.</p>
              </div>
              <section class="Main_img">
                <img src="<%=request.getContextPath() %>/resources/images/function2.svg"/>
              </section>
              </div>
              <div class="Main_intro">
              <div class="Main_text">
                <h3 class="Intro_Title">발표 네이티브 음성 제공</h3>
                <p class="Intro_Exp">스크립트와 발표 자료만 완벽하면 될까요?<br/>
                외국어 발표에서 가장 중요한 것은 전달입니다.<br/>사용자가 효과적인 전달을 가능하게 하도록<br/>
                인공지능 기반 네이티브 음성을 제공합니다.</p>
                <p class="Intro_Exp">네이티브 음성으로 자연스러운 발표를 연습해보세요!</p>
              </div>
              <section class="Main_img">
                <img src="<%=request.getContextPath() %>/resources/images/3.svg"/>
              </section>
              </div>
            </div>
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