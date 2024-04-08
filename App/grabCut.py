import cv2
import numpy as np
from scipy.spatial import distance


def grabCut_image(startX, startY, width, height, I:np.ndarray) -> np.ndarray:

    original_image = I.copy()
    image = I.copy()  # Make a copy to work with
    rectangle = (startX, startY, width, height)

    # create a simple mask image similarto the loaded image, with the shape and return type
    mask = np.zeros(image.shape[:2], np.uint8)

    # specify the background and foreground model using numpy
    # the array is constructed of 1 row and 65 columns, and all array elements are 0
    # Data type for the array is np.float64 (default)
    bgmodel = np.zeros((1, 65), np.float64)
    fgmodel = np.zeros((1, 65), np.float64)

    # apply the grabcut algorithm with appropriate
    # values as parameters, number of iterations = 3
    # cv2.GC_INIT_WITH_RECT is used because of the rectangle mode is used
    cv2.grabCut(image, mask, rectangle, bgmodel, fgmodel, iterCount=3, mode=cv2.GC_INIT_WITH_RECT)

    # print(np.unique(mask))

    # In the new mask image, pixels will be marked with four flags
    # four flags denote the background / foreground
    # mask is changed, all the 0 and 2 pixels are converted to the background
    # mask is changed, all the 1 and 3 pixels are now the part of the foreground
    mask2 = np.where((mask == 2) | (mask == 0), 0, 1).astype('uint8')
    # This line will change on the 0 and 2 => 0 value and other become 1
    # multiply the answer with 255, you can get a mask result
    restored_image = cv2.inpaint(image, mask2 * 255, 3, cv2.INPAINT_NS)

    return restored_image
