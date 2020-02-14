package com.naver.plt.api;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;

import org.springframework.stereotype.Service;

@Service
public class NmtApi {

	private static final String clientId = "k4axr5p2si";// 애플리케이션 클라이언트 아이디값"
	private static final String clientSecret = "bzHQd76nYQLSpmh13vtrgriCUEiGC8YrUvThXNAf";// 애플리케이션 클라이언트 시크릿값";

	public String nmt(String text_ori,  String origin_lang, String target_lang) {
		try {
			String text = URLEncoder.encode(text_ori, "UTF-8");
			String apiURL = "https://naveropenapi.apigw.ntruss.com/nmt/v1/translation";
			URL url = new URL(apiURL);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("POST");
			con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
			con.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);
			// post request
			String postParams = "source="+origin_lang+"&target="+target_lang+"&text=" + text;
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(postParams);
			wr.flush();
			wr.close();
			int responseCode = con.getResponseCode();
			BufferedReader br;
			String inputLine;
			StringBuffer response = new StringBuffer();
			String result;
			if (responseCode == 200) { // 정상 호출
				br = new BufferedReader(new InputStreamReader(con.getInputStream()));
				while ((inputLine = br.readLine()) != null) {
					response = new StringBuffer(inputLine);
				}
				result =
						response.substring(response.indexOf("translatedText")+17,response.length()-4);
				
			} else { // 오류 발생
				br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
				inputLine = br.readLine();
				response.append(inputLine);
				result =
						response.substring(2,response.indexOf("errorCode")-3);
			}

			br.close();
			return result;
		} catch (Exception e) {
			return e.toString();
		}

	}
}
