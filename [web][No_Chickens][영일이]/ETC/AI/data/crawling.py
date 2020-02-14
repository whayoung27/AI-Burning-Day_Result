from selenium import webdriver
import time
import urllib.request
import os
from selenium.webdriver.common.keys import Keys
import ssl
ssl._create_default_https_context = ssl._create_unverified_context


browser = webdriver.Chrome("./chromedriver.exe")  # incase you are chrome
browser.get("https://www.google.com/")

search = browser.find_element_by_name('q')

keywords = "japan receipt"
search.send_keys(keywords, Keys.ENTER)

elem = browser.find_element_by_link_text('이미지')
elem.get_attribute('href')
elem.click()

value = 0
for i in range(20):
    browser.execute_script("scrollBy(" + str(value) + ",+1000);")
    value += 1000
    time.sleep(3)

elem1 = browser.find_element_by_id('islrg')
sub = elem1.find_elements_by_tag_name('img')

try:
    os.mkdir('downloads')
except FileExistsError:
    pass

count = 0
for i in sub:
    src = i.get_attribute('src')
    try:
        if src != None:
            src = str(src)
            print(src)
            count += 1
            urllib.request.urlretrieve(src, os.path.join('downloads/receipt', keywords + '_image' + str(count) + '.jpg'))
        else:
            raise TypeError
    except TypeError:
        print('fail')
