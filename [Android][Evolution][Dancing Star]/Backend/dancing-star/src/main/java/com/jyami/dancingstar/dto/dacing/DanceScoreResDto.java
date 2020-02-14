package com.jyami.dancingstar.dto.dacing;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.codehaus.jackson.map.ObjectMapper;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import static com.jyami.dancingstar.parsing.DancingParsing.*;

/**
 * Created by jyami on 2020/02/14
 */
@NoArgsConstructor
@Getter
@Builder
@AllArgsConstructor
public class DanceScoreResDto {
    private Integer faceScore;
    private Integer gazeScore;
    private Integer consistencyScore;
    private Integer accuracyScore;
    private Integer comboScore;
    private Integer totalScore;

    public static DanceScoreResDto getFromAccuracy(String string) {
        HashMap<String,String> hashMap = new HashMap();

        for(String s : stringToStringList(string)){
            String value = getValue(s);
            String key = getKey(s);
            hashMap.put(key, value);
        }

        return DanceScoreResDto.builder()
                .faceScore(Integer.parseInt(hashMap.get("h1").trim()))
                .gazeScore(Integer.parseInt(hashMap.get("h2").trim()))
                .accuracyScore(Integer.parseInt(hashMap.get("accuracy").trim()))
                .build();
    }

    public static DanceScoreResDto getFromConsistency(String string) {
        HashMap<String,String> hashMap = new HashMap();

        for(String s : stringToStringList(string)){
            String value = getValue(s);
            String key = getKey(s);
            hashMap.put(key, value);
        }

        return DanceScoreResDto.builder()
                .faceScore(Integer.parseInt(hashMap.get("consistency").trim()))
                .build();
    }

    public static DanceScoreResDto makeConsistency(int consistencyScore, int comboScore, DanceScoreResDto danceScoreResDto){
        danceScoreResDto.comboScore = comboScore;
        danceScoreResDto.consistencyScore = consistencyScore;

        return danceScoreResDto;
    }

    public static DanceScoreResDto makeAccuracy(int h1, int h2, int acc){
        return DanceScoreResDto.builder()
                .accuracyScore(acc)
                .faceScore(h1)
                .gazeScore(h2)
                .build();
    }
}
