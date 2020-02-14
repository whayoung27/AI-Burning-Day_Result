package com.naver.plt;

import org.jsoup.Jsoup;

import org.jsoup.nodes.Document;

import org.jsoup.select.Elements;

import com.naver.plt.api.UtilApi;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

import java.net.URL;
import java.util.List;
 
public class jsoup_test {

	public static void main(String[] args) throws IOException {
		
		
		UtilApi ua = new UtilApi();
		String s = ua.checkSpellKo("아버지가방에들어가신다. 외안대, 감기 빨리 낳으세요.");
		System.out.println(s);

//		try {
//
//		//웹에서 내용을 가져온다.
//
//		Document doc = Jsoup.connect("http://jobc.tistory.com/").get();
//
//		//내용 중에서 원하는 부분을 가져온다.
//
//		Elements contents = doc.select(".class #id");
//
//		//원하는 부분은 Elements형태로 되어 있으므로 이를 String 형태로 바꾸어 준다.
//
//		String text = contents.text();
//
//		System.out.println(text);
//
//		} catch (IOException e) { //Jsoup의 connect 부분에서 IOException 오류가 날 수 있으므로 사용한다.   
//
//		e.printStackTrace();
//
//		}
		
		
		
		

	}

}
