from channels.consumer import AsyncConsumer
import json


class TranscriptConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        await self.send({"type": "websocket.accept"})

    async def websocket_receive(self, event):
        # Check if it's a ping message
        text_data = event.get('text', None)
        print(text_data)
        if text_data:
            data = json.loads(text_data)
            if data['type'] == 'ping':
                # Send a pong message
                await self.send({
                    'type': 'websocket.send',
                    'text': json.dumps({'type': 'pong'})
                })

    async def websocket_disconnect(self, event):
        pass
