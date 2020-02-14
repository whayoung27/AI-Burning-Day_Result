## 환경세팅

1. Web.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="2.5" xmlns="http://java.sun.com/xml/ns/javaee"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee https://java.sun.com/xml/ns/javaee/web-app_2_5.xsd">
	<!-- 한글깨짐 해결, POST 방식으로 전달 한 한글이 깨지는 경우 -->
	<filter>
		<filter-name>encodingFilter</filter-name>
		<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
		<init-param>
			<param-name>encoding</param-name>
			<param-value>UTF-8</param-value>
		</init-param>
	</filter>
	
	<filter-mapping>
		<filter-name>encodingFilter</filter-name>
		<url-pattern>/*</url-pattern>
	</filter-mapping>
	<!-- The definition of the Root Spring Container shared by all Servlets and Filters -->
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>
		/WEB-INF/spring/root-context.xml
		/WEB-INF/spring/mybatis-spring.xml</param-value>
	</context-param>
	
	<!-- Creates the Spring Container shared by all Servlets and Filters -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>

	<!-- Processes application requests -->
	<servlet>
		<servlet-name>appServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
			<param-name>contextConfigLocation</param-name>
			<param-value>/WEB-INF/spring/appServlet/servlet-context.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
		
	<servlet-mapping>
		<servlet-name>appServlet</servlet-name>
		<url-pattern>/</url-pattern>
	</servlet-mapping>

</web-app>

```

2. pom.xml

   ```xml
   	<properties>
   		<java-version>1.8</java-version>
   		<org.springframework-version>4.3.18.RELEASE</org.springframework-version>
   		<org.aspectj-version>1.6.10</org.aspectj-version>
   		<org.slf4j-version>1.6.6</org.slf4j-version>
   	</properties>
   
   
   <!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
   		<dependency>
   			<groupId>org.springframework</groupId>
   			<artifactId>spring-jdbc</artifactId>
   			<version>4.3.18.RELEASE</version>
   		</dependency>
   
   		<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis-spring -->
   		<dependency>
   			<groupId>org.mybatis</groupId>
   			<artifactId>mybatis-spring</artifactId>
   			<version>1.3.2</version>
   		</dependency>
   
   
   		<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
   		<dependency>
   			<groupId>org.mybatis</groupId>
   			<artifactId>mybatis</artifactId>
   			<version>3.4.6</version>
   		</dependency>
   
   ```

   

3. 파일 추가 (jquery, jython, ojdbc)

   build path configuration 에서 추가하는 것

   ![lib추가](../images/lib추가.png)

4. 업로드 파일, 서버와 바로 동기화 하는 방법 : apache tomcat 실행했을때의 , server 파일에 sever.xml에 설정을 추가하면 된다.

```xml

      <Context docBase="PluenT_Web" path="/plt" reloadable="true" source="org.eclipse.jst.jee.server:PluenT_Web"/>
      <Context path="/plt/resources/voice" reloadable="true" docBase="/Users/mcnl/PluenT/Back-End/Web/.metadata/.plugins/org.eclipse.wst.server.core/" />

```

