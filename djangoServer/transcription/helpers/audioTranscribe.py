import asyncio
import os
import tempfile
import websockets
import whisper
from pydub import AudioSegment


async def transcribe_audio(file_path):
    model = whisper.load_model("base")
    result = model.transcribe(file_path, fp16=False)
    return result["text"]


async def send_progress_updates(duration, websocket):
    start_time = asyncio.get_event_loop().time()
    while True:
        elapsed_time = asyncio.get_event_loop().time() - start_time
        progress = (elapsed_time / duration) * 100
        if progress >= 100:
            await websocket.send('Progress: 100%')
            break
        await websocket.send(f'Progress: {int(progress)}%')
        await asyncio.sleep(0.1)


async def fetchNtranscribe(uploaded_file):
    fd, temp_path = tempfile.mkstemp()
    try:
        with open(temp_path, 'wb+') as tmp_file:
            for chunk in uploaded_file.chunks():
                tmp_file.write(chunk)
        async with websockets.connect('ws://127.0.0.1:3001') as websocket:
            await websocket.send('File uploaded to server')
            await websocket.send('Transcription is starting soon')
            audio = AudioSegment.from_file(temp_path)
            audio_length_seconds = len(audio) / 1000.0
            estimate_transcription_time = audio_length_seconds * 0.5
            transcription_task = asyncio.create_task(transcribe_audio(temp_path))
            progress_task = asyncio.create_task(send_progress_updates(estimate_transcription_time, websocket))
            transcription_result = await transcription_task
            progress_task.cancel()
            await websocket.send('Transcription finished')
        return {'transcription': transcription_result}
    finally:
        os.close(fd)
        os.unlink(temp_path)
