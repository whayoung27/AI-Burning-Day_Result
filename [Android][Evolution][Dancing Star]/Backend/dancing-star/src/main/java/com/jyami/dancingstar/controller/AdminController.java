package com.jyami.dancingstar.controller;

import com.jyami.dancingstar.domain.Dancing;
import com.jyami.dancingstar.dto.ResponseDto;
import com.jyami.dancingstar.dto.dacing.SaveOriginDanceReqDto;
import com.jyami.dancingstar.service.DancingService;
import com.jyami.dancingstar.service.FileService;
import lombok.RequiredArgsConstructor;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

/**
 * Created by jyami on 2020/02/11
 */
@RestController()
@RequestMapping("admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final DancingService dancingService;
    private final FileService fileService;

    @PostMapping("newDancing")
    public ResponseEntity saveServiceDancingVideo(@RequestBody SaveOriginDanceReqDto saveOriginDanceReqDto) throws IOException {
        Dancing dancing = dancingService.saveDancingDataFromVideo(saveOriginDanceReqDto);//dancing.mp4;
        ResponseDto<Dancing> responseDto = ResponseDto.of(HttpStatus.OK, saveOriginDanceReqDto.getTitle() + "DB 저장 완료", dancing);
        return ResponseEntity.ok().body(responseDto);
    }

    @GetMapping("/downloadFile/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = fileService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

}
