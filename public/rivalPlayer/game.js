// Player 2 API
var socket = io.connect('http://localhost:3002/');

let P1Status = document.getElementById('P1Status')
let P1Log = document.getElementById('P1log')

let P2Status = document.getElementById('P2Status')
let P2Log = document.getElementById('P2log')

socket.on('eventsPlayer1', ({status, msg}) => {
    if(status) P1Status.innerHTML = `P1 Status: ${status}`;
    if(msg) P1Log.innerHTML = `${P1Log.innerHTML} <br> ${msg}`

})

socket.on('eventsRivalPlayer', ({status, msg}) => {
    if(status) P2Status.innerHTML = `P2 Status: ${status}`;
    if(msg) P2Log.innerHTML = `${P2Log.innerHTML} <br> ${msg}`

})