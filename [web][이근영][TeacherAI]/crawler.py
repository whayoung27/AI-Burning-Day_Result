from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import requests
from bs4 import BeautifulSoup
import MySQLdb

db = MySQLdb.connect("49.50.162.164", "gy", "kidd0502", "gy", charset='utf8')
cursor = db.cursor(MySQLdb.cursors.DictCursor)

cursor.execute("select * from script")

scripts = cursor.fetchall()

lecture_html = """<div class="recommend_lecture_wrapper"><div class="lecture_img"><img src="img_src_blank"></div><div class="lecture_info"><p class="lecture_title"><a href="link_blank">title_blank</a></p><p class="lecture_teacher">teacher_blank</p><p class="lecture_number">lecture_number_blank</p></div></div>"""

options = Options()
options.add_argument("window-size=1800,600")


driver = webdriver.Chrome(options=options,executable_path='/Users/mediwhale/Downloads/chromedriver')
driver.implicitly_wait(3)


for s in scripts :
	try :
		if s["words"] and len(s["words"]) > 0 :
			print(s["words"],s["id"])
			driver.get('http://ebsi.co.kr/index.jsp')
			driver.find_element_by_id("fsearch").send_keys(s["words"].split(",")[0])
			driver.find_element_by_class_name("btnSearch").click()


			lectures = driver.find_element_by_class_name("lectureListArea").find_elements_by_tag_name("dl")

			h = ""

			for l in lectures :
				title = l.find_element_by_class_name("lectureListSubject").find_element_by_tag_name("a").text
				link = l.find_element_by_class_name("lectureListSubject").find_element_by_tag_name("a").get_attribute("onclick").split("'")[1]

				teacher = l.find_element_by_class_name("lectureListTeacher").find_element_by_tag_name("a").text
				lecture_number = l.find_element_by_class_name("tit").find_element_by_tag_name("a").text

				r = requests.get(link)
				img_parser = BeautifulSoup(r.text,"html.parser")
				img_link = img_parser.find("img",{'class':'photo'})["src"]

				ht = lecture_html.replace("title_blank",title)
				ht = ht.replace("link_blank",link)
				ht = ht.replace("teacher_blank",teacher)
				ht = ht.replace("img_src_blank",img_link)
				ht = ht.replace("lecture_number_blank",lecture_number)
	            
				h += ht

			            
			cursor.execute("update script set recommend_lecture=%s where id = %s",[h,s["id"]])
			db.commit()
	except : 
		continue


