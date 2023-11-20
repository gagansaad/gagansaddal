const io = require('socket.io-client');
const socket = io('http://localhost:3000');
console.log('Starting test script...');
socket.on('connect', () => {
  console.log('Connected to WebSocket server');

  // Send a chat message
  socket.emit('chat message', 'Hello, WebSocket Server!');

  // Listen for chat messages from the server
  socket.on('chat message', (msg) => {
    console.log(`Received message from server: ${msg}`);
    socket.close();
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});
