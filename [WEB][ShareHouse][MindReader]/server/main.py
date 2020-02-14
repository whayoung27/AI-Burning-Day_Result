from flask import Flask
from config import CONFIG
from src.ner import api

app = Flask(__name__)

# api.add_namespace(ns_v1)

if __name__ == "__main__":
    api.init_app(app)
    app.run(host=CONFIG.host, port=CONFIG.port, debug=CONFIG.debug)
