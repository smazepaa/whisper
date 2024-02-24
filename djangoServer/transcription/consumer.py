from channels.consumer import AsyncConsumer
import json


class TranscriptConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({"type": "websocket.accept"})

    async def websocket_receive(self, text_data):
        print(text_data)
        message = text_data['text']
        print(message)
        await self.send({
            "type": "websocket.send",
            "text": json.dumps({"myMsg": "Hello from Django socket", "yourMsg": message})
        })

    async def websocket_disconnect(self, event):
        pass