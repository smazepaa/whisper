import asyncio
import tempfile
import websockets
import whisper
from pydub import AudioSegment


async def fetchNtranscribe(uploaded_file):
    try:
        # write the uploaded file to a temporary file
        fd, temp_path = tempfile.mkstemp()
        with open(temp_path, 'wb+') as tmp_file:
            for chunk in uploaded_file.chunks():
                tmp_file.write(chunk)

        async with websockets.connect('ws://127.0.0.1:3001') as websocket:
            await websocket.send('File uploaded to server')

            audio = AudioSegment.from_file(temp_path)
            audio_length_seconds = len(audio) / 1000.0

            estimate_transcription_time = audio_length_seconds * 0.5  # for instance 0.5

            # transcription and progress updates concurrently
            progress_task = asyncio.create_task(send_progress_updates(estimate_transcription_time, websocket))
            model = whisper.load_model("base")
            await websocket.send('Transcription is starting soon')
            result = model.transcribe(temp_path, fp16=False)
            await progress_task

            await websocket.send('Preparing the text')
        return {'transcription': result["text"]}

    except Exception as e:
        return {'error': str(e)}


async def send_progress_updates(duration, websocket):
    start_time = asyncio.get_running_loop().time()
    while True:
        elapsed_time = asyncio.get_running_loop().time() - start_time
        progress = (elapsed_time / duration) * 100
        if progress >= 100:
            break
        await websocket.send(f'Progress: {int(min(progress, 100))}%')
        await asyncio.sleep(0.1)