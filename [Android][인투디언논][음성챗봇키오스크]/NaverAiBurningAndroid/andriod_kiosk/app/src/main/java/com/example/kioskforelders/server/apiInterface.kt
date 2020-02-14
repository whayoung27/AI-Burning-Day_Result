package com.example.kioskforelders.server

import com.example.kioskforelders.data.request.requestFinal
import com.example.kioskforelders.data.request.requestMP3
import com.example.kioskforelders.data.request.requestOrder
import com.example.kioskforelders.data.response.responseFinal
import com.example.kioskforelders.data.response.responseMP3
import com.example.kioskforelders.data.response.responseOrder
import com.example.kioskforelders.data.response.responseStart
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST

interface apiInterface {
    // userId 요청
    @GET("/first")
    fun requestrUserId(): Call<responseStart>

    //CSR 추출 텍스트 보내기
    @POST("/send")
    fun requestOrder(@Body body: requestOrder): Call<responseOrder>

    //MP3 파일 요청
    @POST("/tts")
    fun requestMP3(@Body body: requestMP3) : Call<responseMP3>

    //마지막 주문 확인 요청
    @POST("/final")
    fun requestFinal(@Body body: requestFinal) : Call<responseFinal>

    //주문 여부 확인 요청
    @POST("/final/check")
    fun requestOrderWant(@Body body: requestFinal) : Call<responseFinal>
}