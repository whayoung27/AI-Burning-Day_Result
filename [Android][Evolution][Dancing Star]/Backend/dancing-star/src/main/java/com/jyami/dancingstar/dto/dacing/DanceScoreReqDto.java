package com.jyami.dancingstar.dto.dacing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * Created by jyami on 2020/02/14
 */
@NoArgsConstructor
@Getter
@Builder
@AllArgsConstructor
public class DanceScoreReqDto {
    private String nickName;
    private String danceId;

}
