# __init__.py : set up file
# Create Flask Application

from flask import Flask, render_template
from .views import blue

def create_app():
    app = Flask(__name__)

    # register Blueprint
    app.register_blueprint(blueprint=blue)

    return app
