package com.example.kimsuki_naver_ai.Adapter;

import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;


import com.example.kimsuki_naver_ai.Model.ScheduleModel;
import com.example.kimsuki_naver_ai.R;

import java.util.ArrayList;

public class TodoAdapter extends BaseAdapter {

    private ArrayList<ScheduleModel> arrayList = new ArrayList<>();
    private Activity activity;
    private LayoutInflater myInflater;
    private int type;

    public TodoAdapter(Activity act, ArrayList<ScheduleModel> arrayList) {
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
        TodoAdapter.ViewHolder v;
        if (convertView == null) {
            convertView = myInflater.inflate(R.layout.todo_listview_item, null);
            v = new TodoAdapter.ViewHolder();
            v.tv_name_todo = convertView.findViewById(R.id.tv_name_todo);
            v.tv_content_todo = convertView.findViewById(R.id.tv_content_todo);
            v.tv_date_todo = convertView.findViewById(R.id.tv_date_todo);
            convertView.setTag(v);
        } else {
            v = (TodoAdapter.ViewHolder) convertView.getTag();
        }
        ScheduleModel scheduleModel = arrayList.get(position);
        v.tv_name_todo.setText(scheduleModel.getPhoneNumber());
        String str = scheduleModel.getSch_d() + scheduleModel.getSch_t() + scheduleModel.getSch_p();
        v.tv_content_todo.setText(str);
        v.tv_date_todo.setText(scheduleModel.getCreatedAt());

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


    public static class ViewHolder {
        public TextView tv_name_todo;
        public TextView tv_content_todo;
        public TextView tv_date_todo;


    }

}
