import cv2
import numpy as np

def scuff_image(I:np.ndarray) -> np.ndarray:

    original_image = I.copy()
    imgHLS = cv2.cvtColor(original_image, cv2.COLOR_BGR2HLS)
    # Define the range for white color
    lower_white = np.array([0, 230, 0], dtype=np.uint8)
    upper_white = np.array([180, 255, 255], dtype=np.uint8)
    # Create the mask
    mask = cv2.inRange(imgHLS, lower_white, upper_white)
    kernel = np.ones((9, 9), np.uint8)
    dilated = cv2.dilate(mask, kernel, iterations=1)
    dst_telea = cv2.inpaint(original_image, dilated, 5, cv2.INPAINT_TELEA)

    return dst_telea
