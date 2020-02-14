package com.jyami.dancingstar.dto.dacing;

import com.jyami.dancingstar.domain.Dancing;
import com.jyami.dancingstar.domain.DancingSpot;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.JsonNode;

import java.util.List;

/**
 * Created by jyami on 2020/02/11
 */

@NoArgsConstructor
@Getter
public class SaveOriginDanceReqDto extends SaveDanceReqDto{
    private String title;
    private String artist;
    private String albumImage;


    public SaveOriginDanceReqDto(String videoPath, String frameNumbers, String title, String artist, String albumImage) {
        super(videoPath, frameNumbers);
        this.title = title;
        this.artist = artist;
        this.albumImage = albumImage;
    }

    public Dancing toDomain(List<DancingSpot> consistency, List<DancingSpot> accuracy) {
        return Dancing.builder()
                .videoPath(getVideoPath())
                .frameNumbers(getFrameNumbers())
                .albumImage(albumImage)
                .artist(artist)
                .title(title)
                .consistencySpot(consistency)
                .accuracySpot(accuracy)
                .build();
    }
}
