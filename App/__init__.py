# __init__.py : set up file
# Create Flask Application

from flask import Flask, render_template
from flask_cors import CORS  # Import CORS if you're dealing with CORS issues

from .views import blue

def create_app():
    app = Flask(__name__)

    # register Blueprint
    app.register_blueprint(blueprint=blue)

    return app
