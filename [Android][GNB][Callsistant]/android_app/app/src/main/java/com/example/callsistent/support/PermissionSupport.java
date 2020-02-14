package com.example.callsistent.support;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.util.ArrayList;
import java.util.List;

public class PermissionSupport {

    private Context context;
    private Activity activity;

    // 요청할 권한을 배열로 저장해주었습니다.
    private String[] permissions = {
            Manifest.permission.USE_SIP,
            Manifest.permission.INTERNET,
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.READ_EXTERNAL_STORAGE,
            Manifest.permission.WRITE_EXTERNAL_STORAGE
    };

    private List permissionList;

    // 이 부분은 권한 요청을 할 때 발생하는 창에 대한 결과값을 받기 위해 지정해주는 int 형입니다.
    // 본인에 맞게 숫자를 지정하시면 될 것 같습니다.
    private final int MULTIPLE_PERMISSIONS = 1023;

    // 생성자에서 Activity와 Context를 파라미터로 받았습니다.
    public PermissionSupport(Activity _activity, Context _context){
        this.activity = _activity;
        this.context = _context;
    }

    // 허용 받아야할 권한이 남았는지 체크
    public boolean checkPermission(){
        int result;
        permissionList = new ArrayList<>();

        // 위에서 배열로 선언한 권한 중 허용되지 않은 권한이 있는지 체크
        for(String pm : permissions){
            result = ContextCompat.checkSelfPermission(context, pm);
            if(result != PackageManager.PERMISSION_GRANTED){
                permissionList.add(pm);
            }
        }

        if(!permissionList.isEmpty()){
            return false;
        }
        return true;
    }

    // 권한 허용 요청
    public void requestPermission(){
        ActivityCompat.requestPermissions(activity, (String[]) permissionList.toArray(new String[permissionList.size()]), MULTIPLE_PERMISSIONS);
    }

    // 권한 요청에 대한 결과 처리
    public boolean permissionResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults){

        // 우선 requestCode가 아까 위에 final로 선언하였던 숫자와 맞는지, 결과값의 길이가 0보다는 큰지 먼저 체크했습니다.
        if(requestCode == MULTIPLE_PERMISSIONS && (grantResults.length > 0)){
            for(int i=0; i < grantResults.length ; i++){
                //grantResults 가 0이면 사용자가 허용한 것이고 / -1이면 거부한 것입니다.
                // -1이 있는지 체크하여 하나라도 -1이 나온다면 false를 리턴해주었습니다.
                if(grantResults[i] == -1){
                    return false;
                }
            }
        }
        return true;
    }
}


