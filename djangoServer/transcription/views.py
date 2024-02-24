from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import asyncio
import threading

from .helpers.audioTranscribe import fetchNtranscribe


@csrf_exempt
@require_http_methods(["POST"])
def transcribe(request):
    if 'file' not in request.FILES:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

    result = {"transcription": None}
    error = None

    def run_async_transcribe():
        nonlocal result, error
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(fetchNtranscribe(request.FILES['file']))
        except Exception as e:
            error = str(e)
        finally:
            loop.close()

    thread = threading.Thread(target=run_async_transcribe)
    thread.start()
    thread.join()

    if error:
        return JsonResponse({'error': error}, status=500)

    return JsonResponse(result)


def mainPage(request):
    return JsonResponse({'message': 'Hello World!'})
