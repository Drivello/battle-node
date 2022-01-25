const { Router } = require("express");
const router = Router();
const axios = require('axios');


router.get('/test', async(req, res) => {
    //console.log('conexion a player2')
    res.send('hello player 2')
})

router.post('/', async(req, res) => {

    const rules = req.body.rules;

    try{
        const resp = await axios.post('http://localhost:3001/api/rules', rules)
        res.json({
            status: 'SUCCESS',
            data: resp 
        })
   } catch(error){
       console.log(error)
   }
})

module.exports = router;