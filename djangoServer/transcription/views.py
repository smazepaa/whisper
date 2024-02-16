import os
import requests
import tempfile
import whisper
from django.http import JsonResponse


def transcribe(request, filename):
    # Initialize variables for potential cleanup
    temp_path = None

    # Construct the file URL from the extracted filename
    base_url = "http://localhost:3400/file/"
    file_url = f"{base_url}{filename}"
    print(file_url)

    try:
        response = requests.get(file_url)
        if response.status_code == 200:
            # Create a temporary file, ensuring it's closed before proceeding
            fd, temp_path = tempfile.mkstemp()
            os.close(fd)

            with open(temp_path, 'wb') as tmp_file:
                tmp_file.write(response.content)

            model = whisper.load_model("base")
            result = model.transcribe(temp_path, fp16=False)

            if os.path.exists(temp_path):
                os.remove(temp_path)

            return JsonResponse({'transcription': result["text"]})
        else:
            return JsonResponse({'error': 'Failed to fetch file'}, status=response.status_code)
    except Exception as e:
        # Ensure cleanup in case of an exception
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
        return JsonResponse({'error': str(e)}, status=500)


def mainPage(request):
    return JsonResponse({'message': 'Hello World!'})
