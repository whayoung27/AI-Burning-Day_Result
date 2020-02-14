package com.example.kioskforelders

import android.net.Uri
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import com.example.kioskforelders.data.request.requestMP3
import com.example.kioskforelders.data.response.responseMP3
import com.example.kioskforelders.server.ServiceImplement
import com.example.kioskforelders.server.SingletonData
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.IOException

class OrdersuccessActivity : AppCompatActivity() {

    /** 풀 스크린 만들기 변수 세팅 */
    lateinit var decorView: View
    var uiOption: Int = 0

    override fun onResume() {
        super.onResume()
        deleteStatusBar()
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_ordersuccess)

        /** 주문 성공 음성 요청 (서버 요청) */
        val call: Call<responseMP3> = ServiceImplement.service.requestMP3(requestMP3("감사합니다 주문이 완료되었습니다"))
        call.enqueue(
            object : Callback<responseMP3> {
                override fun onFailure(call: Call<responseMP3>, t: Throwable) {
                    Log.d("MP3서버" , "실패")
                }

                override fun onResponse(
                    call: Call<responseMP3>,
                    response: Response<responseMP3>
                ) {
                    Log.d("MP3서버" , "성공!")
                    Log.d("MP3서버" , response.body().toString())
                    val uri: Uri = Uri.parse(response.body()?.link)

                    try {
                        SingletonData.mediaPlayer.reset()
                        SingletonData.mediaPlayer.setDataSource(this@OrdersuccessActivity, uri)
                        //mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC)
                        SingletonData.mediaPlayer.prepare() //don't use prepareAsync for mp3 playback
                        SingletonData.mediaPlayer.start()
//                        SingletonData.mediaPlayer.setOnCompletionListener {
//                            initNaverRecognizer()
//                            naverRecognizer.getSpeechRecognizer().initialize()
//
//                            if (!naverRecognizer.getSpeechRecognizer().isRunning) {
//                                // Run SpeechRecongizer by calling recognize().
//                                strResult = ""
//                                isEpdTypeSelected = false
//                                naverRecognizer.recognize()
//                            }else{
//                                Log.d(TAG, "stop and wait Final Result")
//                                naverRecognizer.getSpeechRecognizer().stop()
//                            }
//                        }
                    } catch (e: IOException) {
                        SingletonData.mediaPlayer.reset()
                        SingletonData.mediaPlayer.setDataSource(this@OrdersuccessActivity, uri)
                        //mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC)
                        SingletonData.mediaPlayer.prepare() //don't use prepareAsync for mp3 playback
                        SingletonData.mediaPlayer.start()
                        e.printStackTrace()
                    }

                }
            }
        )
    }

    /** 풀 스크린 만들기 */
    private fun deleteStatusBar() {
        decorView = window.decorView
        uiOption = decorView.getSystemUiVisibility()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.ICE_CREAM_SANDWICH)
            uiOption = uiOption or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN)
            uiOption = uiOption or View.SYSTEM_UI_FLAG_FULLSCREEN
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT)
            uiOption = uiOption or View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        decorView.setSystemUiVisibility(uiOption)
    }
}
