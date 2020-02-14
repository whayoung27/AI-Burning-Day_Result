package com.example.kioskforelders

import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentStatePagerAdapter


class FragmentAdapter(fm: FragmentManager) : FragmentStatePagerAdapter(fm){
    override fun getItem(position: Int): Fragment {
        return when (position) {
            0 -> return MenuFragment1()
            1 -> return MenuFragment2()
            2 -> return MenuFragment3()
            else -> null!!
        }

    }

    // 생성할 Fragment의 개수
    override fun getCount(): Int {
        return 3
    }

    override fun destroyItem(container: ViewGroup, position: Int, `object`: Any) {
        super.destroyItem(container, position, `object`)
    }
}