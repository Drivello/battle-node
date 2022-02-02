
// const socket = io();
var socket = io.connect('http://localhost:3002/');

socket.on('welcome', data => {
    console.log(data);
})
