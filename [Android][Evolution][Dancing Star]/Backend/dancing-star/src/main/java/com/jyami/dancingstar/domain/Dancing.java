package com.jyami.dancingstar.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Created by jyami on 2020/02/11
 */

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "dancing")
public class Dancing {

    @Id
    private String dancingId;
    private String title;
    private String artist;
    private String albumImage;
    private String videoPath;
    private String frameNumbers;

    private List<DancingSpot> consistencySpot;
    private List<DancingSpot> accuracySpot;
}
