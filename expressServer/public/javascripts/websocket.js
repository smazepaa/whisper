// websocket.js
const socket = new WebSocket('ws://localhost:3001');

socket.addEventListener('open', function (event) {
    console.log('Connected to WS Server');
});

socket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
    const data = JSON.parse(event.data);
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = data.message; // Make sure to use the correct property from your message structure
    messages.appendChild(messageElement);
});

socket.addEventListener('close', function (event) {
    console.log('Disconnected from WS Server');
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error: ', event);
});
