package org.evolution.dancingstar.splash;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import org.evolution.dancingstar.R;
import org.evolution.dancingstar.main.MainActivity;
import org.evolution.dancingstar.nickname.nickname;

public class SplashActivity extends AppCompatActivity {

    private int SPLASH_TIME = 1000;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        new Thread() {
            public void run() {
                try {
                    sleep(SPLASH_TIME);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } finally {
                    Intent intent = new Intent(getApplicationContext(), nickname.class);
                    startActivity(intent);
                    finish();
                }
            }
        }.start();
    }
}
