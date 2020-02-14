package com.example.callsistent;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.text.Editable;
import android.text.TextWatcher;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Switch;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.callsistent.process.CsrProc;
import com.example.callsistent.process.CssProc;
import com.example.callsistent.utils.AudioWriterPCM;
import com.naver.speech.clientapi.SpeechRecognitionResult;

import java.io.IOException;
import java.lang.ref.WeakReference;
import java.net.Socket;

import static com.example.callsistent.WaitActivity.is;
import static com.example.callsistent.WaitActivity.os;


public class CallActivity extends AppCompatActivity {

    int beforeLen;
    boolean state = true;

    EditText editTextSend;
    TextView textView;
    Button btnSend;
    Button callExit;

    Socket client;
    String userName;

    // CSS
    Switch cssSwitch;

    // CSR
    private static final String TAG = CallActivity.class.getSimpleName();
    private RecognitionHandler handler;
    private CsrProc naverRecognizer;
    private TextView txtResult;
    private Button btnStart;
    private String mResult;
    private AudioWriterPCM writer;
    private String targetName;

    // CSR : Handle speech recognition Messages.
    private void handleMessage(Message msg) {
        switch (msg.what) {
            case R.id.clientReady: // 음성인식 준비 가능
                txtResult.setText("Connected");
                writer = new AudioWriterPCM(Environment.getExternalStorageDirectory().getAbsolutePath() + "/NaverSpeechTest");
                writer.open("Test");
                break;
            case R.id.audioRecording:
                writer.write((short[]) msg.obj);
                break;
            case R.id.partialResult:
                mResult = (String) (msg.obj);
                txtResult.setText(mResult);
                break;
            case R.id.finalResult: // 최종 인식 결과
                SpeechRecognitionResult speechRecognitionResult = (SpeechRecognitionResult) msg.obj;
                mResult = speechRecognitionResult.getResults().get(0);
                txtResult.setText(mResult);
                break;
            case R.id.recognitionError:
                if (writer != null) {
                    writer.close();
                }
                mResult = "Error code : " + msg.obj.toString();
                txtResult.setText(mResult);
                btnStart.setText(R.string.str_start);
                btnStart.setEnabled(true);
                break;
            case R.id.clientInactive:
                if (writer != null) {
                    writer.close();
                }
                btnStart.setText(R.string.str_start);
                btnStart.setEnabled(true);
                break;
        }
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_call);

        Intent mainIntent = getIntent();
        userName = mainIntent.getExtras().getString("user_name");
        targetName = mainIntent.getExtras().getString("target_name");

        // CSS : onCreate

        textView = findViewById(R.id.text_view);
        btnSend = findViewById(R.id.btn_send);
        editTextSend = findViewById(R.id.editTextSend);
        callExit = findViewById(R.id.endCall);

        textView.setMovementMethod(new ScrollingMovementMethod());

