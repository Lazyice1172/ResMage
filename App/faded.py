import cv2
import numpy as np

def faded_image(I:np.ndarray) -> np.ndarray:

    original_image = I.copy()

    # Convert the image to LAB color space
    lab_image = cv2.cvtColor(original_image, cv2.COLOR_BGR2LAB)

    # Separate the LAB channels
    l_channel, a_channel, b_channel = cv2.split(lab_image)
    values_l = l_channel.ravel()

    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization) to the L channel
    clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
    enhanced_l_channel = clahe.apply(l_channel)
    values_enhanced_l = enhanced_l_channel.ravel()

    # Merge the enhanced L channel with the original A and B channels
    enhanced_lab_image = cv2.merge([enhanced_l_channel, a_channel, b_channel])

    # Convert the image back to BGR color space
    restored_image_BGR = cv2.cvtColor(enhanced_lab_image, cv2.COLOR_LAB2BGR)

    # Apply Gaussian blur to reduce noise
    img_blurred = cv2.GaussianBlur(restored_image_BGR, (3, 3), 0)

    return img_blurred
