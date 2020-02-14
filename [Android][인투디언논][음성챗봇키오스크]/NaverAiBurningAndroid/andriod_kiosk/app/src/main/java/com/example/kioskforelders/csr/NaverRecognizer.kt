package com.example.kioskforelders.csr

import android.content.Context
import android.content.Intent
import android.os.Handler
import android.os.Message
import android.util.Log
import android.view.Menu
import android.view.View
import androidx.annotation.WorkerThread
import androidx.core.content.ContextCompat.startActivity
import com.example.kioskforelders.MenuActivity
import com.example.kioskforelders.OrdercheckActivity
import com.example.kioskforelders.OrdersuccessActivity
import com.example.kioskforelders.R
import com.example.kioskforelders.data.request.requestOrder
import com.example.kioskforelders.data.response.responseOrder
import com.example.kioskforelders.server.ServiceImplement
import com.example.kioskforelders.server.SingletonData
import com.naver.speech.clientapi.SpeechConfig
import com.naver.speech.clientapi.SpeechConfig.EndPointDetectType
import com.naver.speech.clientapi.SpeechConfig.LanguageType
import com.naver.speech.clientapi.SpeechRecognitionException
import com.naver.speech.clientapi.SpeechRecognitionListener
import com.naver.speech.clientapi.SpeechRecognitionResult
import com.naver.speech.clientapi.SpeechRecognizer
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

//import retrofit2.Retrofit


class NaverRecognizer : SpeechRecognitionListener{

    private val TAG = NaverRecognizer::class.java.simpleName
    private var mHandler: Handler? = null
    lateinit var mRecognizer: SpeechRecognizer
    lateinit var csrResult: String
    var context: Context
    lateinit var checkOrderData: responseOrder

    constructor(context: Context, handler: Handler, clientId: String) {
        this.mHandler = handler
        this.context = context
        try {
            mRecognizer = SpeechRecognizer(context, clientId)
        } catch (e: SpeechRecognitionException) {

            // 예외가 발생하는 경우는 아래와 같습니다.
            //   1. activity 파라미터가 올바른 MainActivity의 인스턴스가 아닙니다.
            //   2. AndroidManifest.xml에서 package를 올바르게 등록하지 않았습니다.
            //   3. package를 올바르게 등록했지만 과도하게 긴 경우, 256바이트 이하면 좋습니다.
            //   4. clientId가 null인 경우
            //
            // 개발하면서 예외가 발생하지 않았다면 실서비스에서도 예외는 발생하지 않습니다.
            // 개발 초기에만 주의하시면 됩니다.
            e.printStackTrace()
        }

        mRecognizer.setSpeechRecognitionListener(this)

    }


    fun getSpeechRecognizer(): SpeechRecognizer {
        return mRecognizer
    }

    fun recognize() {
        try {
            mRecognizer.recognize(
                SpeechConfig(
                    LanguageType.KOREAN,
                    EndPointDetectType.AUTO
                )
            )
        } catch (e: SpeechRecognitionException) {
            e.printStackTrace()
        }
    }

    @WorkerThread
    override fun onResult(finalResult: SpeechRecognitionResult?) {
        Log.d(TAG, "Final Result!! (" + finalResult?.results?.get(0) + ")")
        val msg = Message.obtain(mHandler, R.id.finalResult, finalResult)
        msg.sendToTarget()
        csrResult = finalResult?.results?.get(0).toString()
        Log.d("chohee", "서버 녹음 전")

    }

    @WorkerThread
    override fun onReady() {
        Log.d(TAG, "Event occurred : Ready")
        val msg = Message.obtain(mHandler, R.id.clientReady)
        msg.sendToTarget()
    }

    @WorkerThread
    override fun onEndPointDetected() {
        Log.d(TAG, "Event occurred : EndPointDetected")
    }

    @WorkerThread
    override fun onPartialResult(partialResult: String?) {
        Log.d(TAG, "Partial Result!! ($partialResult)")
        val msg = Message.obtain(mHandler, R.id.partialResult, partialResult)
        msg.sendToTarget()
    }

    @WorkerThread
    override fun onInactive() {
        Log.d(TAG, "Event occurred : Inactive")
        val msg = Message.obtain(mHandler, R.id.clientInactive)
        msg.sendToTarget()

        /** 사용자 발성 완료 후 CSR로 추출된 텍스트를 서버로 보내기 (서버 통신)
         * --> body에 userId와 CSR로 추출된 데이터를 보냄 *****************************/
        val call: Call<responseOrder> = ServiceImplement.service.requestOrder(requestOrder(
            SingletonData.userId, csrResult
        ))
        call.enqueue(
            object : Callback<responseOrder>{
                override fun onFailure(call: Call<responseOrder>, t: Throwable) {
                    Log.d("requestOrder 서버 통신 ", "실패")
                }
                override fun onResponse(
                    call: Call<responseOrder>,
                    response: Response<responseOrder>
                ) {
                    Log.d("requestOrder 서버 통신 ", "성공")

                    // 최종 주문 여부 확인일 경우
                    if(response.body()?.status == "Ok"){
                        SingletonData.mediaPlayer.setOnCompletionListener {  }
                        val intent = Intent(context, OrdersuccessActivity::class.java)
                        context.startActivity(intent)
                    }else if(response.body()?.status == "Return"){
                        SingletonData.menuReturn = true
                        val intent = Intent(context, MenuActivity::class.java)
                        context.startActivity(intent)
                    }else{
                        SingletonData.menu0 = response.body()?.menu0.toString()
                        SingletonData.count0 = response.body()?.count0
                        SingletonData.price0 = response.body()?.price0
                        SingletonData.menu1 = response.body()?.menu1.toString()
                        Log.i("checkMenu",SingletonData.menu1);
                        if(SingletonData.equals(null)){
                            Log.i("check","이거슨 널");
                        }
                        SingletonData.count1 = response.body()?.count1
                        SingletonData.price1 = response.body()?.price1
                        SingletonData.total = response.body()?.total
                        val intent = Intent(context, OrdercheckActivity::class.java)
                        context.startActivity(intent)
                    }
                }
            }
        )
        /**********************************************************************************/
    }

    @WorkerThread
    override fun onRecord(speech: ShortArray?) {
        Log.d(TAG, "Event occurred : Record")
        val msg = Message.obtain(mHandler, R.id.audioRecording, speech)
        msg.sendToTarget()
    }

    @WorkerThread
    override fun onError(errorCode: Int) {
        Log.d(TAG, "Error!! (" + Integer.toString(errorCode) + ")")
        val msg = Message.obtain(mHandler, R.id.recognitionError, errorCode)
        msg.sendToTarget()
    }

    @WorkerThread
    override fun onEndPointDetectTypeSelected(epdType: EndPointDetectType?) {
        Log.d(TAG, "EndPointDetectType is selected!! (" + epdType?.toInteger()?.let {
            Integer.toString(
                it
            )
        } + ")")
        val msg = Message.obtain(mHandler, R.id.endPointDetectTypeSelected, epdType)
        msg.sendToTarget()
    }

}