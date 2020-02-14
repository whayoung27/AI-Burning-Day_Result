package org.evolution.dancingstar.nickname

import android.content.Context

class MyPreference (context: Context){

    val preference_name = ""

    val preference = context.getSharedPreferences(preference_name, Context.MODE_PRIVATE)

    fun getUsername() : String{
        var name =preference.getString(preference_name, "")
        return name

    }

    fun setUsername(username:String) : String{
        val editor = preference.edit()
        editor.putString(preference_name, username)
        editor.apply()
        return ""

    }



}