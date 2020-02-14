package com.react_native_voice_exercise;
packages.add(new RNCameraPackage());

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.wenkesj.voice.VoicePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import android.net.Uri;
import android.content.Intent;

import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VoicePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate(){//Bundle savedInstanceState) {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);


    //Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
    //setSupportActionBar(toolbar);

    //Intent in = getIntent();
    //Uri data = in.getData();
 
  }
}
/*
class VoiceTest extends Component {
  constructor(props) {
    Voice.onSpeechStart = this.onSpeechStartHandler.bind(this);
    Voice.onSpeechEnd = this.onSpeechEndHandler.bind(this);
    Voice.onSpeechResults = this.onSpeechResultsHandler.bind(this);
  }
  onStartButtonPress(e){
    //Voice.start('en-US');
    Voice.start('ko-KR');
  }
}
*/

/*
public void permission_check(){
  if(checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED){
    requestPermissions(new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION);
    Log.e("permission", "need camera permission");
    return;
  }
  if(checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
    requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, 200);
    Log.e("permission", "need ex write permission");
    return;
  }
  if(checkSelfPermission(Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
    requestPermissions(new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, 200);
    Log.e("permission", "need ex read permission");
    return;
  }
}
*/