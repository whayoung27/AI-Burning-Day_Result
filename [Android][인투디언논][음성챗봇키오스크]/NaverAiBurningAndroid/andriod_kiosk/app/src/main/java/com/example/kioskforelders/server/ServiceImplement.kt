package com.example.kioskforelders.server

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ServiceImplement {

    private const val BASE_URL = "https://9162eaa9.ngrok.io"
    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    val service: apiInterface = retrofit.create(apiInterface::class.java)

}