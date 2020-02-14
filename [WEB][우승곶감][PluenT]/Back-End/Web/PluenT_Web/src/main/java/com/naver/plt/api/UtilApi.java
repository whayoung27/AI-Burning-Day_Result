package com.naver.plt.api;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

import java.net.URL;
import java.util.List;

public class UtilApi {
	//def findLastIdx(text):
//        pre_i = 0
//        while True:
//            idx = text.find("."or"!"or"?")
//            if idx >= 0 and idx+pre_i <= 500:
//                pre_i += idx
//                text = text[idx+1:]
//            else:
//                break
//        return pre_i+1
		
	public int findLastIdx(String ori_text) {
		
		int pre_i = 0;
		int idx = 0;
		while (true) {
			idx = (ori_text.indexOf(".") < 0 )? ori_text.indexOf(".") : 501;
			if( ori_text.indexOf("?") < 0  ) {
				idx = (ori_text.indexOf("?") < idx )? ori_text.indexOf("?") :idx;
			}
			if( ori_text.indexOf("!") < 0  ) {
				idx = (ori_text.indexOf("!") < idx )? ori_text.indexOf("?") :idx;
			}
			
			if(idx==501) {
				idx = -1 ;
			}
			if(idx > -1 && idx+pre_i <=500) {
				pre_i += idx;
				ori_text = ori_text.substring(idx+1);
			}
			else {
				break;
			}
			
		}
		return pre_i+1;
			
		
	}
	
	public String checkSpellKo(String ori_text) throws IOException {
		StringBuilder checkedText;
		if (ori_text.length() < 500)
			return getCorrectedKo(ori_text);
		else {
			checkedText = new StringBuilder();
			while (true) {
				int idx = findLastIdx(ori_text);
				if (idx <= 1)
					break;
				checkedText.append( checkSpellKo(ori_text.substring(0, idx)));
				ori_text = ori_text.substring(idx);
			}
		}
		return checkedText.toString();
	}

	public String checkSpellKo(List<StringBuilder> ori_list) throws IOException {
		StringBuilder checkedText = new StringBuilder();
		for (StringBuilder s : ori_list) {

			String checked = checkSpellKo(s.toString());
			checkedText.append(checked);

		}
		return checkedText.toString();

	}

	public String getCorrectedKo(String q) throws IOException {

		try {
			String callback = "jQuery112404813373148364377_1581593168003";
			String apiURL = "https://m.search.naver.com/p/csearch/ocontent/util/SpellerProxy?_callback=" + callback
					+ "&q=" + q + "&where=nexearch&color_blindness=0&_=1581593168005";
			URL url = new URL(apiURL);
			HttpURLConnection con = (HttpURLConnection) url.openConnection();
			con.setRequestMethod("GET");
			con.setDoOutput(true);
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			// wr.writeBytes(postParams);
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
				result = response.substring(response.indexOf("translatedText") + 17, response.length() - 4);

			} else { // 오류 발생
				br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
				inputLine = br.readLine();
				response.append(inputLine);
				//result = response.substring(2, response.indexOf("errorCode") - 3);
				return response.toString();
			}

			br.close();
			return result;
		} catch (Exception e) {
		e.printStackTrace();
			return e.toString();
		}

	}
}
