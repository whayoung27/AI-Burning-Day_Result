package com.naver.plt.lecture;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.naver.plt.users.UserVO;

@Controller
public class LectureController {
	@Autowired
	private LectureDAO dao;
	
	private UserVO vo;
	
	@RequestMapping("/alllecture")
	public ModelAndView getUserLecture() {
		ModelAndView mav = new ModelAndView();
		List<LectureVO> list = dao.getAllLecture();
		mav.addObject("lecturelist", list);
		return mav;
		
	}
	@RequestMapping("/lecturelist")
	public ModelAndView getUserLecture(HttpSession session) {
		vo = (UserVO)session.getAttribute("user");
		ModelAndView mav = new ModelAndView();
		if(vo==null) {
			mav.setViewName("redirect: /");
		}
		else {
			String user_id = vo.getUser_id();
			System.out.println(user_id);
			List<LectureVO> list = dao.getUserLecture(user_id);
			System.out.println(list.size());
			mav.addObject("lecturelist",list);
			mav.setViewName("mylecturelist");
		}
		return mav;
		
	}

}
