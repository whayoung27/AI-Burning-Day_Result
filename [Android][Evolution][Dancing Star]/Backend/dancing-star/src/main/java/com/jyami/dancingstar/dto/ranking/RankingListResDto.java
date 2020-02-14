package com.jyami.dancingstar.dto.ranking;

import com.jyami.dancingstar.domain.Ranking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Created by jyami on 2020/02/14
 */
@NoArgsConstructor
@Getter
@Builder
@AllArgsConstructor
public class RankingListResDto {
    private String nickName;
    private String userVideoPath;
    private LocalDateTime createdDate;
    private Integer totalScore;

    public static RankingListResDto of(Ranking ranking){
        return RankingListResDto.builder()
                .createdDate(ranking.getCreatedDate())
                .nickName(ranking.getNickName())
                .totalScore(ranking.getTotalScore())
                .userVideoPath(ranking.getUserVideoPath())
                .build();
    }
}
