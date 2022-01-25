const { Router } = require("express");
const router = Router();
const axios = require('axios');
var serverStatus = 'IDLE'

router.get('/test', async(req, res) => {
    //console.log('conexion a player2')
    res.send('hello player 2')
})

router.post('/', async(req, res) => {
    try{
        if(req.body.msg === 'lets play' && serverStatus === 'IDLE'){
            serverStatus = 'THINKING RULES'
            res.status(200).json({
                status: 'SUCCESS',
            })
        }else{
            throw new Error('Server not prepared or msg incorrect')
        }
   } catch(error){
       console.log(error)
   }
})

router.post('/rules', async(req, res) => {
    const {rules} = req.body;
    try{
        const resp = await axios.post('http://localhost:3001/player1/rules', {
           rules
        })

        if(resp.data.status === 'SUCCESS'){
            serverStatus = 'RIVAL WAITING'
            res.status(200).send('OK')
        }
        else{
            throw new Error('Failed to deliver the rules')
        }
    
    } catch(error){
        console.log(error.message)
        res.status(404)
    }
    
})

module.exports = router;