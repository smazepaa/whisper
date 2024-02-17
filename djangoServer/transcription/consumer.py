from channels.consumer import AsyncConsumer
import json


class YourConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({"type": "websocket.accept"})