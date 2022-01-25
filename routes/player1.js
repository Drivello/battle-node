const { Router } = require("express");
const router = Router();
const axios = require('axios');

router.get('/', async(req, res) => {
    console.log('conexion a player1')
    res.send('hello')
})

router.post('/', async (req, res) => {
    // chequear si el status del server es idle

    const msg = {
        msg: "lets play"
    }

    try{
         const resp = await axios.post('http://localhost:3002/api', msg)
         console.log('la resp data es: ', resp.data);
         res.send('hola')
    } catch(error){
        console.log(error)
    }
})

router.post('/rules', async(req, res) => {

    console.log(req.rules)
})

module.exports = router;