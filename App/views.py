from io import BytesIO

import cv2
import numpy as np
from flask import Blueprint, render_template, request, send_file
from .models import *
from .faded import faded_image
from .scuff import scuff_image

# Put Route and Views

# Blueprint
blue = Blueprint('user', __name__)


@blue.route('/')
def home():
    # return 'Home'
    return render_template('index.html')


@blue.route('/process_fadedImage', methods=['POST'])
def process_fadedImage():
    file = request.files['file']
    if not file:
        return 'No file uploaded', 400

    # Convert the PIL Image to an OpenCV image
    in_memory_file = BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    image = cv2.imdecode(data, cv2.IMREAD_COLOR)

    restore_fadedImage = faded_image(image)

    # Convert back to bytes
    _, buffer = cv2.imencode('.jpg', restore_fadedImage)
    out_memory_file = BytesIO(buffer)
    out_memory_file.seek(0)

    return send_file(out_memory_file, mimetype='image/jpeg')


@blue.route('/process_scuffImage', methods=['POST'])
def process_scuffImage():
    file = request.files['file']
    if not file:
        return 'No file uploaded', 400

    # Convert the PIL Image to an OpenCV image
    in_memory_file = BytesIO()
    file.save(in_memory_file)
    data = np.frombuffer(in_memory_file.getvalue(), dtype=np.uint8)
    image = cv2.imdecode(data, cv2.IMREAD_COLOR)

    restore_scuffImage = scuff_image(image)

    # Convert back to bytes
    _, buffer = cv2.imencode('.jpg', restore_scuffImage)
    out_memory_file = BytesIO(buffer)
    out_memory_file.seek(0)

    return send_file(out_memory_file, mimetype='image/jpeg')
