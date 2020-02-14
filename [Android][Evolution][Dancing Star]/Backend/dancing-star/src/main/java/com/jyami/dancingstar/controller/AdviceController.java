package com.jyami.dancingstar.controller;

import com.jyami.dancingstar.dto.ResponseDto;
import com.jyami.dancingstar.exception.DancingException;
import com.jyami.dancingstar.exception.NcloudException;
import com.jyami.dancingstar.exception.PythonException;
import com.jyami.dancingstar.service.PythonExeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;

/**
 * Created by jyami on 2020/02/13
 */
@RestControllerAdvice
public class AdviceController {
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ResponseDto> handleIOException(IOException ex) {
        ex.printStackTrace();
        return ResponseEntity.ok() // 501
                .body(ResponseDto.of(HttpStatus.NOT_IMPLEMENTED,"local IO 처리중 에러 " + ex.getMessage()));
    }

    @ExceptionHandler(DancingException.class)
    public ResponseEntity<ResponseDto> handleIOException(DancingException ex) {
        ex.printStackTrace();
        return ResponseEntity.ok() // 400
                .body(ResponseDto.of(HttpStatus.BAD_REQUEST, "DancingID 잘못 입력 " +ex.getMessage()));
    }

    @ExceptionHandler(NcloudException.class)
    public ResponseEntity<ResponseDto> handleIOException(NcloudException ex) {
        ex.printStackTrace();
        return ResponseEntity.ok() // 502
                .body(ResponseDto.of(HttpStatus.BAD_GATEWAY, "restAPI 연결 중 에러 "+ex.getMessage()));
    }

    @ExceptionHandler(PythonException.class)
    public ResponseEntity<ResponseDto> PythonException(NcloudException ex) {
        ex.printStackTrace();
        return ResponseEntity.ok() // 504
                .body(ResponseDto.of(HttpStatus.GATEWAY_TIMEOUT, "python 파일 실행 중 에러 " + ex.getMessage()));
    }


}
