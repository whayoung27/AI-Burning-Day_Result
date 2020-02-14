# -*- coding: utf-8 -*-
import random
import string
import datetime
import re
from dateutil.relativedelta import relativedelta
from calendar import monthrange
import calendar 
import os

def seconds_to_time(t) :
	return str(datetime.timedelta(seconds=t)) 

def save_attach(f,folder) :
	f.save(os.path.join(folder,f.filename))

def save_files(f,folder,sub_url) :

	filename = random_char(10)+"."+f.filename.split(".")[-1]
	f.save(os.path.join(folder,filename))

	return sub_url+filename,filename

def save_file_from_url(url,folder,sub_url) :
	if "?" in url :
		url = url.split("?")[0]
	filename = random_char(10)+"."+url.split(".")[-1]
	urllib.request.urlretrieve(url,os.path.join(folder,filename) )
	return sub_url+filename,filename

def random_char(y):
    return ''.join(random.choice(string.ascii_letters) for x in range(y))

def get_now() :
	now = datetime.datetime.now()
	return now.strftime('%Y%m%d%H%M%S')

def get_now_8digit() :
	now = datetime.datetime.now()
	return now.strftime('%Y%m%d')

def get_now_10digit() :
	now = datetime.datetime.now()
	return now.strftime('%Y-%m-%d')

def get_now_12digit() :
	now = datetime.datetime.now()
	return now.strftime('%Y%m%d%H%M')

def login_fail_msg(i) :
	msgs = {
		0 : "이메일 또는 비밀번호가 일치하지 않습니다.",
		1 : "관리자만 접근 가능한 페이지 입니다."
	}

	return msgs[i]

def validation_url(url) :
	regex = re.compile(
        r'^(?:http|ftp)s?://' # http:// or https://
        r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)|' #domain...
        r'localhost|' #localhost...
        r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' # ...or ip
        r'(?::\d+)?' # optional port
        r'(?:/?|[/?]\S+)$', re.IGNORECASE)

	return re.match(regex,url)

def validation_date(date) :
	try:
	    datetime.datetime.strptime(date, '%Y-%m-%dT%H:%M')
	    return True
	except ValueError:
		return False

def get_today_year_month() :
	now = datetime.datetime.now()
	return now.year,now.month

def get_today_8digit() :
	return datetime.datetime.now().strftime('%Y%m%d')

def get_today_12digit() :
	return datetime.datetime.now().strftime('%Y%m%d%H%M')


def days_from_date(date,days) :
	start = datetime.datetime.strptime(date,"%Y%m%d")
	end_ = start + datetime.timedelta(days=days)
	return end_.strftime('%Y%m%d')

def get_day_of_week(date) :
	return datetime.datetime.strptime(date,"%Y%m%d").weekday()

def get_day_of_week_char(date) :
	d =  datetime.datetime.strptime(date,"%Y%m%d").weekday()
	if d == 0 :
		return "Sun"
	elif d == 1 :
		return "Mon"
	elif d == 2 :
		return "Tue"
	elif d == 3 :
		return "Wed"
	elif d == 4 : 
		return "Thu"
	elif d == 5 : 
		return "Fri"
	else :
		return "Sat"

def get_month_list(start_month,end_month) :
	delta_month = 0

	start_month = datetime.datetime.strptime(start_month,"%Y%m")
	end_month = datetime.datetime.strptime(end_month,"%Y%m")

	months = []
	while True :
		months.append(start_month+relativedelta(months=delta_month))
		delta_month += 1
		if start_month+relativedelta(months=delta_month) > end_month :
			break

	return months

def get_before_after_months(month) :
	return month+relativedelta(months=-1),month+relativedelta(months=1)

def get_before_after_months_of_today() :
	month = datetime.datetime.now()
	return month+relativedelta(months=-1),month+relativedelta(months=1)

def get_month_list_2year() :
	start_month = (datetime.datetime.now() - relativedelta(months=12)).strftime('%Y%m')
	end_month = (datetime.datetime.now() + relativedelta(months=12)).strftime('%Y%m')

	return get_month_list(start_month,end_month)

def get_day_string_from_ymd(year,month,day) :
	return datetime.datetime(year,month,day).strftime('%Y%m%d')

def get_year_month_from_datetime(month) :
	return month.strftime("%Y%m")

def get_month_day_pair(yearmonth) :
	cal = calendar.Calendar()
	cal.setfirstweekday(calendar.SUNDAY) 
	year = int(yearmonth[0:4])
	month = int(yearmonth[4:6])

	return cal.monthdatescalendar(year,month)

def diff_month(d1, d2):
    return (d1.year - d2.year) * 12 + d1.month - d2.month

def get_this_month() :
	d = datetime.datetime.now()
	return str(d.year)+"%02d"%(d.month)

def date_insert_dash(d) :
	return d[0:4]+"-"+d[4:6]+"-"+d[6:8]

def datetime_insert_dash(d) :
	return d[0:4]+"-"+d[4:6]+"-"+d[6:8]+ " " + d[8:10]+":"+d[10:12]

def date_insert_point(d) :
	return d[0:4]+"."+d[4:6]+"."+d[6:8]
	
def datetime_insert_point(d) :
	return d[0:4]+"."+d[4:6]+"."+d[6:8]+ " " + d[8:10]+":"+d[10:12]

