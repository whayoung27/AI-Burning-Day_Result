package com.naver.plt;

import com.naver.plt.api.CssApi;

public class css_test {

	public static void main(String[] args) {
		CssApi api = new CssApi();
		String c = api.css("Hi, i am a presenter","한", "f");
		System.out.println(c);

	}

}
