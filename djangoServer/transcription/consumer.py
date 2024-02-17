from channels.consumer import AsyncConsumer
import json


class TranscriptConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({
            "type": "websocket.accept"
        })

    async def websocket_disconnect(self, event):
        pass

    async def send_transcript_progress(self, message):
        # Correctly formatted for sending text data
        await self.send({
            "type": "websocket.send",
            "text": json.dumps({'progress': message})
        })
