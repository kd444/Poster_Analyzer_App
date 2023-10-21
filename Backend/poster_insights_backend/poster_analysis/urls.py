from django.urls import path
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

from .views import upload_poster, start_analysis, get_report

urlpatterns = [
    path('upload-poster/', upload_poster, name='upload_poster'),
    path('start-analysis/', start_analysis, name='start_analysis'),
    path('get-report/', get_report, name='get_report'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
