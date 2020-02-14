package com.jyami.dancingstar.dto.dacing;

import com.jyami.dancingstar.domain.Dancing;
import com.jyami.dancingstar.domain.DancingSpot;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Created by jyami on 2020/02/14
 */
@NoArgsConstructor
@Getter
public class SaveDanceReqDto {
    private String videoPath; // 꼭 ,로 구분되기
    private String frameNumbers;

    @Builder
    public SaveDanceReqDto(String videoPath, String frameNumbers) {
        this.videoPath = videoPath;
        this.frameNumbers = frameNumbers;
    }

    public Dancing toDomain(List<DancingSpot> consistency, List<DancingSpot> accuracy){
        return Dancing.builder()
                .videoPath(getVideoPath())
                .frameNumbers(getFrameNumbers())
                .consistencySpot(consistency)
                .accuracySpot(accuracy)
                .build();
    }
}
