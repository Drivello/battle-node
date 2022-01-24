const { Router } = require("express");
const router = Router();
let request = require('request');

router.get('/', async(req, res) => {
    console.log('conexion a player2')
    res.send('hello player 2')
})

router.post('/', async(req, res) => {
    request.post({
        url:     'http://localhost:3000/api',
        form:    { mes: "heydude" }
      }, function(error, response, body){
        console.log(req.body);
      });
})

module.exports = router;