const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();

app.listen(3002, () => {
    console.log(`Server is running on http://localhost:${3002}`);
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.send('Welcome to the WebSocket server from node js!');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send('from server ' + message + ' pong');
            }
        });
    });

    ws.on('open', () => {
        console.log('WebSocket connection opened');
        ws.send(JSON.stringify({ method: 'subscribed' }));
    });


    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error.message);
    });
});

const WS_PORT = 3001;
server.listen(WS_PORT, () => {
    console.log(`WS Server listening on port ${WS_PORT}`);
});