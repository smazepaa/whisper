from django.http import JsonResponse
import os
import tempfile
import requests
import whisper


def transcribe(request, filename):
    # Construct the file URL from the extracted filename
    base_url = "http://localhost:3400/file/"
    file_url = f"{base_url}{filename}"
    print(file_url)

    try:
        # Fetch the file
        response = requests.get(file_url)
        if response.status_code == 200:
            # Create a temporary file
            _, temp_path = tempfile.mkstemp()  # Adjust suffix if necessary
            with open(temp_path, 'wb') as tmp_file:
                tmp_file.write(response.content)

            # Load the Whisper model and transcribe the audio file
            model = whisper.load_model("base")
            result = model.transcribe(temp_path, fp16=False)

            # Cleanup the temporary file
            os.remove(temp_path)

            # Return the transcription result
            return JsonResponse({'transcription': result["text"]})
        else:
            return JsonResponse({'error': 'Failed to fetch file'}, status=response.status_code)
    except Exception as e:
        # Ensure cleanup in case of an exception
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
        return JsonResponse({'error': str(e)}, status=500)


def mainPage(request):
    return JsonResponse({'message': 'Hello World!'})
