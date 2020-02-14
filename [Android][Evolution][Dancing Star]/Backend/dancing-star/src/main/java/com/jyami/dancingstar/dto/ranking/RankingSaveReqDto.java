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
public class RankingSaveReqDto {
    private String nickName;
    private String userVideoPath;
    private Integer totalScore;
    private String dancingId;

    public Ranking toDomain(){
        return Ranking.builder()
                .createdDate(LocalDateTime.now())
                .dancing_id(dancingId)
                .nickName(nickName)
                .userVideoPath(userVideoPath)
                .totalScore(totalScore)
                .build();
    }
}
