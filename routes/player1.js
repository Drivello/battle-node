const { Router } = require("express");
const router = Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
var serverStatus = 'IDLE';

router.get('/', async(req, res) => {
    console.log('conexion a player1')
    res.send('hello')
})

router.post('/', async (req, res) => {
    try{
        const resp = await axios.post('http://localhost:3002/player2', {
            msg: "lets play"
        })

        if(resp.data.status === "SUCESS"){
            serverStatus = 'WAITING RULES'
            res.status(200).send('OK')
        } 
        
    } catch(error){
        console.log(error)
    }
})

router.post('/rules', async(req, res) => {
    const rulesP2 = req.body.rules
    
    try {
        if(Object.keys(rulesP2).length === 3 && serverStatus === 'WAITING RULES') {
            serverStatus = 'SETTING UP'
            res.status(200).json({
                status: 'SUCCESS',
            })
        }
        else{
            throw new Error('Rules incomplete')
        }
    } catch (error) {
        res.status(404).send(error)
    }
    
});

router.post('/init', async(req, res) => {
    
})

module.exports = router;