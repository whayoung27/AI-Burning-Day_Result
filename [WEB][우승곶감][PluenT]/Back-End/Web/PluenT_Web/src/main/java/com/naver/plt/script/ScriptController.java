package com.naver.plt.script;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.naver.plt.api.CssApi;
import com.naver.plt.api.NmtApi;
import com.naver.plt.users.UserVO;

//@CrossOrigin(origins = "*") 
@Controller
public class ScriptController {

	@Autowired
	ScriptDAO dao;

	UserVO us;

	@Autowired
	NmtApi nmtApi;

	@Autowired
	CssApi cssApi;
	
public List<String> splitText(String org_text){
	
	List<String> tmp = new ArrayList<String>();
	StringBuilder sb = new StringBuilder();
	for (int i=0; i<org_text.length(); ++i) {
		sb.append(org_text.substring(i,i+1));
		if(org_text.charAt(i) == '\n' 
				) {
			tmp.add(sb.toString());
			sb = new StringBuilder();
		}else if(i==org_text.length()-1) {
			tmp.add(sb.toString());
		}
		else if(org_text.length()-i>2) {
			if(org_text.substring(i,i+3).equals(" \n") ) {
				
			}
			else if(org_text.length()-i>3) {
				if(org_text.substring(i, i+4).equals("\r\n")) {
					tmp.add(sb.toString());
					sb = new StringBuilder();
				}
			}
		
		}
	}
	List<String> splited = new ArrayList<String>();
	sb = new StringBuilder();
	for(String s : tmp) {
		if(s.equals("\n") || s.equals("\r\n")) {
			if(sb.toString().equals(" ")) {
				sb = new StringBuilder();
			}else {
			splited.add(sb.toString().trim());
			sb = new StringBuilder();}
		}
		else {
			sb.append(s);
		}
	}
	
	splited.add(sb.toString().trim());
	return splited;
}




	// insert strat
	@RequestMapping("/newscript")
	public String insertScript() {
		return "newscript";
	}

	// @CrossOrigin(origins = "*")
	@RequestMapping(value = "/newscript", method = RequestMethod.POST)
	public ModelAndView insert(HttpSession session, 
			ScriptVO vo, String button, String origin_lang, String target_lang,
			String gender)

	{

		System.out.println(button);
		session.removeAttribute("content");
		ModelAndView mav = new ModelAndView();
		ScriptVO trans = new ScriptVO();
		List<ScriptVO> trans_list = new ArrayList<ScriptVO>();

		if (button.equals("번역")) {
			trans.setTitle(vo.getTitle());
			System.out.println(vo.getContent());
			if (vo.getContent().equals("")) {
				// 내용이 없다면 api 돌리지 않기
				mav.setViewName("newscript");
				// mav.setViewName("redirect: http://10.83.32.169:3000/translation ");
				return mav;
			}
			// start
			//String all =;
			//System.out.println(all);
			StringBuilder all = new StringBuilder( vo.getContent());
			List<String> splited = splitText(all.toString());
			mav.addObject("content",vo.getContent());
			//String tmp = "";
			
			//all.indexOf("\n\n") != -1
			for ( int i=0 ; i< splited.size(); ++i) {
				String tar = splited.get(i);
				if(tar.equals("") || tar.equals(" ")) continue;
				ScriptVO tt = new ScriptVO();
				//System.out.println(i+": "+tar);
				tt.setContent(tar);
				//tt.setTitle(vo.getTitle());
				// trans.setContent(vo.getContent());
				// nmt(String text_ori, String origin_lang, String target_lang)
				String script_result = nmtApi.nmt(tar, origin_lang, target_lang);
//				if(script_result.contains("errorMessage")) {
//					continue;
//				}
				tt.setScript(script_result);
				tt.setScript_id(i);

				String vp = cssApi.css(tt.getScript(), target_lang, gender);
				tt.setVoice_path(vp);
				trans_list.add(tt);
				// 마지막에 무조건 \n 을 넣어줘야 함!?
			}

			// end
			session.setAttribute("translist", trans_list);
			session.setAttribute("title", vo.getTitle());
	
			//mav.addObject("target_lang",target_lang);
			// mav.setViewName("redirect: http://10.83.32.169:3000/translation");
			mav.setViewName("newscript");
			
		} else if (button.equals("저장")) {
			List<ScriptVO> list = (ArrayList<ScriptVO>)session.getAttribute("translist");
			int set_id = dao.getMaxSetId();
			String title = (String)session.getAttribute("title");
			//int pttime = list.size();
			if(title.equals("")) {
				title = "untitle";
			}
			//System.out.println(list.get(0).toString());
			us = (UserVO) session.getAttribute("user");
//			// System.out.println(us.getUser_id());
//			// System.out.println("voice: "+vo.getVoice_path());
			for(int i=0; i<list.size(); ++i) {
				ScriptVO tmp = list.get(i);
				tmp.setUser_id(us.getUser_id());
				tmp.setTitle(title);
				tmp.setSet_id(set_id);
				//tmp.setPttime(pttime);
				dao.insertScript(tmp);
			}
			session.removeAttribute("translist");
			mav.setViewName("redirect: /plt/scriptlist");
		}
		return mav;
	}
	// insert end

	@RequestMapping(value = "/scriptlist")
	public ModelAndView insert(HttpSession session) {
		ModelAndView mav = new ModelAndView();
		us = (UserVO) session.getAttribute("user");
		String user_id = us.getUser_id();
		List<ScriptVO> scriptList = dao.getUserScript(user_id);
		mav.addObject("scriptlist", scriptList);
		mav.setViewName("script_list");
		return mav;
	}

	@RequestMapping(value = "/onescript")
	public ModelAndView getOne(String script_id) {
		ModelAndView mav = new ModelAndView();
		ScriptVO sc = dao.getIdScript(script_id);
		mav.addObject("script", sc);
		mav.setViewName("onescript");
		return mav;
	}

}
