from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .helpers.audioTranscribe import fetchNtranscribe


@csrf_exempt
@require_http_methods(["POST"])
def transcribe(request):
    if 'file' in request.FILES:

        response = fetchNtranscribe(request.FILES['file'])
        return JsonResponse(response)
    else:
        return JsonResponse({'error': 'No file uploaded'}, status=400)


def mainPage(request):
    return JsonResponse({'message': 'Hello World!'})
