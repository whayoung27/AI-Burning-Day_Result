package com.example.callsistent;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class WaitActivity extends AppCompatActivity {

    static InputStream is;
    static OutputStream os;

    TextView textView;
    Button btn;
    Socket client;
    String userName;
    String targetName;

    boolean state = true;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_wait);


        btn = (Button) findViewById(R.id.exit_Call);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
                state = false;
            }
        });

        textView = (TextView) findViewById(R.id.call_wait_text);
        textView.setText("통화 연결중");

        Intent mainIntent = getIntent();
        userName = mainIntent.getExtras().getString("user_name");
        targetName = mainIntent.getExtras().getString("target_name");
        new Thread() {
            public void run() {
                try {
                    client = new Socket("49.50.166.178", 3306);
                    is = client.getInputStream();
                    os = client.getOutputStream();
                    os.write(userName.getBytes());
                    os.flush();
                    new WaitThread().start();

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }.start();

    }

    class WaitThread extends Thread {
        public void run() {
            while (state) {
                byte[] b = new byte[256];
                try {
                    is.read(b);
                    String result = new String(b);

                    if (!result.substring(0,userName.length()).equals(userName)){
                        state = false;
                        Intent intent = new Intent(getApplicationContext(), CallActivity.class);
                        intent.putExtra("user_name", userName);
                        intent.putExtra("target_name", targetName);
                        startActivity(intent);

                    }

                    os.write(userName.getBytes());
                    os.flush();

                    sleep(1000);


                } catch (IOException e) {
                    System.out.println("메세지 수신 오류");
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

