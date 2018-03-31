from flask import Flask
from src.pager.controllers import pager


def create_app():
    """
    """

    flask_app = Flask(__name__)

    flask_app.register_blueprint(pager)

    return flask_app

app = create_app()