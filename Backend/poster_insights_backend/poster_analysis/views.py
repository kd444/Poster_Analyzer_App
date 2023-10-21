import os
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse
from PIL import Image
import pytesseract
from io import BytesIO
from transformers import pipeline
import cv2  
import numpy as np
from django.conf import settings

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

extracted_text = ""
image_quality = {}

@csrf_exempt
def upload_poster(request):
    global extracted_text  
    global image_quality 
    if request.method == 'POST':
        # Get the uploaded image file.
        image_file = request.FILES['image']

        # Create a temporary file to save the uploaded image.
        temp_image_path = os.path.join(settings.MEDIA_ROOT, 'temp_image.jpg')

        with open(temp_image_path, 'wb') as temp_image:
            for chunk in image_file.chunks():
                temp_image.write(chunk)

        # Open the temporary image file and extract text
        image = Image.open(temp_image_path)
        extracted_text = pytesseract.image_to_string(image)

        # Calculate image quality metrics using OpenCV
        image_data = cv2.imread(temp_image_path)
        image_height, image_width, _ = image_data.shape

        # Calculate image sharpness (variance of Laplacian)
        gray = cv2.cvtColor(image_data, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = laplacian.var()

        # Calculate image contrast
        contrast = cv2.convertScaleAbs(laplacian).mean()

        # Update image quality metrics
        image_quality = {
            "Resolution": f"{image_width}x{image_height}",
            "Sharpness": sharpness,
            "Contrast": contrast
        }

        # Summarize the extracted text
        global summarized_text
        summarized_text = summarizer(extracted_text, max_length=30, min_length=10, do_sample=False)

        return JsonResponse({'message': 'Poster uploaded successfully.'})

    return HttpResponse('Method not allowed.')

@csrf_exempt
def start_analysis(request):
    global extracted_text
    global summarized_text
    global image_quality

    return JsonResponse({'message': 'Analysis started'})

@csrf_exempt
def get_report(request):
    global extracted_text
    global summarized_text
    global image_quality

    report = {
        "report": [
            {
                "sectionName": "Content Summary",
                "data": [summarized_text[0]['summary_text']]
            },
            {
                "sectionName": "Extracted Text",
                "data": [extracted_text]
            },
            {
                "sectionName": "Link Validation",
                "data": {
                    "link1": True,  
                    "link2": False  
                }
            },
            {
                "sectionName": "Image Quality",
                "data": image_quality  
            },
            {
                "sectionName": "Text Quality",
                "data": {
                    "Font Used": "Arial",  
                    "Text Size": "Small",  
                    "Recommendation": "Use a bigger text size."  
                }
            },
            {
                "sectionName": "Color Analysis",
                "data": {
                    "Color Relevance Measure": "High",  
                    "Recommendations": "Text and background colors are too similar. Consider using a higher contrast background color (e.g., black on white or vice versa)."  # Replace with actual recommendations
                }
            }
        ]
    }
    return JsonResponse(report)
