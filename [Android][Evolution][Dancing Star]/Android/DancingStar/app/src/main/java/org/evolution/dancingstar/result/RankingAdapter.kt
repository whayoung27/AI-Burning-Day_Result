package org.evolution.dancingstar.result

import android.content.Context
import android.graphics.drawable.Drawable
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import org.evolution.dancingstar.R

class RankingAdapter (val context: Context, val rankinglist: ArrayList<rank>) : BaseAdapter() {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        /* LayoutInflater는 item을 Adapter에서 사용할 View로 부풀려주는(inflate) 역할을 한다. */
        val view: View = LayoutInflater.from(context).inflate(R.layout.listview_ranking, null)

        /* 위에서 생성된 view를 res-layout-places_listview.xml 파일의 각 View와 연결하는 과정이다. */
        val nickname = view.findViewById<TextView>(R.id.rankinglv_tv_nickname)
        val score = view.findViewById<TextView>(R.id.rankinglv_tv_score)
        val play = view.findViewById<ImageView>(R.id.rankinglv_iv_play)

        play.setOnClickListener {
            Log.d("test", "성공")
        }


        val rank = rankinglist[position]
        nickname.text = rank.nickname
        score.text = rank.score

        return view
    }

    override fun getItem(position: Int): Any {

        return rankinglist[position]
    }

    override fun getItemId(position: Int): Long {

        return 0
    }

    override fun getCount(): Int {

        return rankinglist.size
    }

}