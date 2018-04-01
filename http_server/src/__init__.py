from flask import Flask
from flask_cors import CORS
from src.pager.controllers import pager


def create_app():
    """
    """

    flask_app = Flask(__name__)

    CORS(flask_app)
    
    flask_app.register_blueprint(pager)

    return flask_app

app = create_app()