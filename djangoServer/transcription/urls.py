from django.urls import path
from transcription import views


urlpatterns = [
    path('', views.mainPage),
    path('file/<str:filename>', views.transcribe),
]
