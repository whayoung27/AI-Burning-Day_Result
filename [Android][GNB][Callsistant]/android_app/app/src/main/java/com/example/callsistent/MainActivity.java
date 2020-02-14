package com.example.callsistent;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.callsistent.support.PermissionSupport;


public class MainActivity extends AppCompatActivity {

    TextView textView;
    EditText editText;
    Button btn;
    private PermissionSupport permission;
    private Thread workerThread = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        permissionCheck();

        SharedPreferences getUserName = getSharedPreferences("USERNAME", MODE_PRIVATE);
        String UserName = getUserName.getString("UserName",""); // Username이 없으면 물어보기

        if (!UserName.isEmpty()){
            onBackPressed();  // 해당 레이아웃 처리 효과

            // 사용자 이름을 저장합니다.

            Toast.makeText(getApplicationContext(), "안녕하세요. "+UserName+"님!", Toast.LENGTH_LONG).show();
            Intent intent = new Intent(getApplicationContext(), TargetActivity.class);
            intent.putExtra("user_name", UserName);
            onBackPressed();  // 해당 레이아웃 처리 효과

            startActivity(intent);
        }

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        textView = (TextView)findViewById(R.id.mainTextView);
        editText = (EditText)findViewById(R.id.mainEditText);
        btn = (Button)findViewById(R.id.loginButton);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();  // 해당 레이아웃 처리 효과
                // 사용자 이름을 저장합니다.

                Intent intent = new Intent(getApplicationContext(), TargetActivity.class);
                intent.putExtra("user_name", editText.getText().toString());

                startActivity(intent);
            }
        });
    }

    private void permissionCheck() {

        // SDK 23버전 이하 버전에서는 Permission이 필요하지 않습니다.
        if (Build.VERSION.SDK_INT >= 23) {
            // 방금 전 만들었던 클래스 객체 생성
            permission = new PermissionSupport(this, this);

            // 권한 체크한 후에 리턴이 false로 들어온다면
            if (!permission.checkPermission()) {
                // 권한 요청을 해줍니다.
                permission.requestPermission();
            }
        }
    }

    protected void onStop() {
        super.onStop();

        // Activity가 종료되기 전에 저장한다.
        // SharedPreferences를 sFile이름, 기본모드로 설정
        SharedPreferences sharedPreferences = getSharedPreferences("USERNAME",MODE_PRIVATE);

        // 저장을 하기위해 editor를 이용하여 값을 저장시켜준다.
        SharedPreferences.Editor editor = sharedPreferences.edit();

        // 사용자가 입력한 저장할 데이터
//        editor.putString("text",text); // key, value를 이용하여 저장하는 형태
        //다양한 형태의 변수값을 저장할 수 있다.
        //editor.putString();
        //editor.putBoolean();
        //editor.putFloat();
        //editor.putLong();
        //editor.putInt();
        //editor.putStringSet();

        editor.putString("UserName", editText.getText().toString());

        //최종 커밋
        editor.commit();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        // 여기서도 리턴이 false로 들어온다면 (사용자가 권한 허용을 거부하였다면)
        if(!permission.permissionResult(requestCode, permissions, grantResults)){
            // 저의 경우는 여기서 다시 Permission 요청을 걸었습니다.
            permission.requestPermission();
        }
    }
}