const { Router } = require("express");
const router = Router();
const { 
    getPlayerApi,
    postChallenge,
    postRules,
    postInit,
    postShot,
    postYield,
 } = require('../controllers/player1.controller')


router.get('/', getPlayerApi);

router.post('/challenge', postChallenge);

router.post('/rules', postRules);

router.post('/init', postInit);

router.post('/shot/:X/:Y', postShot)
router.post('/shot/', postShot)

router.post('/yield', postYield);


module.exports = router;