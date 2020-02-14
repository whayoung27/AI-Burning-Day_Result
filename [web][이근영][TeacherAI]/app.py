from flask import Flask, render_template, current_app, url_for, g, session, redirect, make_response, request
import os
import utils
import json
import config
from flask_sqlalchemy import SQLAlchemy
from flask_mobility import Mobility

app = Flask(__name__)
app.secret_key = 'super secret key'
app.config['TEMPLATE_AUTO_RELOAD'] = True
app.jinja_env.cache = None
abs_path = config.abs_path
app.config["abs_path"] = abs_path
app.config["file_path"] = os.path.join(abs_path,"static/files")
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

app.config['SQLALCHEMY_DATABASE_URI'] = config.DB_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_SIZE'] = 1000
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 1000
app.config["SQLALCHEMY_POOL_TIMEOUT"] = 5


db = SQLAlchemy(app)
Mobility(app)



from model import *

	
db.create_all()



import routes

app.register_blueprint(routes.blueprint, url_prefix='/')




if __name__ == "__main__":
    app.run(debug=True)
    #app.run(debug=True,host='0.0.0.0',port=80)
