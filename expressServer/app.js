const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require("http");
const WebSocket = require("ws");

const MONGO_CONNECTION = require('./configs/mongo');
const WS_PORT = require('./configs/port');

const routes = require('./routes')

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.json());
app.use('/', routes.fileRoutes);
app.use('/transcribe', routes.audioRoutes);


// websocket server setup (from practices/github)
const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
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


const start = async () => {
  await mongoose.connect(MONGO_CONNECTION);
  console.log('Database connected');
  server.listen(WS_PORT, () => {
    console.log(`WS Server is running on http://localhost:${WS_PORT}`);
  });
};

start();