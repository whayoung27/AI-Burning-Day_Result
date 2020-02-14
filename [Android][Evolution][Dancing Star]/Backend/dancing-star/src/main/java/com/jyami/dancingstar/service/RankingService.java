package com.jyami.dancingstar.service;

import com.jyami.dancingstar.domain.Ranking;
import com.jyami.dancingstar.dto.ranking.RankingListResDto;
import com.jyami.dancingstar.dto.ranking.RankingSaveReqDto;
import com.jyami.dancingstar.repository.RankingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by jyami on 2020/02/14
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RankingService {

    private final RankingRepository rankingRepository;

    public List<RankingListResDto> getRankingList(){
        return rankingRepository.findAllByOrderByTotalScoreDesc()
                .stream()
                .map(RankingListResDto::of)
                .collect(Collectors.toList());

    }

    public void saveRankingList(RankingSaveReqDto rankingSaveReqDto){
        Ranking ranking = rankingSaveReqDto.toDomain();
        rankingRepository.save(ranking);
    }
}
