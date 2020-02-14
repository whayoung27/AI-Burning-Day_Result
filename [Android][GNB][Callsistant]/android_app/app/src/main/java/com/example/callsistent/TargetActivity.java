package com.example.callsistent;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class TargetActivity extends AppCompatActivity {

    TextView targetTextView, userTextView;
    EditText editText;
    Button btn, btn2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_target);

        targetTextView = (TextView)findViewById(R.id.targetTextView);
        userTextView = (TextView)findViewById(R.id.userTextView);
        editText = (EditText)findViewById(R.id.targetEditText);
        btn = (Button)findViewById(R.id.callButton);
        btn2 = (Button)findViewById(R.id.changeUser);

        Intent mainIntent = getIntent();
        final String user_name = mainIntent.getExtras().getString("user_name");

        userTextView.setText("사용자 이름 : " + user_name);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(getApplicationContext(), WaitActivity.class);
                intent.putExtra("user_name", user_name);
                intent.putExtra("target_name", editText.getText().toString());

                startActivity(intent);
            }
        });

        btn2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences sharedPreferences = getSharedPreferences("USERNAME",MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.clear();
                editor.commit();

                Intent intent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(intent);
                onBackPressed();
            }
        });
    }


}
