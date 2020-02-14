package com.jyami.dancingstar.parsing;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by jyami on 2020/02/14
 */

public class DancingParsing {
    public static Integer getTotalScore(List<String> scoreList){
        return scoreList.stream()
                .mapToInt(Integer::parseInt)
                .sum();
    }

    public static String parsingImage(String frameNumber){
        return splitComma(frameNumber)
                .stream()
                .map(c -> "src/main/resources/images/image-frame" +c + ".jpg")
                .collect(Collectors.joining("\n"));

    }

    public static String FrameImage(){
        StringBuilder stringBuilder = new StringBuilder();
        for(int i =0; i<313; i=i+24){
            stringBuilder.append("src/main/resources/images/image-frame" +i + ".jpg\n");
        }
return stringBuilder.toString();
    }

    public static List<String> stringToStringList(String string){
        return Arrays.stream(string.split("\n"))
                .collect(Collectors.toList());
    }

    public static String parsingForApi(String string){
        return string.replace("src/main/resources/","");
    }

    public static String getKey(String parsing){
        return parsing.split(":")[0];
    }

    public static String getValue(String parsing){
        return parsing.split(":")[1];
    }

    public static List<String> splitComma(String strings){
        return Arrays.stream(strings.split(","))
                .collect(Collectors.toList());
    }

    public static String getTimeFromPath(String path){
        return path.replace("src/main/resources/images/image-frame","").replace(".jpg","");
    }

}
