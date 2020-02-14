package com.example.kioskforelders.server

import android.media.MediaPlayer
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object SingletonData {

    // 유저 아이디 값
    var userId: Int? = -1

    // 미디어 플레이어
    val mediaPlayer = MediaPlayer()

    // 주문 확인 데이터
    var menu0: String?= ""   //버거 종료
    var count0: Int? = -1    //버거 개수
    var price0: Int? = -1    //버거 가격
    var menu1: String? = ""  //음료 종료
    var count1: Int? = -1    //음료 개수
    var price1: Int? = -1    //음료 가격
    var total: Int? = -1     //전체 가격

    // 메뉴 리턴시 사용값
    var menuReturn = false
}

