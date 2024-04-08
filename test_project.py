import base64
import os

import pytest
from App import create_app
from io import BytesIO
import cv2
import numpy as np

@pytest.fixture
def app():
    app = create_app()
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

def test_process_fadedImage(client):
    # Path to the image file
    image_path = 'tests/faded_test.jpg'

    # Read the image file as bytes
    with open(image_path, 'rb') as file:
        image_data = file.read()

    # Simulate a POST request to the route
    with BytesIO(image_data) as file:
        file.filename = 'test_image.png'
        data = {'file': (file, file.filename)}

        # Simulate a POST request to the route
        response = client.post('/process_fadedImage', data=data, content_type='multipart/form-data')

        # Assert the response status code
        assert response.status_code == 200

def test_process_fadedImage_Null(client):
    image_data = b'\x89PNG\r\n\x1a\n\x00\x00'

    # Simulate a POST request to the route
    with BytesIO(image_data) as file:
        file.filename = ''
        data = {'file': (file, file.filename)}

        # Simulate a POST request to the route
        response = client.post('/process_fadedImage', data=data, content_type='multipart/form-data')

        # Assert the response status code
        assert response.status_code == 400