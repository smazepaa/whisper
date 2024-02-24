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
        # Accept the WebSocket connection
        await self.send({"type": "websocket.accept"})
        # Schedule a task to send pings periodically
        self.keep_alive_task = asyncio.create_task(self.send_pings())

    async def send_pings(self):
        while True:
            try:
                # Send a ping every X seconds (e.g., 20 seconds)
                await self.send({"type": "websocket.ping"})
                await asyncio.sleep(20)
            except asyncio.CancelledError:
                # If the task is cancelled, exit the loop
                break

    async def websocket_disconnect(self, event):
        # Cancel the keep-alive task
        self.keep_alive_task.cancel()