package com.jyami.dancingstar.repository;

import com.jyami.dancingstar.domain.Dancing;
import com.jyami.dancingstar.domain.Ranking;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Created by jyami on 2020/02/14
 */
public interface DancingRepository extends MongoRepository<Dancing, String> {
}
