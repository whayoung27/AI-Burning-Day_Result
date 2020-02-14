package org.evolution.dancingstar.learn;

import android.Manifest;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.TextureView;
import android.widget.ProgressBar;
import android.widget.Toast;
import android.widget.VideoView;

import org.evolution.dancingstar.R;

public class LearnActivity extends AppCompatActivity {

    private VideoView mVideoView;
    private TextureView mTextureView;
    private Preview mPreview;
    private ProgressBar progressBar;
    private int progressSeconds, progressMinutes;
    static final int REQUEST_CAMERA = 1;
    private Thread thread;
    private Handler handler = new Handler();
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_learn);

        mVideoView = findViewById(R.id.learn_video_view);
        mTextureView = findViewById(R.id.learn_texture_view);
        mPreview = new Preview(this, mTextureView);

        progressBar = findViewById(R.id.learn_progress_bar);

        final long duration = ((long)16000);
        final int minuetes = (int) (duration / 1000 / 60);
        final int seconds = (int) ((duration / 1000) % (60));
        progressBar.setMax(minuetes*60+seconds);

        progressMinutes = 0;
        progressSeconds = -1;

        thread = new Thread(new Runnable() {
            public void run() {
                while ((progressMinutes * 60 + progressSeconds) < (minuetes * 60 + seconds)) {
                    progressSeconds += 1;
                    if (progressSeconds == 60) {
                        progressMinutes++;
                        progressSeconds = 0;
                    }
                    handler.post(new Runnable() {
                        public void run() {
                            progressBar.setProgress(progressMinutes * 60 + progressSeconds);
                        }
                    });
                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                finish();
            }
        });

        playVideo();

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case REQUEST_CAMERA:
                for (int i=0;i<permissions.length;i++){
                    String permission = permissions[i];
                    int grantResult = grantResults[i];
                    if (permission.equals(Manifest.permission.CAMERA)) {
                        if(grantResult == PackageManager.PERMISSION_GRANTED){
                            mTextureView = findViewById(R.id.learn_texture_view);
                            mPreview = new Preview(this, mTextureView);
                        } else {
                            Toast.makeText(this, "Should have camera permission to run", Toast.LENGTH_SHORT).show();
                            finish();
                        }
                    }
                }
                break;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        mPreview.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        mPreview.onPause();
    }

    public void playVideo() {

        String path = "android.resource://org.evolution.dancingstar/"+R.raw.dance_example;

        Uri uri = Uri.parse(path);

        mVideoView.setVideoURI(uri);
        mVideoView.start();

        thread.start();
    }

}
