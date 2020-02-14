package com.example.kimsuki_naver_ai.Activity;

import android.app.Activity;
import android.app.ProgressDialog;
import android.graphics.Color;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import com.cunoraz.tagview.Tag;
import com.cunoraz.tagview.TagView;
import com.example.kimsuki_naver_ai.Model.AudioDetailModel;
import com.example.kimsuki_naver_ai.Network.Network;
import com.example.kimsuki_naver_ai.R;
import com.google.gson.Gson;
import com.loopj.android.http.JsonHttpResponseHandler;
import com.loopj.android.http.RequestParams;

import org.json.JSONObject;

import java.io.IOException;
import java.util.ArrayList;

import cz.msebera.android.httpclient.Header;

public class URLMediaPlayerActivity extends Activity implements View.OnClickListener {
    private TagView tag_view;
    private TextView tv_sum_1, tv_sum_2, tv_sum_3, tv_sum_4, tv_sum_5;
    private ImageView img_sum_1, img_sum_2, img_sum_3, img_sum_4, img_sum_5;
    private TextView tv_fullText;
    private TextView tv_name, tv_date, tv_keyword_time, tv_keyword_date, tv_keyword_place;
    private MediaPlayer mediaPlayer;
    private SeekBar seekBar;
    private ImageButton btn_backward, btn_pause, btn_play, btn_forward;
    private Uri uri;
    private ImageButton btn_back;
    private Handler mHandler = new Handler();
    private Runnable mRunnable = new Runnable() {
        @Override
        public void run() {
            if (mediaPlayer != null) {

                //set max value
                int mDuration = mediaPlayer.getDuration();
                seekBar.setMax(mDuration);

                //update total time text view
                TextView totalTime = (TextView) findViewById(R.id.totalTime);
                totalTime.setText(getTimeString(mDuration));

                //set progress to current position
                int mCurrentPosition = mediaPlayer.getCurrentPosition();
                seekBar.setProgress(mCurrentPosition);

                //update current time text view
                TextView currentTime = (TextView) findViewById(R.id.currentTime);
                currentTime.setText(getTimeString(mCurrentPosition));

                //handle drag on seekbar
                seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {

                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {

                    }

                    @Override
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        if (mediaPlayer != null && fromUser) {
                            mediaPlayer.seekTo(progress);
                        }
                    }
                });
            }
            //repeat above code every second
            mHandler.postDelayed(this, 10);
        }
    };

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // inflate layout
        setContentView(R.layout.activity_media_player);

        // get data from main activity intent
        String uriString = getIntent().getExtras().getString("uriString");
        Uri audioFile = Uri.parse(uriString);
        uri = audioFile;
        String audioName = getIntent().getExtras().getString("name");
        int id = getIntent().getExtras().getInt("id");
        getVoiceInfo(id);

        // setup ui
        bindUI();
        // setup mediaplayer
        setUpMediaPlayer(audioFile, audioName);
    }

    //UI
    private void bindUI() {
        tag_view = findViewById(R.id.tag_group);

        tv_sum_1 = findViewById(R.id.tv_sum_1);
        tv_sum_2 = findViewById(R.id.tv_sum_2);
        tv_sum_3 = findViewById(R.id.tv_sum_3);
        tv_sum_4 = findViewById(R.id.tv_sum_4);
        tv_sum_5 = findViewById(R.id.tv_sum_5);
        img_sum_1 = findViewById(R.id.img_sum_1);
        img_sum_2 = findViewById(R.id.img_sum_2);
        img_sum_3 = findViewById(R.id.img_sum_3);
        img_sum_4 = findViewById(R.id.img_sum_4);
        img_sum_5 = findViewById(R.id.img_sum_5);
        tv_sum_1.setVisibility(View.GONE);
        tv_sum_2.setVisibility(View.GONE);
        tv_sum_3.setVisibility(View.GONE);
        tv_sum_4.setVisibility(View.GONE);
        tv_sum_5.setVisibility(View.GONE);
        img_sum_1.setVisibility(View.GONE);
        img_sum_2.setVisibility(View.GONE);
        img_sum_3.setVisibility(View.GONE);
        img_sum_4.setVisibility(View.GONE);
        img_sum_5.setVisibility(View.GONE);


        tv_fullText = findViewById(R.id.tv_fullText);
        tv_name = findViewById(R.id.tv_name_author);
        tv_date = findViewById(R.id.tv_date_author);
        tv_keyword_time = findViewById(R.id.tv_keyword_time);
        tv_keyword_date = findViewById(R.id.tv_keyword_date);
        tv_keyword_place = findViewById(R.id.tv_keyword_place);

        btn_backward = findViewById(R.id.btn_backward);
        btn_pause = findViewById(R.id.btn_pause);

        btn_play = findViewById(R.id.btn_play);
        btn_play.setVisibility(View.GONE);

        btn_forward = findViewById(R.id.btn_forward);
        btn_back = findViewById(R.id.btn_back);

        btn_backward.setOnClickListener(this);
        btn_pause.setOnClickListener(this);
        btn_play.setOnClickListener(this);
        btn_forward.setOnClickListener(this);
        btn_back.setOnClickListener(this);

    }

    //FUNCTIONS
    private void setUpMediaPlayer(Uri audioFile, String audioName) {
        // create a media player
        mediaPlayer = new MediaPlayer();
        // try to load data and play
        try {
            // give data to mediaPlayer
            mediaPlayer.setDataSource(getApplicationContext(), audioFile);
            // media player asynchronous preparation
            mediaPlayer.prepareAsync();
            // create a progress dialog (waiting media player preparation)
            final ProgressDialog dialog = new ProgressDialog(URLMediaPlayerActivity.this);
            // set message of the dialog
            dialog.setMessage("로딩중입니다.");
            // prevent dialog to be canceled by back button press
            dialog.setCancelable(false);
            // show dialog at the bottom
            dialog.getWindow().setGravity(Gravity.CENTER);
            // show dialog
            dialog.show();
            // display title
            // execute this code at the end of asynchronous media player preparation
            mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                public void onPrepared(final MediaPlayer mp) {
                    //start media player
                    mp.start();
                    // link seekbar to bar view
                    seekBar = (SeekBar) findViewById(R.id.seekBar);
                    //update seekbar
                    mRunnable.run();
                    //dismiss dialog
                    dialog.dismiss();
                }
            });
        } catch (IOException e) {
            Activity a = this;
//            a.finish();
            Toast.makeText(this, "파일을 찾을 수 없습니다.", Toast.LENGTH_SHORT).show();
        }
    }

    public void stop(View view) {
        mediaPlayer.seekTo(0);
        mediaPlayer.pause();
    }

    public void seekForward() {
        //set seek time
        int seekForwardTime = 5000;
        // get current song position
        int currentPosition = mediaPlayer.getCurrentPosition();
        // check if seekForward time is lesser than song duration
        if (currentPosition + seekForwardTime <= mediaPlayer.getDuration()) {
            // forward song
            mediaPlayer.seekTo(currentPosition + seekForwardTime);
        } else {
            // forward to end position
            mediaPlayer.seekTo(mediaPlayer.getDuration());
        }
    }

    public void seekBackward() {
        //set seek time
        int seekBackwardTime = 5000;
        // get current song position
        int currentPosition = mediaPlayer.getCurrentPosition();
        // check if seekBackward time is greater than 0 sec
        if (currentPosition - seekBackwardTime >= 0) {
            // forward song
            mediaPlayer.seekTo(currentPosition - seekBackwardTime);
        } else {
            // backward to starting position
            mediaPlayer.seekTo(0);
        }
    }

    public void onBackPressed() {
        super.onBackPressed();

        if (mediaPlayer != null) {
            mediaPlayer.reset();
            mediaPlayer.release();
            mediaPlayer = null;
        }
        finish();
    }

    private int getImportance(int importance) {
        Log.e("importaoejnef", String.valueOf(importance));
        switch (importance) {
            case 0: //제일 중요함
                return (R.drawable.ic_importance_1);
            case 1:
                return (R.drawable.ic_importance_2);
            case 2:
                return (R.drawable.ic_importance_3);
            case 3:
                return (R.drawable.ic_importance_4);
            case 4:
                return (R.drawable.ic_importance_5);
            default:
                break;
        }

        return (R.drawable.ic_arrow_left);

    }

    private String getTimeString(long millis) {
        StringBuffer buf = new StringBuffer();

        long hours = millis / (1000 * 60 * 60);
        long minutes = (millis % (1000 * 60 * 60)) / (1000 * 60);
        long seconds = ((millis % (1000 * 60 * 60)) % (1000 * 60)) / 1000;

        buf
                .append(String.format("%02d", hours))
                .append(":")
                .append(String.format("%02d", minutes))
                .append(":")
                .append(String.format("%02d", seconds));

        return buf.toString();
    }

    //NETWORK
    private void getVoiceInfo(int id) {
        Log.e("getVoiceInfo", "called");
        RequestParams params = new RequestParams();
        Network.get(this, "/voices/" + id, params, new JsonHttpResponseHandler() {
            @Override
            public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
                super.onSuccess(statusCode, headers, response);
                try {
                    Log.e("success response", response.toString());
                    Gson gson = new Gson();
                    JSONObject value = response;
                    String jsonstr = value.toString();

                    AudioDetailModel audioDetailModel = gson.fromJson(jsonstr, AudioDetailModel.class);

                    if (audioDetailModel.getTags().length == 0) {
                        Toast.makeText(URLMediaPlayerActivity.this, "오디오 처리중입니다. 잠시 뒤 시도해 주세요", Toast.LENGTH_SHORT).show();
                        finish();
                    }


                    tv_name.setText(audioDetailModel.getFile_name());
                    tv_date.setText(audioDetailModel.getUpdatedAt());
                    tv_keyword_time.setText(audioDetailModel.getSch_t());
                    tv_keyword_date.setText(audioDetailModel.getSch_d());
                    tv_keyword_place.setText(audioDetailModel.getSch_p());
                    tv_fullText.setText(audioDetailModel.getScript());

                    //요약받기
                    String summary = audioDetailModel.getSummary();
                    Log.e("summary", summary);

                    String[] summaryArr = summary.split(";");
                    for (int i = 0; i < summaryArr.length; i++) {
                        System.out.println(summaryArr[i]);
                        if (i == 0) {
                            tv_sum_1.setText(summaryArr[i].substring(2));
                            img_sum_1.setBackgroundResource(R.drawable.ic_importance_5);

                            tv_sum_1.setVisibility(View.VISIBLE);
                            img_sum_1.setVisibility(View.VISIBLE);

                        } else if (i == 1) {
                            tv_sum_2.setText(summaryArr[i].substring(2));
                            img_sum_2.setBackgroundResource(getImportance(Integer.parseInt(String.valueOf(summaryArr[i].charAt(0)))));

                            tv_sum_2.setVisibility(View.VISIBLE);
                            img_sum_2.setVisibility(View.VISIBLE);
                        } else if (i == 2) {
                            tv_sum_3.setText(summaryArr[i].substring(2));
                            img_sum_3.setBackgroundResource(getImportance(Integer.parseInt(String.valueOf(summaryArr[i].charAt(0)))));

                            tv_sum_3.setVisibility(View.VISIBLE);
                            img_sum_3.setVisibility(View.VISIBLE);
                        } else if (i == 3) {
                            tv_sum_4.setText(summaryArr[i].substring(2));
                            img_sum_4.setBackgroundResource(getImportance(Integer.parseInt(String.valueOf(summaryArr[i].charAt(0)))));

                            tv_sum_4.setVisibility(View.VISIBLE);
                            img_sum_4.setVisibility(View.VISIBLE);
                        } else if (i == 4) {
                            tv_sum_5.setText(summaryArr[i].substring(2));
                            img_sum_5.setBackgroundResource(getImportance(Integer.parseInt(String.valueOf(summaryArr[i].charAt(0)))));

                            tv_sum_5.setVisibility(View.VISIBLE);
                            img_sum_5.setVisibility(View.VISIBLE);
                        }
                    }
                    //태그
                    ArrayList<Tag> tagArrayList = new ArrayList<>();
                    for (int i = 0; i < audioDetailModel.getTags().length; i++) {
                        Log.e("tag", audioDetailModel.getTags()[i].getName());
                        Tag tag = new Tag(audioDetailModel.getTags()[i].getName());
                        tagArrayList.add(tag);
                        tag.layoutColor = Color.parseColor("#D8FCED");
                        tag.tagTextColor = Color.BLACK;
                    }
                    tag_view.addTags(tagArrayList);


//  0_펜 션 예약 하려 하는데 1박에 얼마인가요 기분 하루 8만원이야 바베큐 장은 이용하면 얼마예요;
//  2_1 인에 2 만원씩 추가 하시면 됩니다;
//  1_이번 주 토요일에 1박 하고 싶은데 예약 할까요 네 가능해요;
//  3_퇴실 시간은 언제나 오전 11시에요 결제는 삼성 페 이 되나요 네 제자들께야;


                } catch (Exception e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onFailure(int statusCode, Header[] headers, Throwable throwable, JSONObject errorResponse) {
                super.onFailure(statusCode, headers, throwable, errorResponse);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);
            }

            public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                super.onFailure(statusCode, headers, responseString, throwable);
                Log.d("Failed: ", "" + statusCode);
                Log.d("Error : ", "" + throwable);

            }
        });//network
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_play:
                mediaPlayer.start();
                btn_play.setVisibility(View.GONE);
                btn_pause.setVisibility(View.VISIBLE);
                break;
            case R.id.btn_pause:
                mediaPlayer.pause();
                btn_play.setVisibility(View.VISIBLE);
                btn_pause.setVisibility(View.GONE);
                break;
            case R.id.btn_forward:
                seekForward();
                break;
            case R.id.btn_backward:
                seekBackward();
                break;
            case R.id.btn_back:
                finish();
                break;
            default:
                break;
        }
    }
}