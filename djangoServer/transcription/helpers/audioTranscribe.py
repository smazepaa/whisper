import tempfile
import whisper


def fetchNtranscribe(uploaded_file):
    temp_path = None
    try:
        # Write the uploaded file to a temporary file
        fd, temp_path = tempfile.mkstemp()
        with open(temp_path, 'wb+') as tmp_file:
            for chunk in uploaded_file.chunks():
                tmp_file.write(chunk)

        model = whisper.load_model("base")
        result = model.transcribe(temp_path, fp16=False)

        return {'transcription': result["text"]}

    except Exception as e:
        return {'error': str(e)}

    # finally:
    #     # Clean up the temporary file
    #     if temp_path and os.path.exists(temp_path):
    #         os.remove(temp_path)
