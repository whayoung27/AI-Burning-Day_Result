package com.jyami.dancingstar.repository;

import com.jyami.dancingstar.domain.Ranking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Created by jyami on 2020/02/14
 */
public interface RankingRepository extends MongoRepository<Ranking, String> {
    List<Ranking> findAllByOrderByTotalScoreDesc();

//    List<Ranking> findTopBy10OrderByTotalScore();


}
