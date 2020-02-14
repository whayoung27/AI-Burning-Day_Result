package com.example.kimsuki_naver_ai.Network;

import android.app.Activity;

import com.example.kimsuki_naver_ai.Useful;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.AsyncHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import java.util.Locale;

public class Network {
    public static String BASE_URL = "http://49.50.165.233";

    private static AsyncHttpClient client = new AsyncHttpClient();

    public static void get(Activity act, String url, RequestParams params, AsyncHttpResponseHandler responseHandler) {
        if(Useful.isNetworkConnected(act) == false){
            Useful.showAlertDialog(act, "알림", "네트워크에 연결되어 있지 않습니다.\n네트워크 연결 후 다시 시도해 주세요.");
            return;
        }
        client.get(BASE_URL + url, params, responseHandler);
    }

    public static void post(Activity act, String url, RequestParams params, AsyncHttpResponseHandler responseHandler) {
        if(Useful.isNetworkConnected(act) == false){
            Useful.showAlertDialog(act, "알림", "네트워크에 연결되어 있지 않습니다.\n네트워크 연결 후 다시 시도해 주세요.");
            return;
        }
        if(params!=null){
            String countryCode = Locale.getDefault().getCountry();
            params.put("country_code", countryCode);
            params.put("order_device", "pos");
        }
        client.setURLEncodingEnabled(false);
        client.post(BASE_URL + url, params, responseHandler);
    }

}
