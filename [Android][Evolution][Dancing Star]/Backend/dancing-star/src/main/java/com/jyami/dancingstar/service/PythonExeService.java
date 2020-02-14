package com.jyami.dancingstar.service;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by jyami on 2020/02/13
 */
@Service
@Slf4j
public class PythonExeService {

    private static final String BLACK = " ";

    public String getImagesFromVideo(String videoPath) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        String pythonExeFile = "python3 src/main/resources/python/mp4_to_jpeg.py ";
        stringBuilder.append(pythonExeFile);
        stringBuilder.append(videoPath);
        return exePythonProcess(stringBuilder.toString());
    }

    public String getImagesFromVideo(String videoPath, String times) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();
        String pythonExeFile = "python3 src/main/resources/python/mp4_to_jpeg.py ";
        stringBuilder.append(pythonExeFile);
        stringBuilder.append(videoPath); stringBuilder.append(BLACK);
        stringBuilder.append(times);
        return exePythonProcess(stringBuilder.toString());
    }

    public String getOneImageCompareScore(Object originCall, Object userCall,
                                          Object originFaceCall, Object userFaceCall) throws IOException {

        StringBuilder stringBuilder = new StringBuilder();
        String pythonExeFile = "python3 src/main/resources/python/main.py ";

        stringBuilder.append(pythonExeFile);
        stringBuilder.append(originCall); stringBuilder.append(BLACK);
        stringBuilder.append(userCall); stringBuilder.append(BLACK);
        stringBuilder.append(originFaceCall); stringBuilder.append(BLACK);
        stringBuilder.append(userFaceCall); stringBuilder.append(BLACK);

        return exePythonProcess(stringBuilder.toString());
    }

    private String exePythonProcess(String pythonProcess) throws IOException {
        StringBuilder stringBuilder = new StringBuilder();


//        ProcessBuilder pb = new ProcessBuilder(paythonBash ,pythonProcess);

        log.info("python start : " + pythonProcess);
//        Process process = pb.start();

        Process process = Runtime.getRuntime().exec(pythonProcess);

        BufferedReader stdInput = new BufferedReader(new InputStreamReader(process.getInputStream()));

        BufferedReader stdError = new BufferedReader(new InputStreamReader(process.getErrorStream()));

        String s;
        while((s = stdInput.readLine())!=null){
            stringBuilder.append(s+'\n');
        }
        String e;
        while((e = stdError.readLine())!=null){
            stringBuilder.append(e);
        }

        return stringBuilder.toString();
    }
}
