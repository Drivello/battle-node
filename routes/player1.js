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

//TODO: tira error cuando se hace un send por segunda vez, la primera no...
router.post('/challenge', postChallenge);

router.post('/rules', postRules);

router.post('/init', postInit);

// TODO: este ready es necesario?
// router.post('/ready', ...)

router.post('/shot/:X/:Y', postShot)
router.post('/shot/', postShot)

router.post('/yield', postYield);


module.exports = router;