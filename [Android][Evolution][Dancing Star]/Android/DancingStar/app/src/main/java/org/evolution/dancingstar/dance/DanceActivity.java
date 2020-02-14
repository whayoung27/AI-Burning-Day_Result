package org.evolution.dancingstar.dance;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.CamcorderProfile;
import android.media.MediaRecorder;
import android.net.Uri;
import android.os.Environment;
import android.os.Handler;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.os.Bundle;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.VideoView;

import org.evolution.dancingstar.R;
import org.evolution.dancingstar.result.ResultActivity;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


import org.jetbrains.annotations.NotNull;
import android.support.v7.app.AppCompatActivity;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;


public class DanceActivity extends AppCompatActivity {

    private VideoView mVideoView;
    private Size previewSize;
    private CameraDevice cameraDevice;
    private CaptureRequest.Builder previewBuilder;
    private CameraCaptureSession previewSession;
    public static int REQUEST_CAMERA = 1;
    private TextureView textureView;
    private TextView mTvUser;

    private MediaRecorder mediaRecorder;
    private ProgressBar progressBar;
    private int progressSeconds, progressMinutes;
    private Thread thread;
    private Handler handler = new Handler();
    private String BASE_URL = "http://10.83.32.245:9090";

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dance);

        textureView = findViewById(R.id.dance_texture_view);
        mVideoView = findViewById(R.id.dance_video_view);
        progressBar = findViewById(R.id.dance_progress_bar);

        mTvUser = findViewById(R.id.dance_tv_user);
        mTvUser.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!isRecording())
                   startRecording();
            }
        });
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
                stopRecording(true);
            }
        });

    }

    @Override
    protected void onResume() {
        super.onResume();
        startPreview();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    public void tryPostVideo(String filepath) {
        uploadFileOkhttp(filepath, "nickname", "1");

    }

    public void uploadFileOkhttp(String filepath, String nickname, String danceId) {

        File file = new File(filepath);

        RequestBody requestBody = new MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart("nickName", nickname)
                .addFormDataPart("dancingId", danceId)
                .addFormDataPart("file",file.getName(), RequestBody.create(file, MediaType.get("video/mpeg")))
                .build();

        Request request = new Request.Builder()
                .url(BASE_URL+"/dancing/score_test")
                .post(requestBody)
                .build();

        OkHttpClient client = new OkHttpClient();
        client.newCall(request).enqueue(new okhttp3.Callback() {
            @Override
            public void onResponse(@NotNull okhttp3.Call call, @NotNull okhttp3.Response response) throws IOException {
                Log.d("okhttp3", "onResponse: code="+response.code());

                Intent intent = new Intent(DanceActivity.this,ResultActivity.class);
                startActivity(intent);
                finish();
            }

            @Override
            public void onFailure(@NotNull okhttp3.Call call, @NotNull IOException e) {
                Log.d("okhttp3", "onFailure");

                e.printStackTrace();

            }
        });


    }

    public void playVideo() {

        String path = "android.resource://org.evolution.dancingstar/"+R.raw.dance_example;

        Uri uri = Uri.parse(path);

        mVideoView.setVideoURI(uri);
        mVideoView.start();
    }

    private void startPreview() {
        if (textureView.isAvailable()) {
            openCamera();
        } else {
            textureView.setSurfaceTextureListener(surfaceTextureListener);
        }
    }

    private void stopPreview() {
        if (previewSession != null) {
            previewSession.close();
            previewSession = null;
        }
        if (cameraDevice != null) {
            cameraDevice.close();
            cameraDevice = null;
        }
    }

    private void openCamera() {
        CameraManager manager = (CameraManager)getSystemService(Context.CAMERA_SERVICE);

        try {
            String backCameraId = null;

            for (final String cameraId : manager.getCameraIdList()) {
                CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);

                int cameraOrientation = characteristics.get(CameraCharacteristics.LENS_FACING);

                if (cameraOrientation == CameraCharacteristics.LENS_FACING_FRONT) {
                    backCameraId = cameraId;
                    break;
                }
            }

            if (backCameraId == null) {
                return;
            }

            CameraCharacteristics cameraCharacteristics = manager.getCameraCharacteristics(backCameraId);

            StreamConfigurationMap streamConfigurationMap = cameraCharacteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);

            previewSize = streamConfigurationMap.getOutputSizes(SurfaceTexture.class)[0];

            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                return;
            }

            manager.openCamera(backCameraId, deviceStateCallback, null);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void showPreview() {
        SurfaceTexture surfaceTexture = textureView.getSurfaceTexture();
        Surface surface = new Surface(surfaceTexture);

        try {
            previewBuilder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            previewBuilder.addTarget(surface);

            cameraDevice.createCaptureSession(Arrays.asList(surface), captureStateCallback, null);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void updatePreview() {
        try {
            previewSession.setRepeatingRequest(previewBuilder.build(), null, null);
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private boolean isRecording() {
        return mediaRecorder != null;
    }

    private void startRecording() {
        new Thread(new Runnable() {
            @Override
            public void run() {

                try {
                    Thread.sleep(3000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        if (mediaRecorder == null) {
            mediaRecorder = new MediaRecorder();
        }

        String recordFilePath = getOutputMediaFile().getAbsolutePath();

        mediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mediaRecorder.setVideoSource(MediaRecorder.VideoSource.SURFACE);

        CamcorderProfile camcorderProfile
                = CamcorderProfile.get(CamcorderProfile.QUALITY_480P);

        if (camcorderProfile.videoFrameWidth > previewSize.getWidth()
                || camcorderProfile.videoFrameHeight > previewSize.getHeight()) {
            camcorderProfile.videoFrameWidth = previewSize.getWidth();
            camcorderProfile.videoFrameHeight = previewSize.getHeight();
        }

        mediaRecorder.setProfile(camcorderProfile);
        mediaRecorder.setOutputFile(recordFilePath);
        mediaRecorder.setOrientationHint(270);

        try {
            mediaRecorder.prepare();
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        List<Surface> surfaces = new ArrayList<>();

        SurfaceTexture surfaceTexture = textureView.getSurfaceTexture();
        Surface previewSurface = new Surface(surfaceTexture);
        surfaces.add(previewSurface);

        Surface mediaRecorderSurface = mediaRecorder.getSurface();
        surfaces.add(mediaRecorderSurface);

        try {
            previewBuilder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_RECORD);

            previewBuilder.addTarget(previewSurface);
            previewBuilder.addTarget(mediaRecorderSurface);

            cameraDevice.createCaptureSession(surfaces, captureStateCallback, null);

            mediaRecorder.start();
            playVideo();
            thread.start();
        } catch (CameraAccessException e) {
            e.printStackTrace();
        }
    }

    private void stopRecording(boolean showPreview) {
        stopPreview();

        if (mediaRecorder != null) {
            mediaRecorder.stop();
            mediaRecorder.release();
            mediaRecorder = null;
        }
        tryPostVideo(Environment.getExternalStorageDirectory().getAbsolutePath()+ File.separator + "record.mp4");

        Intent intent = new Intent(this,ResultActivity.class);
        startActivity(intent);
        finish();

    }

    private File getOutputMediaFile(){
        String recordPath = Environment.getExternalStorageDirectory().getAbsolutePath();
        File mediaFile = new File(recordPath + File.separator + "record.mp4");
        return mediaFile;
    }

    private TextureView.SurfaceTextureListener surfaceTextureListener = new TextureView.SurfaceTextureListener() {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
            openCamera();
        }

        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height)
        {

        }

        @Override
        public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
            return false;
        }

        @Override
        public void onSurfaceTextureUpdated(SurfaceTexture surface) {

        }
    };

    private CameraDevice.StateCallback deviceStateCallback = new CameraDevice.StateCallback() {

        @Override
        public void onOpened(CameraDevice camera) {
            cameraDevice = camera;
            showPreview();
        }

        @Override
        public void onClosed(@NonNull CameraDevice camera) {
            super.onClosed(camera);
        }

        @Override
        public void onDisconnected(CameraDevice camera) {

        }

        @Override
        public void onError(CameraDevice camera, int error) {

        }
    };

    private CameraCaptureSession.StateCallback captureStateCallback = new CameraCaptureSession.StateCallback() {

        @Override
        public void onConfigured(CameraCaptureSession session) {
            previewSession = session;
            updatePreview();
        }

        @Override
        public void onConfigureFailed(CameraCaptureSession session) {

        }
    };

}
