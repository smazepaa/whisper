from django.urls import path
from transcription import views


urlpatterns = [
    path('', views.mainPage),
    path('file/', views.transcribe),
]
