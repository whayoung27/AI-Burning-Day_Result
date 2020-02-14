package com.naver.plt;

import com.naver.plt.api.NmtApi;

public class nmt_test {

	public static void main(String[] args) {
		NmtApi a = new NmtApi();
		//nmt(String text_ori,  String origin_lang, String target_lang)
		String result = a.nmt("안녕하세요.저는 발표자입니다.", "ko", "en");
		System.out.println(result);
	}

}
