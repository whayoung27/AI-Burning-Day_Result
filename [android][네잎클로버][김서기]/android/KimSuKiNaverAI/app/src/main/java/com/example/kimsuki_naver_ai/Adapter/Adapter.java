package com.example.kimsuki_naver_ai.Adapter;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.example.kimsuki_naver_ai.Model.AudioModel;
import com.example.kimsuki_naver_ai.R;

import java.util.ArrayList;

public class Adapter extends BaseAdapter {

    private ArrayList<AudioModel> arrayList = new ArrayList<>();
    private Activity activity;
    private LayoutInflater myInflater;
    private int type;

    public Adapter(Activity act, ArrayList<AudioModel> arrayList) {
        this.arrayList = arrayList;
        this.activity = act;
        myInflater = (LayoutInflater) act.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        this.type = type;
    }

    @Override
    public int getCount() {
        return arrayList.size();
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder v;
        if (convertView == null) {
            convertView = myInflater.inflate(R.layout.listview_item, null);
            v = new ViewHolder();
            v.tv_name = convertView.findViewById(R.id.tv_name);
            v.tv_date = convertView.findViewById(R.id.tv_date);
            v.tv_tag_1 = convertView.findViewById(R.id.tv_tag_1);
            v.tv_tag_2 = convertView.findViewById(R.id.tv_tag_2);
            v.tv_tag_3 = convertView.findViewById(R.id.tv_tag_3);
            v.tv_tag_4 = convertView.findViewById(R.id.tv_tag_4);
            v.layout_tags = convertView.findViewById(R.id.layout_tags);
            v.layout_no_tags = convertView.findViewById(R.id.layout_no_tags);

            convertView.setTag(v);
        } else {
            v = (ViewHolder) convertView.getTag();
        }

        AudioModel item = arrayList.get(position);
        v.tv_name.setText(item.getPhoneNumber());
        v.tv_date.setText(item.getDate());

        if (item.getTags().length == 0){
            v.layout_tags.setVisibility(View.GONE);
            v.layout_no_tags.setVisibility(View.VISIBLE);
        }else{
            v.layout_tags.setVisibility(View.VISIBLE);
            v.layout_no_tags.setVisibility(View.GONE);
        }
        for (int i = 0; i < item.getTags().length; i++) {
            if (i == 0){
                v.tv_tag_1.setText(item.getTags()[0].getName());
            }else if (i == 1){
                v.tv_tag_2.setText(item.getTags()[1].getName());
            }else if (i == 2){
                v.tv_tag_3.setText(item.getTags()[2].getName());
            }else if (i == 3){
                v.tv_tag_4.setText(item.getTags()[3].getName());
            }
        }

        return convertView;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public Object getItem(int position) {
        return arrayList.get(position);

    }

    public void filterList(ArrayList<AudioModel> filteredList) {
        arrayList = filteredList;
        notifyDataSetChanged();
    }

    public ArrayList<AudioModel> getFilteredArray() {
        return arrayList;
    }

    public static class ViewHolder {
        public TextView tv_name;
        public TextView tv_date;
        public TextView tv_tag_1, tv_tag_2, tv_tag_3, tv_tag_4;
        public LinearLayout layout_tags,layout_no_tags;


    }

}
