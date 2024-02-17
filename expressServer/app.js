const express = require('express');
const app = express();

const MONGO_CONNECTION = require('./configs/mongo');

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose');

const fileRoutes = require('./routes/fileRoutes')
const http = require("http");
const WebSocket = require("ws");

// Set EJS / pug as the view engine
app.set('view engine', 'pug');
app.set('views', 'views');

app.use('/', fileRoutes);

const PORT = require('./configs/port');

const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received message: ' + message);

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

const start = async () => {
  await mongoose.connect(MONGO_CONNECTION);
  console.log('Database connected');
  server.listen(WS_PORT, () => {
    console.log(`WS Server is running on http://localhost:${WS_PORT}`);
  });
};

start();