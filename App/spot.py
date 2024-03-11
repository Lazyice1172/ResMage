import cv2
import numpy as np
from scipy.spatial import distance


def spot_image(I: np.ndarray) -> np.ndarray:
    # Read the original image
    # original_image = cv2.imread('./Images/stain1.jpg')
    original_image = I.copy()
    image = I.copy()  # Make a copy to work with

    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Perform Canny edge detection
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate the edges
    kernel = np.ones((5, 5), np.uint8)
    dilated_edges = cv2.dilate(edges, kernel, iterations=1)

    # Find contours
    contours, _ = cv2.findContours(dilated_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter contours based on bounding box size
    filtered_contours = []
    image_height, image_width, _ = image.shape
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        if w < 0.05 * image_width or h < 0.05 * image_height:
            filtered_contours.append(contour)

    # Initialize a list to store average colors for each contour
    average_colors = []

    # Iterate over filtered contours
    for contour in filtered_contours:
        # Create a mask for the current contour
        mask = np.zeros_like(gray)
        cv2.drawContours(mask, [contour], -1, (255), thickness=cv2.FILLED)

        # Apply the mask to the original image
        masked_image = cv2.bitwise_and(image, image, mask=mask)

        # Calculate average color for the masked region
        average_color = cv2.mean(masked_image, mask=mask)
        average_colors.append(average_color[:3])  # Append only BGR channels to the list

    # Calculate total average color
    total_average_color = np.mean(average_colors, axis=0)

    # Define a threshold for color similarity
    color_similarity_threshold = 75  # You can adjust this threshold as needed

    # Create a mask of filled contours
    filled_contours_mask = np.zeros_like(gray)
    for i, color in enumerate(average_colors):
        dist = distance.euclidean(color, total_average_color)  # Using Euclidean distance
        if dist < color_similarity_threshold:
            cv2.drawContours(filled_contours_mask, [filtered_contours[i]], -1, (255), thickness=cv2.FILLED)

    # Inpainting
    restored_image = cv2.inpaint(image, filled_contours_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA)

    return restored_image

    # Concatenate original and inpainted images horizontally
    # result_image = np.hstack((original_image, restored_image))


    # Display the original and inpainted images
    # cv2.imshow('Original vs Inpainted', result_image)
    #
    # cv2.imshow('image1', edges)
    # cv2.imshow('image2', dilated_edges)
    #
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
