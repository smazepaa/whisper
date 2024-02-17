import asyncio
import json
import tempfile
import websockets
import whisper

async def fetchNtranscribe(uploaded_file):
    temp_path = None
    try:
        # Write the uploaded file to a temporary file
        fd, temp_path = tempfile.mkstemp()
        with open(temp_path, 'wb+') as tmp_file:
            for chunk in uploaded_file.chunks():
                tmp_file.write(chunk)

        # Notify the WebSocket server that transcription has started
        async with websockets.connect('ws://127.0.0.1:3001') as websocket:
            await websocket.send(json.dumps({'message': 'Transcription started'}))

            model = whisper.load_model("base")
            result = model.transcribe(temp_path, fp16=False)

            # Notify the WebSocket server that transcription has finished
            await websocket.send(json.dumps({'message': 'Transcription finished'}))

        return {'transcription': result["text"]}

    except Exception as e:
        return {'error': str(e)}
