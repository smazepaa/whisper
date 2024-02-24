const express = require('express');
const app = express();
const mongoose = require('mongoose');
const http = require("http");
const WebSocket = require("ws");
const cors = require('cors');

const MONGO_CONNECTION = require('./configs/mongo');
const WS_PORT = require('./configs/port');

const routes = require('./routes')

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.json());
app.use('/', routes.fileRoutes);
app.use('/transcribe', routes.audioRoutes);

const whitelist = ['http://localhost:3000','http://localhost:3001', 'http://localhost:8000',
                           "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:8000"];
const corsOptions = {
  origin: originFunction,
};

app.use(cors(corsOptions));

function originFunction(origin, callback) {
  if (whitelist.includes(origin) || !origin) {
    callback(null, true);
  }
  else {
    callback(new Error('Not allowed by CORS'));
  }
}

const server = http.createServer(app);
const wss = new WebSocket.Server({ server: server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping(); // Send a ping frame
    }
  }, 30000); // Send a ping every 30 seconds

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
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
    clearInterval(pingInterval); // Clear the ping interval when client disconnects
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