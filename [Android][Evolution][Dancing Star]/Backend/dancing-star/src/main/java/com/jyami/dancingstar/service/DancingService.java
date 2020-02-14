package com.jyami.dancingstar.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jyami.dancingstar.domain.Dancing;
import com.jyami.dancingstar.domain.DancingSpot;
import com.jyami.dancingstar.dto.dacing.DanceScoreReqDto;
import com.jyami.dancingstar.dto.dacing.DanceScoreResDto;
import com.jyami.dancingstar.dto.dacing.SaveDanceReqDto;
import com.jyami.dancingstar.dto.dacing.SaveOriginDanceReqDto;
import com.jyami.dancingstar.exception.DancingException;
import com.jyami.dancingstar.exception.PythonException;
import com.jyami.dancingstar.repository.DancingRepository;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.jyami.dancingstar.dto.dacing.DanceScoreResDto.makeAccuracy;
import static com.jyami.dancingstar.dto.dacing.DanceScoreResDto.makeConsistency;
import static com.jyami.dancingstar.parsing.DancingParsing.*;
import static org.apache.commons.io.FileUtils.copyInputStreamToFile;

/**
 * Created by jyami on 2020/02/13
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DancingService {

    private final NcloudAPIService ncloudAPIService;
    private final PythonExeService pythonExeService;
    private final DancingRepository dancingRepository;

    private static String USER_VIDEO = "src/main/resources/user_video/";

    public DanceScoreResDto  getDancingScore() throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        Dancing originalDancing = mapper.readValue(new File("src/main/resources/static/mock.json"), Dancing.class);

        String filePath = USER_VIDEO + "user_video.mp4";

        SaveDanceReqDto saveDanceReqDto = SaveDanceReqDto.builder()
                .frameNumbers(originalDancing.getFrameNumbers())
                .videoPath(filePath)
                .build();

        Dancing userDancing = getDancingDataFromVideo(saveDanceReqDto);

        List<String> accuracyScoreForCompare = getAccuracyScoreForCompare(userDancing, originalDancing);
        DanceScoreResDto accuracyScore = getAccuracyScore(accuracyScoreForCompare);

        List<String> consistencyScoreForCompare = getConsistencyScoreForCompare(userDancing, originalDancing);
        DanceScoreResDto consistencyScore = getConsistencyScore(consistencyScoreForCompare, accuracyScore);

        return consistencyScore;
    }

    private DanceScoreResDto getConsistencyScore(List<String> strings, DanceScoreResDto danceScoreResDto){

        Integer consistency = 0;
        Integer combo = 0;

        List<DanceScoreResDto> collect = strings.stream()
                .map(DanceScoreResDto::getFromConsistency)
                .collect(Collectors.toList());
        for(DanceScoreResDto d : collect){
            consistency += d.getConsistencyScore();
            if(consistency < 10)
                continue;
            combo += 100;
        }

        return makeConsistency(consistency, combo, danceScoreResDto);
    }

    private DanceScoreResDto getAccuracyScore(List<String> strings){
        Integer accuracyScore = 5;
        Integer h1Score = 0;
        Integer h2Score = 0;
        List<DanceScoreResDto> collect = strings.stream()
                .map(DanceScoreResDto::getFromAccuracy)
                .collect(Collectors.toList());
        for(DanceScoreResDto d : collect){
            accuracyScore += d.getAccuracyScore();
            h1Score += d.getFaceScore();
            h2Score += d.getGazeScore();
        }

        return makeAccuracy(h1Score, h2Score, accuracyScore);
    }

    public DanceScoreResDto getDancingScore(MultipartFile file, String nickName, String dancingId) throws IOException {

        Dancing originalDancing = dancingRepository.findById(dancingId)
                .orElseThrow(() -> new DancingException("없는 dancingId 입니다."));

        String filePath = saveLocalFile(file, nickName);

        SaveDanceReqDto saveDanceReqDto = SaveDanceReqDto.builder()
                .frameNumbers(originalDancing.getFrameNumbers())
                .videoPath(filePath)
                .build();

        Dancing userDancing = getDancingDataFromVideo(saveDanceReqDto);

//        Integer accuracyScoreForCompare = getAccuracyScoreForCompare(userDacing, originalDancing);
//        Integer consistencyScoreForCompare = getConsistencyScoreForCompare(userDacing, originalDancing);
        List<String> accuracyScoreForCompare = getAccuracyScoreForCompare(userDancing, originalDancing);
        List<String> consistencyScoreForCompare = getConsistencyScoreForCompare(userDancing, originalDancing);

//        return getAllScore(accuracyScoreForCompare, consistencyScoreForCompare);
        return null;
    }

    private DanceScoreResDto getAllScore(int acc, int con){
        return DanceScoreResDto.builder()
                .accuracyScore(acc)
                .consistencyScore(con)
                .totalScore(acc + con)
                .gazeScore(0)
                .faceScore(0)
                .comboScore(0)
                .build();
    }

    public String saveLocalFile(MultipartFile file, String nickName) throws IOException {
        log.info(file.toString());
        InputStream inputStream = file.getInputStream();

        File localSaveFile = new File(USER_VIDEO + nickName + LocalTime.now().toString()+".mp4");
        copyInputStreamToFile(inputStream, localSaveFile);
        log.info(localSaveFile.getAbsolutePath());
        return localSaveFile.getPath();
    }

    private List<String> getAccuracyScoreForCompare(Dancing userFile, Dancing originFile){
        List<DancingSpot> userAccuracySpot = userFile.getAccuracySpot();
        List<DancingSpot> originAccuracySpot = originFile.getAccuracySpot();

        List<String> accuracyList = new ArrayList<>();

        for(int i =0; i<originAccuracySpot.size(); i++){
            DancingSpot dancingSpot = userAccuracySpot.get(i);
            DancingSpot dancingSpot1 = originAccuracySpot.get(i);
            accuracyList.add(getScoreForCompare(dancingSpot, dancingSpot1));
        }

        return accuracyList;
    }

    private List<String> getConsistencyScoreForCompare(Dancing userFile, Dancing originFile){
        List<DancingSpot> userConsistencySpot = userFile.getConsistencySpot();
        List<DancingSpot> originConsistencySpot = originFile.getConsistencySpot();

        List<String> consistencyList = new ArrayList<>();

        for(int i =0; i<originConsistencySpot.size(); i++){
            DancingSpot dancingSpot = userConsistencySpot.get(i);
            DancingSpot dancingSpot1 = originConsistencySpot.get(i);
            consistencyList.add(getScoreForCompare(dancingSpot, dancingSpot1));
        }

        return consistencyList;
    }

    private String getScoreForCompare(DancingSpot user, DancingSpot origin){
        try {
            return pythonExeService.getOneImageCompareScore(origin.getPoseSpots(), user.getPoseSpots(),
                    origin.getFaceSpots(), user.getFaceSpots());
        } catch (IOException e) {
            throw new PythonException("python execute exception" + e.getMessage());
        }
    }

    /**
     *  origin dance 저장
     */

    public Dancing saveDancingDataFromVideo(SaveOriginDanceReqDto saveOriginDanceReqDto) throws IOException {
        return dancingRepository.save(getDancingDataFromVideo(saveOriginDanceReqDto));
    }

    public Dancing getDancingDataFromVideo(SaveDanceReqDto saveDanceReqDto) throws IOException {
        String originVideo = saveDanceReqDto.getVideoPath();
        String frameNumbers = saveDanceReqDto.getFrameNumbers();

        List<DancingSpot> allAccuracyImageScore = getAllAccuracyImageResult(originVideo, frameNumbers);
        List<DancingSpot> allConsistencyImageScore = getAllConsistencyImageResult(originVideo);

        return saveDanceReqDto.toDomain(allConsistencyImageScore, allAccuracyImageScore);
    }

    @SneakyThrows
    private List<DancingSpot> getAllAccuracyImageResult(String originVideo, String frameNumbers) {
//        String imagesFromVideo = pythonExeService.getImagesFromVideo(originVideo, frameNumbers);
        String imagesFromVideo = parsingImage(frameNumbers);
        return stringToStringList(imagesFromVideo).stream()
                .map(t -> getOriginDanceData(parsingForApi(t), getTimeFromPath(t)))
                .collect(Collectors.toList());
    }

    private List<DancingSpot> getAllConsistencyImageResult(String originVideo){
//        String imagesFromVideo = pythonExeService.getImagesFromVideo(originVideo); // image 파일들 생성
        String imagesFromVideo = FrameImage();
        List<String> strings = stringToStringList(imagesFromVideo);
        return strings.stream()
                .map(t -> getOriginDanceData(parsingForApi(t), getTimeFromPath(t)))
                .collect(Collectors.toList());
    }

    public DancingSpot getOriginDanceData(String originFile, String time){

        JsonNode originPoseResult = ncloudAPIService.callPoseEstimation(originFile);
        JsonNode originFaceResult = ncloudAPIService.callFaceRecognition(originFile);

        log.info(originFile + "OKAY");
        return DancingSpot.builder()
                .faceSpots(originFaceResult)
                .poseSpots(originPoseResult)
                .time(time)
                .build();
    }
}
