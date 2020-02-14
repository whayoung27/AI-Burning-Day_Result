package com.example.kioskforelders


import android.content.Intent
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.view.View
import com.example.kioskforelders.data.request.requestMP3
import com.example.kioskforelders.data.response.responseMP3
import com.example.kioskforelders.data.response.responseStart
import com.example.kioskforelders.server.ServiceImplement
import com.example.kioskforelders.server.SingletonData
import com.example.kioskforelders.server.SingletonData.mediaPlayer
import kotlinx.android.synthetic.main.activity_main.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.IOException


class MainActivity : AppCompatActivity() {

    /** 풀 스크린 만들기 변수 세팅 */
    lateinit var decorView: View
    var uiOption: Int = 0

    override fun onResume() {
        super.onResume()
        deleteStatusBar() // onCreate 전에 풀 스크린 세팅하기

    }


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val call: Call<responseMP3> = ServiceImplement.service.requestMP3(requestMP3("안녕하세요 반갑습니다 화면을 눌러주세요"))
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
                        mediaPlayer.reset()
                        mediaPlayer.setDataSource(this@MainActivity, uri)
                        mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC)
                        mediaPlayer.prepare() //don't use prepareAsync for mp3 playback
                        mediaPlayer.start()
                    } catch (e: IOException) {
                        e.printStackTrace()
                    }
                }
            }
        )


        /** 화면 터치시 메뉴 화면으로 넘기기 */
        layout_mainActivity_total.setOnClickListener {

            // 유저 아이디 요청 (서버 통신)
            val call: Call<responseStart> = ServiceImplement.service.requestrUserId()
            call.enqueue(
                object : Callback<responseStart> {
                    override fun onFailure(call: Call<responseStart>, t: Throwable) {
                        Log.d("서버 통신 성공 여부" , "실패")
                    }

                    override fun onResponse(
                        call: Call<responseStart>,
                        response: Response<responseStart>
                    ) {
                        Log.d("서버 통신 성공 여부" , "성공!")
                        Log.d("chohee", response.body()?.id.toString())
                        SingletonData.userId = response.body()?.id
                    }
                }
            )
            var intent = Intent(this, MenuActivity::class.java)
            startActivity(intent)
        }

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
