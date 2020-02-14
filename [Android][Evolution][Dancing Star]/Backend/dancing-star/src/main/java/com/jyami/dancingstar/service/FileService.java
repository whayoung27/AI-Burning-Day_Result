package com.jyami.dancingstar.service;

import com.jyami.dancingstar.exception.MyFileNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Created by jyami on 2020/02/14
 */
@Service
public class FileService {

    public Resource loadFileAsResource(String fileName) {
        try {
            Path localPath = Paths.get("src/main/resources/user_video");
            Path filePath = localPath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found " + fileName + ex);
        }
    }
}
