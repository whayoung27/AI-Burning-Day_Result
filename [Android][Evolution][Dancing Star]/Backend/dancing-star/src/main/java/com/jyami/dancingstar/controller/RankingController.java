package com.jyami.dancingstar.controller;

import com.jyami.dancingstar.dto.ResponseDto;
import com.jyami.dancingstar.dto.dacing.DanceScoreResDto;
import com.jyami.dancingstar.dto.ranking.RankingListResDto;
import com.jyami.dancingstar.dto.ranking.RankingResDto;
import com.jyami.dancingstar.dto.ranking.RankingSaveReqDto;
import com.jyami.dancingstar.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by jyami on 2020/02/11
 */
@RestController()
@RequiredArgsConstructor
@RequestMapping("ranking")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("")
    public ResponseEntity getTop10Ranking() {
        List<RankingListResDto> rankingList = rankingService.getRankingList();
        ResponseDto<List<RankingListResDto>> ranking = ResponseDto.of(HttpStatus.OK, "ranking top 10 조회", rankingList);
        return ResponseEntity.ok().body(ranking);
    }

    @PostMapping("")
    public ResponseEntity saveTop10Ranking(@RequestBody RankingSaveReqDto rankingSaveReqDto){
        rankingService.saveRankingList(rankingSaveReqDto);
        ResponseDto registerRanking = ResponseDto.of(HttpStatus.OK, "ranking 등록 완료");
        return ResponseEntity.ok().body(registerRanking);
    }
}
