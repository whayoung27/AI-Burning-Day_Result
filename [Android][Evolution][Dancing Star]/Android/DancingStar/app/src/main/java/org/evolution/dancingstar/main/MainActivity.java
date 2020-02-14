package org.evolution.dancingstar.main;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.evolution.dancingstar.R;
import org.evolution.dancingstar.dance.DanceActivity;
import org.evolution.dancingstar.learn.LearnActivity;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private ArrayList<Dance> mDanceList;
    private LinearLayout mLayoutVideo;
    private ImageView mIvAlbum;
    private TextView mTvTitle, mTvArtist, mTvBestScore, mTvWinner;
    private Button mBtnLearn, mBtnDance;
    private String danceTitle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mLayoutVideo = findViewById(R.id.main_layout_video);
        mIvAlbum = findViewById(R.id.main_iv_album);
        mTvTitle = findViewById(R.id.main_tv_title);
        mTvArtist = findViewById(R.id.main_tv_artist);
        mTvBestScore = findViewById(R.id.main_tv_best_score);
        mTvWinner = findViewById(R.id.main_tv_winner);

        mBtnLearn = findViewById(R.id.main_btn_learn);
        mBtnDance = findViewById(R.id.main_btn_dance);

        mDanceList = new ArrayList<>();
        mDanceList.add(new Dance("달라달라","ITZY",R.drawable.album_cover_dalladalla));
        mDanceList.add(new Dance("가시나","선미",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("CHEER UP","트와이스(TWICE)",R.drawable.album_cover_cheer_up));
        mDanceList.add(new Dance("Psycho","레드벨벳",R.drawable.album_cover_psycho));
        mDanceList.add(new Dance("캔디","H.O.T",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래","지코(ZICO)",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래2","지코(ZICO)2",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래3","지코(ZICO)3",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래4","지코(ZICO)4",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래5","지코(ZICO)5",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래","지코(ZICO)",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래2","지코(ZICO)2",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래3","지코(ZICO)3",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래4","지코(ZICO)4",R.drawable.album_cover_gasina));
        mDanceList.add(new Dance("아무노래5","지코(ZICO)5",R.drawable.album_cover_gasina));

        RecyclerView danceRecyclerView = findViewById(R.id.main_recycler_dance);
        LinearLayoutManager linearLayoutManager = new LinearLayoutManager(this);
        danceRecyclerView.setLayoutManager(linearLayoutManager);
        DanceAdapter danceAdapter = new DanceAdapter(mDanceList);
        danceRecyclerView.setAdapter(danceAdapter);
        danceAdapter.setOnItemClickListener(new DanceAdapter.OnItemClickListener() {
            @Override
            public void onItemClick(View v, int pos) {
                mIvAlbum.setImageResource(mDanceList.get(pos).getImage());
                mTvTitle.setText(mDanceList.get(pos).getTitle());
                mTvArtist.setText(mDanceList.get(pos).getArtist());
                mLayoutVideo.setVisibility(View.VISIBLE);
                danceTitle = mDanceList.get(pos).getTitle();
            }
        });

        mBtnLearn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(danceTitle.equals(""))
                    Toast.makeText(MainActivity.this, "노래를 선택해주세요.", Toast.LENGTH_SHORT).show();
                else {
                    Intent intent = new Intent(MainActivity.this,LearnActivity.class);
                    startActivity(intent);
                }
            }
        });

        mBtnDance.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(danceTitle.equals(""))
                    Toast.makeText(MainActivity.this, "노래를 선택해주세요.", Toast.LENGTH_SHORT).show();
                else {
                    Intent intent = new Intent(MainActivity.this,DanceActivity.class);
                    startActivity(intent);
                }
            }
        });

    }
}
