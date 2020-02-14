package com.naver.plt.users;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserDAO {
	
	@Autowired
	private SqlSession session;
	
	public void setSession(SqlSession session) {
		this.session = session;
	}
	
	public List<UserVO> getAllUser(){
		return session.selectList("allUser");
	}
	
	public UserVO getOneUser(UserVO vo) {
		return session.selectOne("oneUser",vo.getUser_id());
	}
	
	public UserVO loginUser(UserVO vo) {
		return session.selectOne("loginUser",vo);
	}
	
	public void insertUser(UserVO vo) {
		
		session.insert("insertUser",vo);
	}
}
