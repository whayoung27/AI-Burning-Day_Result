package org.evolution.dancingstar.nickname

import android.content.Intent
import android.support.v7.app.AppCompatActivity
import android.os.Bundle
import kotlinx.android.synthetic.main.activity_nickname.*
import org.evolution.dancingstar.R
import org.evolution.dancingstar.main.MainActivity

class nickname : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_nickname)

        val myPreference = MyPreference(this)

        name_btn_start.setOnClickListener {
            myPreference.setUsername(name_et_name.text.toString())

            var intent = Intent(this, MainActivity::class.java)
            startActivity(intent)
        }

    }
}
