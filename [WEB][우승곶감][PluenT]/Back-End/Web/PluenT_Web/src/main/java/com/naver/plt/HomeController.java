package com.naver.plt;

import java.io.DataOutputStream;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.naver.plt.script.ScriptVO;


/**
 * Handles requests for the application home page.
 */
//@CrossOrigin(origins = "*") 
@Controller
public class HomeController {
	
	//private static final Logger logger = LoggerFactory.getLogger(HomeController.class);
	
	/**
	 * Simply selects the home view to render by returning its name.
	 * @throws IOException 
	 */
	//@PostMapping()
	@RequestMapping(value = "/")
	public String home(
			
//			@RequestBody String j
//
			) 
					//throws IOException 
	{
//		
//		 JSONObject jObject = new JSONObject(j);
//		    String title = jObject.getString("title");
//		    String url2 = jObject.getString("contents");
//		    String d = jObject.getString("origin_lang");
//		    String draft = jObject.getString("target_lang");
//		    String star = jObject.getString("gender");
//
//		    System.out.println("title: " + title);
//		    System.out.println("url: " + url2);
//		    System.out.println("draft: " + d);
//		    System.out.println("draft: " + draft);
//		    System.out.println("star: " + star);
//		    ModelAndView mav = new ModelAndView();
//		   
//		    
//		    URL url = null;
//
//		    url = new URL("http://10.83.32.169:3000/translation");
//
//		    HttpURLConnection urlConn = null;
//
//		    urlConn = (HttpURLConnection) url.openConnection();
//
//		    urlConn.setDoInput (true);
//
//		    urlConn.setDoOutput (true);
//
//		    urlConn.setRequestMethod("POST");
//
//		    urlConn.setRequestProperty("Content-Type", "application/json");
//
//		    urlConn.connect();
//
//		    DataOutputStream output = null;
//		    output = new DataOutputStream(urlConn.getOutputStream());
//
//		    //JSONObject obj = new JSONObject();
//		   JSONObject jj  = new JSONObject();
//		   jj.put("title", title);
//		   jj.put("contents", url);
//		   jj.put("origin_lang", d);
//		   jj.put("target_lang",draft);
//		   jj.put("gender", star);
//		   output.flush();
//		   output.close();
//		   //mav.addObject("body",jj);
//		    //redirect: http://10.83.32.169:3000/translation
//		    mav.setViewName("redirect: http://10.83.32.169:3000/translation");
		return "login";
	}
	
}
