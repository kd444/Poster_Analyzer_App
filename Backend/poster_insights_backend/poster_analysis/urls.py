from django.urls import path
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from .views import generate_pdf_report, upload_poster, get_report

urlpatterns = [
    path('upload-poster/', upload_poster, name='upload_poster'),
    path('get-report/', get_report, name='get_report'),
    path('generate_pdf_report/', generate_pdf_report, name='generate_pdf_report'),

]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
