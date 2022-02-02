
// const socket = io();
var socket = io.connect('http://localhost:3002/');

socket.on('eventsRivalPlayer', data => {
    console.log(data);
})
