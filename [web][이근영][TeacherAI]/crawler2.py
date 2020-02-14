from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import requests
from bs4 import BeautifulSoup
import MySQLdb

db = MySQLdb.connect("49.50.162.164", "gy", "kidd0502", "gy", charset='utf8')
cursor = db.cursor(MySQLdb.cursors.DictCursor)

cursor.execute("select * from script")

scripts = cursor.fetchall()

lecture_html = """<div class="recommend_study_wrapper">
          <p class="study_label">label_blank</p>
          <p class="study_title"><a href="#">title_blank</a></p>
          <p class="study_lecture">lecture_blank</p>
        </div>"""


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


			lectures = driver.find_element_by_class_name("learningSearchArea").find_elements_by_class_name("learningSection")

			h = ""

			for l in lectures :
				title = l.find_element_by_class_name("learningSubject").find_element_by_tag_name("strong").text
				label = l.find_element_by_class_name("labelTitle").text
				lecture = l.find_element_by_class_name("learningInfo").text

				ht = lecture_html.replace("title_blank",title)
				ht = ht.replace("label_blank",label)
				ht = ht.replace("lecture_blank",lecture)
	            
				h += ht

			            
			cursor.execute("update script set study_content=%s where id = %s",[h,s["id"]])
			db.commit()
	except : 
		continue


