package org.evolution.dancingstar.result

import android.app.Activity
import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import kotlinx.android.synthetic.main.activity_result.*
import org.evolution.dancingstar.R
import org.evolution.dancingstar.dance.DanceActivity
import org.evolution.dancingstar.main.MainActivity
import org.json.JSONObject
import java.lang.reflect.Method
import com.android.volley.Response
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley

class ResultActivity : AppCompatActivity() {

    lateinit var rankingAdapter: RankingAdapter

    val ranking = arrayListOf<rank>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_result)


        rankingAdapter = RankingAdapter(this, ranking)
        listview_ranking.adapter = rankingAdapter
        val myJson = JSONObject()
        val requestBody = myJson.toString()

        // TODO

        //score 가져오기
        /*val url = "http://10.83.32.245:9090/score"

        val testRequest = object : StringRequest(Method.GET, url ,
                Response.Listener { response ->
                    var json_response = JSONObject(response)
                    if(json_response["status"].toString() == "200"){

                        var resultarr = json_response.getJSONArray("response")
                        var result = resultarr.getJSONObject(0)

                        result_tv_accuracyscore.text = result.getInt("accuracyScore").toString()
                        result_tv_consistencyscore.text = result.getInt("consistencyScore").toString()
                        result_tv_confidencyscore.text = result.getInt("faceScore").toString()
                        result_tv_vibescore.text = result.getInt("gazeScore").toString()
                        result_tv_comboscore.text = result.getInt("comboScore").toString()
                        result_tv_totalscore.text = result.getInt("totalScore").toString()


                    }else{
                        Toast.makeText(this, json_response["message"].toString(), Toast.LENGTH_SHORT).show()
                    }

                }, Response.ErrorListener { error ->
            Log.d("ERROR", "서버 Response 가져오기 실패: $error")

        }) {
            override fun getBodyContentType(): String {
                return "application/json; charset=utf-8"
            }
            override fun getBody(): ByteArray {
                return requestBody.toByteArray()
            }
        }

        Volley.newRequestQueue(this).add(testRequest)*/



        // ranking 띄우기


        val rankingurl = "http://10.83.32.245:9090/ranking"

        val testRequest2 = object : StringRequest(Method.GET, rankingurl ,
                Response.Listener { response ->
                    var json_response = JSONObject(response)
                    if(json_response["status"].toString() == "200"){

                        var resultarr = json_response.getJSONArray("response")

                        for (i in 0..3){
                            var result = resultarr.getJSONObject(i)
                            var name = result.getString("nickName")
                            var score = result.getInt("totalScore").toString()
                            var videopath = result.getString("userVideoPath")

                            var temp = rank(nickname = name, score = score)

                            ranking.add(temp)
                            Log.d("this", "$temp")
                        }

                        rankingAdapter.notifyDataSetChanged();
                    }else{
                        Toast.makeText(this, json_response["message"].toString(), Toast.LENGTH_SHORT).show()
                    }

                }, Response.ErrorListener { error ->
            Log.d("ERROR", "서버 Response 가져오기 실패: $error")

        }) {
            override fun getBodyContentType(): String {
                return "application/json; charset=utf-8"
            }
            override fun getBody(): ByteArray {
                return requestBody.toByteArray()
            }
        }

        Volley.newRequestQueue(this).add(testRequest2)


        /*var temp = ranking(nickname = "competitor", score = "2938")
        ranking.add(temp)
        ranking.add(temp)
        ranking.add(temp)
        ranking.add(temp)
        ranking.add(temp)
        ranking.add(temp)
        ranking.add(temp)*/





        result_btn_retry.setOnClickListener {
            var intent = Intent(this, DanceActivity::class.java)
            startActivity(intent)
        }

        result_btn_reselect.setOnClickListener {
            var intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

    }
}