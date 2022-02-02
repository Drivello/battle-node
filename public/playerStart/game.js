
// const socket = io();
var socket = io.connect('http://localhost:3001/');

socket.on('eventsPlayer1', data => {
    console.log(data);
})
