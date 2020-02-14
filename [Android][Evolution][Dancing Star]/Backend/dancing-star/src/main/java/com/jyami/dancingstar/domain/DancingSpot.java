package com.jyami.dancingstar.domain;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.Map;


/**
 * Created by jyami on 2020/02/11
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DancingSpot {
        private String time;
        private JsonNode poseSpots;
        private JsonNode faceSpots;
}
