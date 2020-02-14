package com.jyami.dancingstar.exception;

/**
 * Created by jyami on 2020/02/14
 */
public class MyFileNotFoundException extends RuntimeException {
    public MyFileNotFoundException(String message) {
        super(message);
    }
}
