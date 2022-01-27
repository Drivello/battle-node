const { Router } = require("express");
const router = Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const generateGridData = require("../helpers/generateGrid");
var serverStatus = 'IDLE'

router.get('/', async(req, res) => {
    //console.log('conexion a player2')
    res.send('hello player 2')
})

router.post('/challenge', async(req, res) => {
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
    const { rules } = req.body;

    try{
        const resp = await axios.post('http://localhost:3001/player1/rules', {
           rules
        })

        if(resp.data.status === 'SUCCESS'){
            serverStatus = 'SETTING UP';
            //TODO: grilla
            const grill2 = generateGridData(rules.width, rules.height);
            console.log('grilla p1', grill2)
            res.status(200).send('OK')
        }
        else{
            throw new Error('Failed to deliver the rules')
        }

    
    } catch(error){
        console.log('error /rules p2', error.message)
        res.status(404)
    }
    
})

router.post('/ready', async(req, res) => {

    try {
        const { positions } = req.body;
        const reqPath = path.join(__dirname, '../uploads/positionP2.txt');

        let serverStatus = 'RIVAL WAITING'; // eliminar

        if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){
            //TODO: subir a la grilla las posiciones por cada uno de los elementos del array
            for(let pos in positions){
                gridPositions(grill, pos);
            } 
            console.log(grill)

            fs.writeFileSync(reqPath, JSON.stringify(positions))
            serverStatus = 'PROCESSING SHIP PLACEMENT';
            
            await axios.post('localhost:3001/shot/:X/:Y', {
                msg: 'finished placement'
            })

            res.status(200).json({
                status: 'SUCCESS',
            })
        } else{
            throw new Error('Server is not on the mood')
        }
    } catch (error) {
        console.log('error /init p2', error.message)
        res.status(404).send(error)
    }
   
})

// router.post('/ready', async(req, res) => {

//     try{
//         const {message} = req.body;
//         if(message === 'ready'){
//             serverStatus = 'SENDING SHOT'
//             res.status(200).json({
//                 status: 'SENDING SHOT',
//             })
//         }
//         res.status(200).send('OK');
//     } catch(error){
//         console.log(error)
//     }
    
// })

router.post('/shot/X/Y', async(req, res) => {
    const { positions } = req.body;

})

router.post('/yield', async(req, res) => {
    serverStatus = 'IDLE';
})


module.exports = router;