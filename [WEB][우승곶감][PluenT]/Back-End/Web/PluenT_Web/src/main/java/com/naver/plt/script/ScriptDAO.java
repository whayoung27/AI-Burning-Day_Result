package com.naver.plt.script;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class ScriptDAO {
	@Autowired
	private SqlSession session;
	
	public void insertScript(ScriptVO vo){
		session.insert("insertScript",vo);
	}
	
	public List<ScriptVO> getUserScript(String user_id) {
		return session.selectList("userScript",user_id);
	}
	
	public ScriptVO getIdScript(String script_id) {
		return session.selectOne("oneScript",script_id);
	}
	
	public int getMaxSetId() {
		return session.selectOne("maxSetId");
	}
	
	public List<Integer> getAllSetId() {
		return session.selectList("setId");
	}
}
