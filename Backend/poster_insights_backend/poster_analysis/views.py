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
import re
import requests
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

extracted_text = ""
image_quality = {}

@csrf_exempt
def upload_poster(request):
    global extracted_text, image_quality
    if request.method == 'POST':
        image_file = request.FILES['image']
        temp_image_path = os.path.join(settings.MEDIA_ROOT, 'temp_image.jpg')

        with open(temp_image_path, 'wb') as temp_image:
            for chunk in image_file.chunks():
                temp_image.write(chunk)

        image = Image.open(temp_image_path)
        extracted_text = pytesseract.image_to_string(image)
        image_data = cv2.imread(temp_image_path)
        image_height, image_width, _ = image_data.shape
        gray = cv2.cvtColor(image_data, cv2.COLOR_BGR2GRAY)
        laplacian = cv2.Laplacian(gray, cv2.CV_64F)
        sharpness = laplacian.var()
        contrast = cv2.convertScaleAbs(laplacian).mean()
        image_quality = {"Resolution": f"{image_width}x{image_height}", "Sharpness": sharpness, "Contrast": contrast}
        global summarized_text
        summarized_text = summarizer(extracted_text, max_length=35, min_length=10, do_sample=False)
        return JsonResponse({'message': 'Poster uploaded successfully.'})
    return HttpResponse('Method not allowed.')

def extract_colors(image):
    image_array = np.array(image)

    # Calculate the unique colors in the image.
    unique_colors, counts = np.unique(image_array.reshape(-1, image_array.shape[2]), axis=0, return_counts=True)

    # Convert the unique colors to RGB hex codes and calculate percentages.
    total_pixels = np.sum(counts)
    color_data = {}

    for color, count in zip(unique_colors, counts):
        hex_color = '#{0:02X}{1:02X}{2:02X}'.format(color[0], color[1], color[2])
        percentage = (count / total_pixels) * 100
        color_data[hex_color] = percentage
    sorted_colors = sorted(color_data.items(), key=lambda x: x[1], reverse=True)
   # Extract the top 10 major colors
    top_10_colors = sorted_colors[:10]
    return top_10_colors



@csrf_exempt
def get_report(request):
  global extracted_text, summarized_text, image_quality

  def validate_links(text):
    links = re.findall(r'http[s]?://\S+', text)
    results = {}
    for i, link in enumerate(links):
      try:
        response = requests.head(link)
        results[f"link{i + 1}"] = response.status_code == 200
      except Exception as e:
        results[f"link{i + 1}"] = False
    return results

  link_validation_results = validate_links(extracted_text)

  # Extract the colors in the image.
  image = Image.open(os.path.join(settings.MEDIA_ROOT, 'temp_image.jpg'))
  color_data = extract_colors(image)

  report = {
    "report": [
      {"sectionName": "Content Summary", "data": [summarized_text[0]['summary_text']]},
      {"sectionName": "Extracted Text", "data": [extracted_text]},
      {"sectionName": "Link Validation", "data": link_validation_results},
      {"sectionName": "Image Quality", "data": image_quality},
      {"sectionName": "Text Quality", "data": {"Font Used": "Arial", "Text Size": "Small", "Recommendation": "Use a bigger text size."}},
      {"sectionName": "Color Analysis", "data": color_data},
    ]
  }

  return JsonResponse(report)


@csrf_exempt
def generate_pdf_report(request):
    global extracted_text, summarized_text, image_quality
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="report.pdf"'
    c = canvas.Canvas(response, pagesize=letter)

    content = [
        "Content Summary:",
        summarized_text[0]['summary_text'],
        "\nExtracted Text:",
        extracted_text,
        "\nImage Quality:",
        f"Resolution: {image_quality['Resolution']}",
        f"Sharpness: {image_quality['Sharpness']}",
        f"Contrast: {image_quality['Contrast']}",
        "\nText Quality:",
        "Font Used: Arial",
        "Text Size: Small",
        "Recommendation: Use a bigger text size.",
        "\nColor Analysis:",
        "Color Relevance Measure: High",
        "Recommendations: Use higher contrast background colors."
    ]

    y = 750
    for line in content:
        c.drawString(100, y, line)
        y -= 15

    c.showPage()
    c.save()

    return response
