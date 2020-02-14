package com.jyami.dancingstar.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Created by jyami on 2020/02/11
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ranking")
@Builder
public class Ranking {
    @Id
    private String id;        // PK
    private String dancing_id; // FK
    private String nickName;
    private String userVideoPath;
    private LocalDateTime createdDate;
    // score
    private Integer totalScore;
}
