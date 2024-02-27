# WebSocket Communication Overview

This document outlines the WebSocket communication flow between a Django backend, an Express WebSocket server, and a Express client.

## Components

- **Express WebSocket Server**: Acts as a central hub for WebSocket connections. It receives messages from Django and broadcasts them to connected Express clients.
- **Django Server**: Sends messages to the Express server using WebSocket connections.
- **Express Client**: Connects to the Express WebSocket server to send and receive messages.

## Communication Flow

### 1. Django to Express WebSocket Server

The Django server uses an asynchronous consumer to establish a WebSocket connection to the Express server. Upon receiving text data on the WebSocket, it prints the message and responds with a JSON-formatted message that includes a greeting and the received message. It also periodically sends WebSocket pings to maintain the connection.

```python
# Django Server: Sending a message and maintaining connection
await self.send({
    "type": "websocket.send",
    "text": json.dumps({"myMsg": "Hello from Django"})
})

# Sending a WebSocket ping to maintain the connection
await self.send({
    "type": "websocket.ping"
})
```

### 2. Express WebSocket Server Handling

The server is set up to listen for incoming WebSocket connections. On a new connection, it logs the event and starts sending periodic pings to keep the connection alive. When a message is received, it logs the message and then broadcasts it to all other connected WebSocket clients, excluding the sender. The server handles connection opening, messages, errors, and closure events.

```javascript
// Express Server: Broadcasting a message
wss.on('connection', (ws) => {
    const interval = setInterval(() => {
        ws.ping(); // Sending ping to maintain connection
    }, 30000); // Ping interval in milliseconds
});
```

### 3. Express Client Communication

The Express client establishes a WebSocket connection to the Express server and sets up handlers for various events (e.g., message reception, errors). Upon receiving a message, it checks if the message is a Blob. If so, it reads it as text; otherwise, it directly displays the message. Error events display an error message.

```javascript
// Express Client: Handling received message
websocket.onmessage = (e) => {
    writeToScreen(e.data);
};

// Handling pings
websocket.onping = () => {
    websocket.pong(); // Responding to ping with pong
};
```

## WebSocket Messages

- **From Django to Express**: Sends a JSON message with a predefined structure, including a greeting and the original message received by the Django server.
- **From Express to Express Client**: Broadcasts the received message from Django to all connected Express clients.
- **From Express Client**: The client can also send messages to the Express server, which will then be broadcasted to other clients.

## Ping-Pong Mechanism

The ping-pong mechanism is crucial for maintaining WebSocket connections alive. It involves sending "ping" messages at regular intervals:

- **Django Server**: Sends pings to the Express server to ensure the connection is alive.
- **Express Server**: Sends pings to all connected clients and expects "pong" messages in response to ensure that the client connections are still alive.
- **Express Client**: Automatically responds to pings with pongs, maintaining the connection's health.

## Setup and Configuration

- **Express Server**: Requires the `ws` package for WebSocket support. It's configured to work with an existing HTTP server.
- **Django Server**: Utilizes Channels and AsyncConsumer for WebSocket communication. Messages are serialized to JSON before sending.
- **Express Client**: Uses the native `WebSocket` API to establish connections and handle messages, including responding to pings.

## Conclusion

This setup allows for real-time messaging between a Django backend and Express frontend clients through an Express WebSocket server, with a robust ping-pong mechanism ensuring stable and continuous connections. It demonstrates the power of WebSockets for creating interactive, live-updating web applications.