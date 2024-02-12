import cv2
import numpy as np

def scuff_image(I:np.ndarray) -> np.ndarray:

    original_image = I.copy()

    imgHLS = cv2.cvtColor(original_image, cv2.COLOR_BGR2HLS)

    # Get the L channel
    l_channel = imgHLS[:, :, 1]

    # Create the mask
    mask = cv2.inRange(l_channel, 230, 255)

    kernel = np.ones((7, 7), np.uint8)

    dilated = cv2.dilate(mask, kernel, iterations=1)

    dst_telea = cv2.inpaint(original_image, dilated, 5, cv2.INPAINT_TELEA)

    return dst_telea
