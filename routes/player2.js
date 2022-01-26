const { Router } = require("express");
const router = Router();
const axios = require('axios');
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
            //TODO: generar grilla aca ?
            const gridGenerado = generateGridData(rules.width, rules.height);
            console.log(gridGenerado)

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

router.post('/init', async(req, res) => {

    try {
        const { positions } = req.body;
        const reqPath = path.join(__dirname, '../uploads/positionP2.txt');
        if(serverStatus === 'RIVAL WAITING' || serverStatus === 'SETTING UP'){
            fs.writeFileSync(reqPath, JSON.stringify(positions))
            serverStatus = 'WAITING RIVAL'
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

router.post('/ready', async(req, res) => {
    // Cambiar estado a PROCESSING PLACEMENT para que pueda hacer /init
    // Enviar status 200 a /shot/X/Y para que player1 haga su shot
    try{
         await axios.post('http://localhost:3001/player1/shot/X/Y', {
           msg: 'READY'
        })
        res.status(200);
    } catch(error){
        console.log(error)
    }
    
})

router.post('/shot/X/Y', async(req, res) => {
    
})

router.post('/yield', async(req, res) => {
    
})


module.exports = router;