package com.example.kimsuki_naver_ai.Activity;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.cunoraz.tagview.Tag;
import com.cunoraz.tagview.TagView;
import com.example.kimsuki_naver_ai.Adapter.Adapter;
import com.example.kimsuki_naver_ai.Adapter.TodoAdapter;
import com.example.kimsuki_naver_ai.FileChooser;
import com.example.kimsuki_naver_ai.Model.AudioModel;
import com.example.kimsuki_naver_ai.Model.KeywordModel;
import com.example.kimsuki_naver_ai.Model.ScheduleModel;
import com.example.kimsuki_naver_ai.Network.Network;
import com.example.kimsuki_naver_ai.R;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;
import com.yanzhenjie.permission.AndPermission;
import com.yanzhenjie.permission.runtime.Permission;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.security.Key;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import cz.msebera.android.httpclient.Header;


public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private EditText ed_new_tag;
    private TagView added_tag;
    private ArrayList<Tag> tagArrayList = new ArrayList<>();
    private Button btn_add_keyword;
    private Button btn_important_record, btn_today_record, btn_all_record, btn_refresh;
    private LinearLayout layout_home, layout_settings, layout_todo;
    private LinearLayout btn_finder, btn_home, btn_setting, btn_todo;
    private Button btn_recordStart, btn_recordStop;
    private ImageButton btn_record;
    private ListView listview, todo_listview;
    private ArrayList<AudioModel> audioModelArrayList = new ArrayList<>();
    private ArrayList<ScheduleModel> scheduleModelArrayList = new ArrayList<>();
    private TextView cardview_1_title, cardview_1_content, cardview_1_date,
            cardview_2_title, cardview_2_content, cardview_2_date,
            cardview_3_title, cardview_3_content, cardview_3_date,
            cardview_4_title, cardview_4_content, cardview_4_date;
    private Adapter adapter;
    private TodoAdapter todoAdapter;
    private CardView cardview_1, cardview_2, cardview_3, cardview_4;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        bindUI();
        requestPermission();
        tapbarController(1);
        getSchedule();
        getKeywords();

    }

    //UI
    private void bindUI() {
        ed_new_tag = findViewById(R.id.ed_new_tag);

        added_tag = findViewById(R.id.added_tag);
        btn_add_keyword = findViewById(R.id.btn_add_keyword);
        btn_add_keyword.setOnClickListener(this);

        cardview_1_title = findViewById(R.id.cardview_1_title);
        cardview_1_content = findViewById(R.id.cardview_1_content);
        cardview_1_date = findViewById(R.id.cardview_1_date);
        cardview_2_title = findViewById(R.id.cardview_2_title);
        cardview_2_content = findViewById(R.id.cardview_2_content);
        cardview_2_date = findViewById(R.id.cardview_2_date);
        cardview_3_title = findViewById(R.id.cardview_3_title);
        cardview_3_date = findViewById(R.id.cardview_3_date);
        cardview_3_content = findViewById(R.id.cardview_3_content);
        cardview_4_title = findViewById(R.id.cardview_4_title);
        cardview_4_content = findViewById(R.id.cardview_4_content);
        cardview_4_date = findViewById(R.id.cardview_4_date);


        cardview_1 = findViewById(R.id.cardview_1);
        cardview_2 = findViewById(R.id.cardview_2);
        cardview_3 = findViewById(R.id.cardview_3);
        cardview_4 = findViewById(R.id.cardview_4);

        btn_important_record = findViewById(R.id.btn_important_record);
        btn_today_record = findViewById(R.id.btn_today_record);
        btn_all_record = findViewById(R.id.btn_all_record);
        btn_refresh = findViewById(R.id.btn_refresh);

        btn_important_record.setOnClickListener(this);
        btn_today_record.setOnClickListener(this);
        btn_all_record.setOnClickListener(this);
        btn_refresh.setOnClickListener(this);

        layout_home = findViewById(R.id.layout_home);
        layout_settings = findViewById(R.id.layout_settings);
        layout_todo = findViewById(R.id.layout_todo);


        btn_home = findViewById(R.id.btn_home);
        btn_finder = findViewById(R.id.btn_finder);
        btn_record = findViewById(R.id.btn_record);
        btn_todo = findViewById(R.id.btn_todo);
        btn_setting = findViewById(R.id.btn_setting);

        btn_home.setOnClickListener(this);
        btn_finder.setOnClickListener(this);
        btn_record.setOnClickListener(this);
        btn_todo.setOnClickListener(this);
        btn_setting.setOnClickListener(this);

        listview = findViewById(R.id.listview);
        adapter = new Adapter(this, audioModelArrayList);
        listview.setAdapter(adapter);
        listview.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                AudioModel data = audioModelArrayList.get(position);
                if (data.getFile_path() == null) {
                    Toast.makeText(getApplicationContext(), "uri가 널인깝숑", Toast.LENGTH_SHORT).show();
                } else {
                    playAudioFile(data.getFile_path(), String.valueOf(data.getPhoneNumber()), data.getId());
                }
            }
        });
        listview.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                AlertDialog.Builder builder = new AlertDialog.Builder(MainActivity.this);
                builder.setTitle("삭제하기");
                builder.setMessage(audioModelArrayList.get(position).getId() + "롱클릭");
                builder.setCancelable(true);
                builder.setPositiveButton("확인", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {


                    }
                });
                builder.setNegativeButton("취소", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                builder.show();


                return true;
            }
        });


        todo_listview = findViewById(R.id.todo_listview);
        todoAdapter = new TodoAdapter(this, scheduleModelArrayList);
        todo_listview.setAdapter(todoAdapter);
    }

    //FUNCTIONS
    private void requestPermission() {
        AndPermission.with(this)
                .runtime()
                .permission(Permission.READ_EXTERNAL_STORAGE)
                .onGranted(permissions -> {
                    // Storage permission are allowed.
                })
                .onDenied(permissions -> {
                    // Storage permission are not allowed.
                })
                .start();

        AndPermission.with(this)
                .runtime()
                .permission(Permission.WRITE_EXTERNAL_STORAGE)
                .onGranted(permissions -> {
                    // Storage permission are allowed.
                })
                .onDenied(permissions -> {
                    // Storage permission are not allowed.
                })
                .start();

        AndPermission.with(this)
                .runtime()
                .permission(Permission.READ_PHONE_STATE)
                .onGranted(permissions -> {
                    // Storage permission are allowed.
                })
                .onDenied(permissions -> {
                    // Storage permission are not allowed.
                })
                .start();

        AndPermission.with(this)
                .runtime()
                .permission(Permission.RECORD_AUDIO)
                .onGranted(permissions -> {
                    // Storage permission are allowed.
                })
                .onDenied(permissions -> {
                    // Storage permission are not allowed.
                })
                .start();

        AndPermission.with(this)
                .runtime()
                .permission(Permission.CALL_PHONE)
                .onGranted(permissions -> {
                    // Storage permission are allowed.
                })
                .onDenied(permissions -> {
                    // Storage permission are not allowed.
                })
                .start();
    }

    private void getAudioFile() {
        Intent intent_upload = new Intent();
        intent_upload.setType("audio/*");
        intent_upload.setAction(Intent.ACTION_GET_CONTENT);
        startActivityForResult(intent_upload, 1);
    }

    private void playAudioFile(String uriString, String AudioName, int Id) {
        /** open player  */
        Intent intent = new Intent(this, URLMediaPlayerActivity.class);
        intent.putExtra("uriString", uriString);
        intent.putExtra("name", AudioName);
        intent.putExtra("id", Id);
        startActivity(intent);
    }

    private String getFileName(Uri uri) {
        String result = null;
        if (uri.getScheme().equals("content")) {
            Cursor cursor = getContentResolver().query(uri, null, null, null, null);
            try {
                if (cursor != null && cursor.moveToFirst()) {
                    result = cursor.getString(cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME));
                }
            } finally {
                cursor.close();
            }
        }
        if (result == null) {
            result = uri.getPath();
            int cut = result.lastIndexOf('/');
            if (cut != -1) {
                result = result.substring(cut + 1);
            }
        }

        Pattern p = Pattern.compile("\\d{3}-\\d{4}-\\d{4}");
        Matcher m = p.matcher(result);
        while (m.find()) {
            return m.group();
        }
        return result;
    }

    private void navigationBarController(int status) {
        switch (status) {
            case 1:
                layout_home.setVisibility(View.VISIBLE);
                layout_settings.setVisibility(View.GONE);
                layout_todo.setVisibility(View.GONE);
                break;
            case 2:
                layout_home.setVisibility(View.GONE);
                layout_todo.setVisibility(View.VISIBLE);
                layout_settings.setVisibility(View.GONE);
                break;
            case 3:
                layout_home.setVisibility(View.GONE);
                layout_todo.setVisibility(View.GONE);
                layout_settings.setVisibility(View.VISIBLE);
                getKeywords();

                break;
        }

    }

    private void tapbarController(int status) {
        switch (status) {
            case 1:
                btn_all_record.setTypeface(null, Typeface.BOLD);
                btn_today_record.setTypeface(null, Typeface.NORMAL);
                btn_important_record.setTypeface(null, Typeface.NORMAL);
                getVoiceList(false, false);
                Toast.makeText(MainActivity.this, "전체기록을 불러옵니다.", Toast.LENGTH_SHORT).show();

                break;
            case 2:
                btn_all_record.setTypeface(null, Typeface.NORMAL);
                btn_today_record.setTypeface(null, Typeface.BOLD);
                btn_important_record.setTypeface(null, Typeface.NORMAL);
                getVoiceList(true, false);
                Toast.makeText(MainActivity.this, "오늘 불러옵니다.", Toast.LENGTH_SHORT).show();

                break;
            case 3:
                btn_all_record.setTypeface(null, Typeface.NORMAL);
                btn_today_record.setTypeface(null, Typeface.NORMAL);
                btn_important_record.setTypeface(null, Typeface.BOLD);
                getVoiceList(false, true);
                Toast.makeText(MainActivity.this, "중요기록을 불러옵니다.", Toast.LENGTH_SHORT).show();

                break;
        }
    }

    private void populateCardView() {
        for (int i = 0; i < scheduleModelArrayList.size(); i++) {
            ScheduleModel scheduleModel = scheduleModelArrayList.get(i);
            if (i == 0) {
                cardview_1.setVisibility(View.VISIBLE);
                cardview_2.setVisibility(View.GONE);
                cardview_3.setVisibility(View.GONE);
                cardview_4.setVisibility(View.GONE);

                cardview_1_title.setText(scheduleModel.getPhoneNumber());
                cardview_1_content.setText(splitBeforeSemicolon(scheduleModel.getSch_d()) + splitBeforeSemicolon(scheduleModel.getSch_t()) + splitBeforeSemicolon(scheduleModel.getPhoneNumber()));
                cardview_1_date.setText(scheduleModel.getCreatedAt());

            } else if (i == 1) {
                cardview_1.setVisibility(View.VISIBLE);
                cardview_2.setVisibility(View.VISIBLE);
                cardview_3.setVisibility(View.GONE);
                cardview_4.setVisibility(View.GONE);


                cardview_2_title.setText(scheduleModel.getPhoneNumber());
                cardview_2_content.setText(splitBeforeSemicolon(scheduleModel.getSch_d()) + splitBeforeSemicolon(scheduleModel.getSch_t()) + splitBeforeSemicolon(scheduleModel.getPhoneNumber()));
                cardview_2_date.setText(scheduleModel.getCreatedAt());

            } else if (i == 2) {
                cardview_1.setVisibility(View.VISIBLE);
                cardview_2.setVisibility(View.VISIBLE);
                cardview_3.setVisibility(View.VISIBLE);
                cardview_4.setVisibility(View.GONE);


                cardview_3_title.setText(scheduleModel.getPhoneNumber());
                cardview_3_content.setText(splitBeforeSemicolon(scheduleModel.getSch_d()) + splitBeforeSemicolon(scheduleModel.getSch_t()) + splitBeforeSemicolon(scheduleModel.getPhoneNumber()));
                cardview_3_date.setText(scheduleModel.getCreatedAt());

            } else if (i == 3) {
                cardview_1.setVisibility(View.VISIBLE);
                cardview_2.setVisibility(View.VISIBLE);
                cardview_3.setVisibility(View.VISIBLE);
                cardview_4.setVisibility(View.VISIBLE);
                cardview_1_title.setText(scheduleModel.getPhoneNumber());
                cardview_1_content.setText(splitBeforeSemicolon(scheduleModel.getSch_d()) + splitBeforeSemicolon(scheduleModel.getSch_t()) + splitBeforeSemicolon(scheduleModel.getPhoneNumber()));
                cardview_1_date.setText(scheduleModel.getCreatedAt());


                cardview_4_title.setText(scheduleModel.getPhoneNumber());
                cardview_4_content.setText(splitBeforeSemicolon(scheduleModel.getSch_d()) + splitBeforeSemicolon(scheduleModel.getSch_t()) + splitBeforeSemicolon(scheduleModel.getPhoneNumber()));
                cardview_4_date.setText(scheduleModel.getCreatedAt());
            }
        }
    }

    private String splitBeforeSemicolon(String str) {
        String[] summaryArr = str.split(";");
        if (summaryArr.length > 0) {
            return summaryArr[0];
        }
        return str;
    }

    //NETWORK
    private void uploadFile(Uri uri) {
        RequestParams params = new RequestParams();
        File file = new File(FileChooser.getPath(this, uri));
        params.put("file_path", uri.toString());
        params.put("phone", getFileName(uri));
        params.put("createdAt", "2020.2.14 10:11"); //2020.2.11 10:11
        Log.e("phonenumber", getFileName(uri));
        try {
            params.put("voicefile", file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            Log.e("file in parameter", "fail");
        }
        Network.post(this, "/voices", params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                super.onSuccess(statusCode, headers, response);
                Toast.makeText(MainActivity.this, "업로드에 성공했습니다.", Toast.LENGTH_SHORT).show();
                getVoiceList(false, false);
            }

            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);
            }
        });
    }

    private void getVoiceList(boolean today, boolean star) {
        RequestParams params = new RequestParams();
        params.put("today", today);
        params.put("star", star);
        Network.get(this, "/voices", params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                super.onSuccess(statusCode, headers, response);
                try {
                    audioModelArrayList.clear();
                    Gson gson = new Gson();
                    JSONArray value = response;
                    for (int i = 0; i < value.length(); i++) {
                        String jsonstr = value.get(i).toString();
                        AudioModel audioModel = gson.fromJson(jsonstr, AudioModel.class);
                        audioModelArrayList.add(audioModel);
                    }
                    adapter.notifyDataSetChanged();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);
            }
        });//network
    }

    private void getSchedule() {
        RequestParams params = new RequestParams();
        Network.get(this, "/schedules", params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                super.onSuccess(statusCode, headers, response);
                try {
                    scheduleModelArrayList.clear();
                    Gson gson = new Gson();
                    JSONArray value = response;
                    Log.e("value", response.toString());
                    for (int i = 0; i < value.length(); i++) {
                        String jsonstr = value.get(i).toString();
                        ScheduleModel scheduleModel = gson.fromJson(jsonstr, ScheduleModel.class);
                        scheduleModelArrayList.add(scheduleModel);
                    }

                    todoAdapter.notifyDataSetChanged();
                    populateCardView();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);
            }
        });//network
    }

    private void getKeywords() {
        Log.e("getKeyword", "called");
        RequestParams params = new RequestParams();
        Network.get(this, "/keywords", params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
                super.onSuccess(statusCode, headers, response);
                try {
                    tagArrayList.clear();
                    Gson gson = new Gson();
                    JSONArray value = response;
                    Log.e("value", response.toString());
                    for (int i = 0; i < value.length(); i++) {
                        String jsonstr = value.get(i).toString();
                        KeywordModel keywordModel = gson.fromJson(jsonstr, KeywordModel.class);

                        Tag tag = new Tag(keywordModel.getName());
                        tagArrayList.add(tag);
                        tag.layoutColor = Color.parseColor("#D8FCED");
                        tag.tagTextColor = Color.BLACK;
                        Log.e("keyword", tag.toString());
                    }
                    added_tag.addTags(tagArrayList);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);
            }
        });//network

    }

    private void uploadKeyword(String word) {
        RequestParams params = new RequestParams();
        params.put("keyword", word);
        Network.post(this, "/keywords", params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                super.onSuccess(statusCode, headers, response);
                try {
                    Log.e("keyword upload", "succress");

                    getKeywords();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);
            }
        });//network

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                Uri uri = data.getData();
                try {
                    InputStream in = new FileInputStream(FileChooser.getPath(this, uri));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                //the selected audio.
                Uri audioUri = data.getData();
//                playAudioFile(audioUri,"몰라");
//                Log.e("uri string",audioUri.toString());
                uploadFile(audioUri);
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_finder:
                getAudioFile();
                break;
            case R.id.btn_record:
//                if (isRecording) {
//                    // 서비스 종료하기
//                    Log.d("test", "액티비티-서비스 종료버튼클릭");
//                    Intent intent2 = new Intent(
//                            getApplicationContext(),//현재제어권자
//                            MyService.class); // 이동할 컴포넌트
//                    intent2.putExtra("number", "fromButton");
//                    stopService(intent2); // 서비스 종료
//                    isRecording = false;
//                } else {
//                    // 서비스 시작하기
//                    Log.d("test", "액티비티-서비스 시작버튼클릭");
//                    Intent intent1 = new Intent(
//                            getApplicationContext(),//현재제어권자
//                            MyService.class); // 이동할 컴포넌트
//                    intent1.putExtra("number", "fromButton");
//                    startService(intent1); // 서비스 시작
//                    isRecording = true;
//
                Intent callIntent = new Intent(Intent.ACTION_DIAL);
                callIntent.setData(Uri.parse("tel:" + ""));
                startActivity(callIntent);
                break;

            case R.id.btn_home:
                navigationBarController(1);
                break;
            case R.id.btn_todo:
                navigationBarController(2);
                break;
            case R.id.btn_setting:
                navigationBarController(3);
                break;
            case R.id.btn_all_record:
                tapbarController(1);
                break;
            case R.id.btn_today_record:
                tapbarController(2);
                break;
            case R.id.btn_important_record:
                tapbarController(3);
                break;
            case R.id.btn_refresh:
                Toast.makeText(MainActivity.this, "새로고침", Toast.LENGTH_SHORT).show();
                getVoiceList(false, false);
                tapbarController(1);
                getSchedule();
                getKeywords();
            case R.id.btn_add_keyword:
                //태그
                uploadKeyword(ed_new_tag.getText().toString());
                break;
            default:

                break;
        }
    }
}
