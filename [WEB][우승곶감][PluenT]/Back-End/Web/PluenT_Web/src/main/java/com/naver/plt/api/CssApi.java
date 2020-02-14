package com.naver.plt.api;

import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Date;
import java.util.Enumeration;
import java.util.Properties;

@Service
public class CssApi {
	private static final String clientId = "k4axr5p2si";// 애플리케이션 클라이언트 아이디값";
	private static final String clientSecret = "bzHQd76nYQLSpmh13vtrgriCUEiGC8YrUvThXNAf";// 애플리케이션 클라이언트 시크릿값";
	// 경로 이름 (이거는 properties 처리 해주길)
	// private static final String path =
	// "~/mcnl/PluenT/Back-End/Web/PluenT_Web/src/main/webapp/resources/voice/";
	// container : /Users/mcnl/eclipse/java-2019-03/Eclipse.app/Contents/MacOS/
	// /Users/pavankumar/Desktop/Testing/Java.txt

	public String css(String text_ori, String target_lang, String gender) {
//        Properties props = System.getProperties();
//        for(Enumeration en = props.propertyNames(); en.hasMoreElements();) {
//            String key = (String)en.nextElement();
//            String value = props.getProperty(key);
//            System.out.println(key + "=" + value);
//        }

		// String filename = "newFile.txt";
		String copyFilePath = System.getProperty("user.home") + File.separator + "PluenT" + File.separator + "Back-End"
				+ File.separator + "Web" + File.separator + "PluenT_Web" + File.separator + "src" + File.separator
				+ "main" + File.separator + "webapp" + File.separator + "resources" + File.separator + "voice"
				+ File.separator;

		// Server 에 바로 올리는 경우
		String workingDirectory = System.getProperty("user.home") + File.separator + "PluenT" + File.separator
				+ "Back-End" + File.separator + "Web" + File.separator + ".metadata" + File.separator + ".plugins"
				+ File.separator + "org.eclipse.wst.server.core" + File.separator;

		/// Users/mcnl/PluenT/Back-End/Web/.metadata/.plugins/org.eclipse.wst.server.core/

		// ****************//

		try {
			String text = URLEncoder.encode(text_ori, "UTF-8"); // 13자
			String apiURL = "https://naveropenapi.apigw.ntruss.com/voice/v1/tts";
			URL url = new URL(apiURL);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("POST");
			con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
			con.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);
			// speaker choice
			String speaker = choiceSpeaker(target_lang, gender);
			String postParams = "speaker=" + speaker + "&speed=0&text=" + text;

			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(postParams);
			wr.flush();
			wr.close();
			int responseCode = con.getResponseCode();
			BufferedReader br;
			if (responseCode == 200) { // 정상 호출
				// String dirName = "c:/Mydata";
				InputStream is = con.getInputStream();
				int read = 0;
				byte[] bytes = new byte[1024];
				// 랜덤한 이름으로 mp3 파일 생성
				String tempname = Long.valueOf(new Date().getTime()).toString();

				// file creation
				//System.out.println(workingDirectory + tempname);
				File f = new File(workingDirectory + tempname + ".mp3");
				// System.out.println(f.toURI());
				//System.out.println("경로를 포함한 파일이름 - " + f.getAbsolutePath());
				f.createNewFile();

				OutputStream outputStream = new FileOutputStream(f);
				while ((read = is.read(bytes)) != -1) {
					outputStream.write(bytes, 0, read);
				}
				is.close();
			copyFile(workingDirectory + tempname + ".mp3",copyFilePath + tempname + ".mp3");
				return tempname + ".mp3";
			} else {
				// 오류 발생
				br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
				String inputLine;
				StringBuffer response = new StringBuffer();
				while ((inputLine = br.readLine()) != null) {
					response.append(inputLine);
				}
				br.close();

				return response.substring(response.indexOf("message") + 10, response.length() - 3);
			}
		} catch (Exception e) {
			e.printStackTrace();
			return e.toString();
		}
	}

	public static String choiceSpeaker(String target_lang, String gender) {
//    	
//    	"""
//    	speaker : 
//    	mijin : 한국어, 여성 음색
//    	jinho : 한국어, 남성 음색
//    	clara : 영어, 여성 음색
//    	matt : 영어, 남성 음색
//    	shinji : 일본어, 남성 음색
//    	meimei : 중국어, 여성 음색
//    	liangliang : 중국어, 남성 음색
//    	jose : 스페인어, 남성 음색
//    	carmen : 스페인어, 여성 음색
//    	"""
		if (gender.equals("f")) {
			if (target_lang.equals("ko"))
				return "mijin";
			else if (target_lang.equals("en"))
				return "clara";
			else if (target_lang.equals("ja"))
				// 일본
				return "shinji";
			else if (target_lang.equals("zn-CH"))
				// 여자 중국
				return "meimei";
			else if (target_lang.equals("zn-TW"))
				return "meimei";
			else if (target_lang.equals("es"))
				// 여자 스페인
				return "carmen";
		}

		else {
			if (target_lang.equals("ko"))
				// 남자고 한국
				return "jinho";
			else if (target_lang.equals("en"))
				// 남자 영어
				return "matt";
			else if (target_lang.equals("ja"))
				// 남자 일본
				return "shinji";
			else if (target_lang.equals("zn-CH"))
				// 남자 중국
				return "liangliang";
			else if (target_lang.equals("zn-TW"))
				return "liangliang";
			else if (target_lang.equals("es"))
				// 남자 스페인
				return "jose";
		}

		return "";

	}

	public static void copyFile(String oriFilePath, String copyFilePath) {
		// 원본 파일경로
		// String oriFilePath = "D:\\newFolder\\sql.jpg";
		// 복사될 파일경로
		// String copyFilePath = "D:\\newFolder\\sql2.jpg";

		// 파일객체생성
		File oriFile = new File(oriFilePath);
		// 복사파일객체생성
		File copyFile = new File(copyFilePath);

		try {

			FileInputStream fis = new FileInputStream(oriFile); // 읽을파일
			FileOutputStream fos = new FileOutputStream(copyFile); // 복사할파일

			int fileByte = 0;
			// fis.read()가 -1 이면 파일을 다 읽은것
			while ((fileByte = fis.read()) != -1) {
				fos.write(fileByte);
			}
			// 자원사용종료
			fis.close();
			fos.close();

		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
