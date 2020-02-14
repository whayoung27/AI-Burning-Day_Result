package com.jyami.dancingstar.controller;


import com.jyami.dancingstar.domain.Dancing;
import com.jyami.dancingstar.dto.ResponseDto;
import com.jyami.dancingstar.dto.dacing.DanceScoreReqDto;
import com.jyami.dancingstar.dto.dacing.DanceScoreResDto;
import com.jyami.dancingstar.service.DancingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

/**
 * Created by jyami on 2020/02/11
 */
@RestController()
@RequestMapping("dancing")
@RequiredArgsConstructor
public class DancingController {

    private final DancingService dancingService;

    @RequestMapping(path = "score_test", method = RequestMethod.POST,
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity testFileLocalSave(
            @RequestParam("file") MultipartFile file, @RequestParam("nickName") String nickName,
            @RequestParam("dancingId") String dancingId) throws IOException {

        String s = dancingService.saveLocalFile(file, nickName);
        ResponseDto<String> dancing = ResponseDto.of(HttpStatus.OK, "서버 로컬 저장 완료", s);
        return ResponseEntity.ok().body(dancing);
    }

    @RequestMapping(path = "score", method = RequestMethod.POST,
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity getUserScore(
            @RequestParam("file") MultipartFile file, @RequestParam("nickName") String nickName,
            @RequestParam("dancingId") String dancingId) throws IOException {

        DanceScoreResDto dancingScore = dancingService.getDancingScore(file, nickName, dancingId);

        ResponseDto<DanceScoreResDto> score = ResponseDto.of(HttpStatus.OK, "score 계산 완료", dancingScore);
        return ResponseEntity.ok().body(score);
    }

    @PostMapping(path = "score_mock")
    public ResponseEntity getUserScore(@RequestBody DanceScoreReqDto danceScoreReqDto) throws IOException {

        String nickName = danceScoreReqDto.getNickName();
//        DanceScoreResDto dancingScore = dancingService.getDancingScore();

        DanceScoreResDto dancingScore = dancingService.getDancingScore();
        ResponseDto<DanceScoreResDto> score = ResponseDto.of(HttpStatus.OK, "score 계산 완료", dancingScore);

        return ResponseEntity.ok().body(score);
    }

}
