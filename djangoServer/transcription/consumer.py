import asyncio
from channels.consumer import AsyncConsumer
import json


class TranscriptConsumer(AsyncConsumer):

    async def websocket_receive(self, text_data):
        print(text_data)
        message = text_data['text']
        print(message)
        await self.send({
            "type": "websocket.send",
            "text": json.dumps({"myMsg": "Hello from Django socket", "yourMsg": message})
        })

    async def websocket_connect(self, event):
        await self.send({"type": "websocket.accept"})
        self.keep_alive_task = asyncio.create_task(self.send_pings())

    async def send_pings(self):
        while True:
            try:
                await self.send({"type": "websocket.ping"})
                await asyncio.sleep(20)
            except asyncio.CancelledError:
                break

    async def websocket_disconnect(self, event):
        self.keep_alive_task.cancel()