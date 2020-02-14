package com.jyami.dancingstar.domain;

import lombok.Getter;

/**
 * Created by jyami on 2020/02/11
 */
//18개 Type 두기
@Getter
public enum SPOT_TYPE {
    NOSE(0, "코"), NECK(1, "목"),
    RIGHT_SHOULDER(2, "오른쪽 어깨"), RIGHT_ELBOW(3, "오른쪽 팔굼치"),
    RIGHT_WRIST(4, "오른쪽 손목"), LEFT_SHOULDER(5, "왼쪽 어깨"),
    LEFT_ELBOW(6, "왼쪽 팔굼치"), LEFT_WRIST(7, "왼쪽 손목"),
    RIGHT_HIP(8, "오른쪽 엉덩이"), RIGHT_KNEE(9, "오른쪽 무릎"),
    RIGHT_ANKLE(10, "오른쪽 발목"), LEFT_HIP(11, "왼쪽 엉덩이"),
    LEFT_KNEE(12, "왼쪽 무릎"), LEFT_ANKLE(13, "왼쪽 발목"),
    RIGHT_EYE(14, "오른쪽 눈"), LEFT_EYE(15, "왼쪽 눈"),
    RIGHT_EAR(16, "오른쪽 귀"), LEFT_EAR(17, "왼쪽 귀");

    private int number;
    private String description;

    SPOT_TYPE(int number, String description) {
        this.number = number;
        this.description = description;
    }
}
