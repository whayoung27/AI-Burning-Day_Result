package com.naver.plt.lecture;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;


@Repository
public class LectureDAO {
	@Autowired
	private SqlSession session;
	
	
	public List<LectureVO> getAllLecture() {
		return session.selectList("allLecture");
	}
	public List<LectureVO> getUserLecture(String user_id) {
		return session.selectList("allUserLecture",user_id);
	}
}
