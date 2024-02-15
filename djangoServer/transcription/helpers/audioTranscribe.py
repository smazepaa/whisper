import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import whisper


def fetchNtranscribe(file_url, save_path):
    response = requests.get(file_url)
    if response.status_code == 200:
        file_content = ContentFile(response.content)
        saved_path = default_storage.save(save_path, file_content)
        print(f"File successfully saved to {saved_path}")

        # Load the Whisper model
        model = whisper.load_model("base")

        # Ensure the file path is correct
        file_path = default_storage.path(saved_path)

        # Transcribe the audio file
        result = model.transcribe(file_path, fp16=False)
        print(result["text"])
        detected_language = result["language"]
        print("Detected language code:", detected_language)

        # Return the transcription text
        return result["text"]
    else:
        print(f"Failed to fetch file from {file_url}")
        return "Failed to fetch or transcribe file."
