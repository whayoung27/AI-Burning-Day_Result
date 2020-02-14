package com.jyami.dancingstar.dto.ranking;

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
public class RankingResDto {
    private String nickName;
    private String userVideoPath;
    private LocalDateTime createdDate;
    // score
    private Integer faceScore;
    private Integer gazeScore;
    private Integer consistencyScore;
    private Integer accuracyScore;
    private Integer comboScore;
    private Integer totalScore;
}