        callExit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                state = false;
                onBackPressed();
            }
        });

        SharedPreferences sharedPref = getSharedPreferences("PREF", Context.MODE_PRIVATE);
        final String clientId = "j22tulxuc5";
        final String clientSecret = "vqxi5iceEKf5aPNqhcVGLKFfNnouvDFBzRBm6T4C";

        cssSwitch = findViewById(R.id.switch_css);

        Spinner s = (Spinner)findViewById(R.id.spinner_css_lang);
        s.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view,
                                       int position, long id) {

                Spinner s = (Spinner)findViewById(R.id.spinner_css_lang);
                TextView textViewVersionInfo = (TextView) findViewById(R.id.text_view);
                textViewVersionInfo.setText("");

            }
            @Override
            public void onNothingSelected(AdapterView<?> parent) {}
        });


        // CSR : onCreate

        txtResult = (TextView) findViewById(R.id.editTextSend);
        btnStart = (Button) findViewById(R.id.btn_start);
        handler = new RecognitionHandler(this);
        naverRecognizer = CsrProc.getCsrProc(this, clientId);
        naverRecognizer.setHandler(handler);

        btnStart.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                if (!naverRecognizer.getSpeechRecognizer().isRunning()) {
                    mResult = "";
                    txtResult.setText("Connecting...");
                    btnStart.setText(R.string.str_stop);
                    naverRecognizer.recognize();
                } else {
                    Log.d(TAG, "stop and wait Final Result");
                    btnStart.setEnabled(false);
                    naverRecognizer.getSpeechRecognizer().stop();
                }
            }
        });


        // Sockect : onCreate

        new ClientThread().start();

        btnSend.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final String msg = "[" + userName + "]" + editTextSend.getText().toString();
                new Thread() {
                    public void run() {
                        try {
                            os.write(msg.getBytes());
                            os.flush();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }.start();
                editTextSend.setText("");

                if (cssSwitch.isChecked()) {
                    TextView cssInputText = findViewById(R.id.text_view);
                    String strText = cssInputText.getText().toString();

                    Spinner spinner = (Spinner) findViewById(R.id.spinner_css_lang);
                    String selItem = spinner.getSelectedItem().toString();

                    String[] splits = selItem.split("\\(");

                    String speaker = splits[0];

                    if (speaker.isEmpty() || speaker.equals("")) {
                        speaker = "mijin";
                    }

                    NaverTTSTask tts = new NaverTTSTask();

                    tts.execute(strText.substring(beforeLen), speaker, clientId, clientSecret);
                    beforeLen = strText.length();
                }
            }
        });

        textView.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

            }

            @Override

            public void onTextChanged(CharSequence s, int start, int before, int count) {

                if (cssSwitch.isChecked()) {
                    TextView cssInputText = findViewById(R.id.text_view);
                    String strText = cssInputText.getText().toString();

                    Spinner spinner = (Spinner) findViewById(R.id.spinner_css_lang);
                    String selItem = spinner.getSelectedItem().toString();

                    String[] splits = selItem.split("\\(");

                    String speaker = splits[0];

                    if (speaker.isEmpty() || speaker.equals("")) {
                        speaker = "mijin";
                    }

                    NaverTTSTask tts = new NaverTTSTask();

                    tts.execute(strText.substring(beforeLen), speaker, clientId, clientSecret);
                    beforeLen = strText.length();

                }
            }

            @Override
            public void afterTextChanged(Editable s) {

            }

        });

        btnStart.addTextChangedListener(new TextWatcher() {

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {

            }

            @Override
            public void afterTextChanged(Editable arg0) {
                if (!editTextSend.getText().toString().equals("Connecting...") && !editTextSend.getText().toString().equals("Connected")) {
                    final String msg = "[" + userName + "]" + editTextSend.getText().toString();
                    new Thread() {
                        public void run() {
                            try {
                                os.write(msg.getBytes());
                                os.flush();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    }.start();
                    editTextSend.setText("");

                    if (cssSwitch.isChecked()) {
                        TextView cssInputText = findViewById(R.id.text_view);
                        String strText = cssInputText.getText().toString();

                        Spinner spinner = (Spinner) findViewById(R.id.spinner_css_lang);
                        String selItem = spinner.getSelectedItem().toString();

                        String[] splits = selItem.split("\\(");

                        String speaker = splits[0];

                        if (speaker.isEmpty() || speaker.equals("")) {
                            speaker = "mijin";
                        }

                        NaverTTSTask tts = new NaverTTSTask();

                        tts.execute(strText.substring(beforeLen), speaker, clientId, clientSecret);
                        beforeLen = strText.length();
                    }
                }

                // 입력이 끝났을 때

            }

            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {

                // 입력하기 전에

            }

        });


    }

    // CSR : methods
    @Override
    protected void onStart() {
        System.out.println("시작!!!");
        super.onStart(); // 음성인식 서버 초기화는 여기서
        naverRecognizer.getSpeechRecognizer().initialize();
    }
    @Override
    protected void onResume() {
        super.onResume();
        mResult = "";
        txtResult.setText("");
        btnStart.setText(R.string.str_start);
        btnStart.setEnabled(true);
    }
    @Override
    protected void onStop() {
        System.out.println("CSR 종료!!!");
        super.onStop(); // 음성인식 서버 종료
        naverRecognizer.getSpeechRecognizer().release();
    }


    // CSS
    public class NaverTTSTask extends AsyncTask<String, String, String> {

        @Override
        public String doInBackground(String... strings) {

            CssProc.main(strings[0], strings[1], strings[2], strings[3]);
            return null;
        }
    }

    // CSR
    static class RecognitionHandler extends Handler {
        private final WeakReference<CallActivity> mActivity;
        RecognitionHandler(CallActivity activity) {
            mActivity = new WeakReference<>(activity);
        }
        @Override
        public void handleMessage(Message msg) {
            CallActivity activity = mActivity.get();
            if (activity != null) {
                activity.handleMessage(msg);
            }
        }
    }


    // Socket
    class ClientThread extends Thread {
        public void run() {
            String newResult;
            while (state) {
                byte[] b = new byte[256];
                try {
                    is.read(b);
                    String result = new String(b);
                    newResult = "";

                    // result를 전처리합니다.
                    for (String resultElement : result.split("\n")){
                        String[] data = resultElement.split("]");
                        if (data.length==1){
                            continue;
                        }
                        if (!data[0].substring(1, data[0].length()).equals(userName)){
                            newResult = newResult + data[1] + "\n";
                        }

                    }

                    textView.append(newResult.trim() + "\n");
                } catch (IOException e) {
                    System.out.println("메세지 수신 오류");
                    e.printStackTrace();
                }
            }
        }
    }

}
