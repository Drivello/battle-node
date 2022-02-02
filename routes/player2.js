const { Router } = require("express");
const router = Router();
const {
    getRivalApi,
    postChallenge,
    postRules,
    postReady,
    postShot,
    postYield
} = require('../controllers/player2.controller');

router.get('/', getRivalApi);

router.post('/challenge', postChallenge);

router.post('/rules', postRules);

router.post('/ready', postReady);

router.post('/shot/:X/:Y', postShot);
router.post('/shot/', postShot);

router.post('/yield', postYield);

module.exports = router;