const { Router } = require("express");
const router = Router();
let request = require('request');

router.get('/', async(req, res) => {
    console.log('conexion a player1')
    res.send('hello')
})

var jsonDataObj = {'mes': 'hey dude', 'yo': ['im here', 'and here']};

router.post('/', (req, res) => {
    console.log('body msg: ', req.body)
    // request.post({
    //     url:     'http://localhost:3002/api',
    //     // form:    { mes: "heydude" }
    //     body: jsonDataObj,
    //     json: true
        
    //   }, function(error, response, body){
    //     console.log(body);
    //   });
    let apiurl = 'http://localhost:3002/api'
    request(apiurl, function(error,response,body){
      res.send(req.body)
    })
})

module.exports = router;