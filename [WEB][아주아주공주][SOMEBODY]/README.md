
# NAVER AI_Burning_Day 2020  
**미션** : 제공하는 **네이버 클라우드 플랫폼 API**를 활용한 앱 또는 웹 개발 

---

### <아주아주공주> 팀 : 김우정, 박태훈, 김희아
# SomeBody 

**프로젝트 소개**
사용자의 몸 동작을 **Pose Estimation API**를 이용해 좌표로 환산하여 음악으로 만들어주는 서비스	

**구현 기능 1. 음악 생성**
- 사전에 신체 부위 별로 음악 할당
	- Beat 
		 - 0 : 머리 - crash
		 - 1 : 배 - hat
		 - 3 : 오른팔꿈치 - tom
		 - 4 : 오른팔 - kick
		 - 6 : 왼쪽팔꿈치 - snare
		 - 7 : 왼팔 - bongo
		 - 9 : 오른쪽무릎 - clap
		 - 10 : 오른발 - cow bell
		 - 12 : 왼쪽무릎 - maracas
		 - 13 : 왼쪽발 - rid
	- Melody : 블루스 스케일 (도 - 미 플랫 - 파 - 파 샾 - 솔 - 시 플랫 - 도)
	
	
- 몸의 좌표 값이 가장 많이 변화한 신체 부위에 할당된 Beat와 
  전체 좌표 값 평균과 비교한 한 프레임의 평균 값에 의해 결정되는 Melody를 합성하여 새로운 음원 생성 
	- [Beat + Beat] + [Melody]  = new 음악
- 생성된 음원과 원래의 비디오가 합쳐져 새로운 뮤직비디오로 재탄생

**구현 기능 2. 사운드 로그 생성**
- 사용자의 몸짓 변화량이 활발한 (크게 변화한) 부위를 셈하여 분석 제공
	- 변화량이 활발할 것 같은 5개의 신체부위에 대한 analysis summary
- 사용자의 몸짓 변화량의 총량에 따른 분류



### 일정
<table class="tbl_schedule">
  <tr>
    <th style="text-align:left;width:50%">일정</th>
    <th style="text-align:center;width:15%">날짜</th>
    <th style="text-align:left;width:35%">비고</th>
  </tr>
  <tr>
    <td>
      <strong>참가 접수</strong><br>
    </td>
    <td style="text-align:center">~1월/20(월)</td>
    <td>
      누구나
    </td>
  </tr>
  <tr>
    <td>
      <strong>예선</strong><br>
    </td>
    <td style="text-align:center">1/21(화)~1/31(금)</td>
    <td>
      기획안 제출 + 코딩 테스트<br>
      (추후 안내 예정)
    </td>
  </tr>
  <tr>
    <td>
      <strong>본선 진출자 발표</strong><br>
    </td>
    <td style="text-align:center"> 2/5(월)</td>
    <td>
      최대 30팀 선발<br>
    </td>
  </tr>
   <tr>
    <td>
      <strong>본선 진출자 사전미팅</strong><br>
    </td>
    <td style="text-align:center"> 2월 둘째주 중</td>
    <td>
      with 멘토/운영진<br>
    </td>
  </tr>
   <tr>
    <td>
      <strong>2박 3일 본선</strong><br>
    </td>
    <td style="text-align:center">2/13(목)~2/15(토)</td>
    <td>
      우승팀 혜택 제공<br>
    </td>
  </tr>
</table>


### 진행 방식 및 심사 기준

#### 참가 신청

* 일정 : ~ 2020/1/20
* 참가팀 및 팀원 지원서 접수 
* 참가 신청해주신 모든 지원자의 서류 및 지원서 검토

#### 예선 
* 일정 : 2020/1/21~1/31
* 약 2주간 코딩테스트 및 기획안 제출 
* 코딩테스트 결과 및 기획안 검토를 통하여 본선 진출팀(**30팀**) 선발
* 결과 발표 : 2020/2/5(개별안내)

#### 본선(2박3일)
* 일정 : 2020/2/13~2/15
* 2박 3일간 춘천 네이버 커넥트원에서 진행 
* 현장에서 해커톤 진행, 심사위원 평가 및 시상이 진행될 예정입니다. 
* 본선 상세 일정 및 진행사항 관련해서는 본선 진출자에 한하여 개별 안내드립니다. 
> ※ 개발조건에 부합하지 않은 결과물은 우수팀 선발과정에서 불이익이 있을 수 있습니다.

#### 심사 기준
* 독창성(30%) : 얼마나 독창적인 기술 혹은 아이디어인가 
* 기술성(50%) : 기술구현에 있어서 얼마나 난이도가 있는가 
* 프로젝트 운영(20%) : 얼마나 체계적으로 구성하여 개발을 진행하는가 <br>
**서비스의 완성도 보다는 프로젝트 기술 완성도를 중점적으로 평가합니다.**

#### ※ 참가 규칙 
* 타 대회에서 수상한 적이 없는 코드여야 합니다.(미 수상작은 개선하여 참가 가능) 
* 외부 코드 사용시 라이선스(저작권 등 지식재산권 침해) 문제가 없는 코드여야 하며 사용내역을 명시해야 합니다.
* 지적재산권 침해 및 기밀정보가 포함된 작품은 제출할 수 없습니다. 


### 시상 및 혜택

* 총 상금 1000만원
* 우수 참가자 중 네이버 클로바 및 네이버클라우드플랫폼(NCP) 입사 지원시, 서류전형 면제(6개월 이내 지원 시)
* 본선 진출자에게는 티셔츠 등의 기념품 증정

<table class="tbl_awards">
  <tr>
    <th style="text-align:left;width:50%">1등</th>
    <th style="text-align:center;width:15%">2등</th>
    <th style="text-align:left;width:35%">3등</th>
  </tr>
  <tr>
    <td>
      500만원<br>
    </td>
    <td style="text-align:center">300만원</td>
    <td>
      200만원
    </td>
  </tr>
 </table>

