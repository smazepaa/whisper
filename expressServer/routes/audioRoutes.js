const express = require('express');
const router = express.Router();

const {getAllAudios, addAudioToDb} = require('../controllers/audioControllers');

router.get('/audios', getAllAudios);

router.post('/create', addAudioToDb);

router.get('/', (req, res)=>{
    res.render('fileUpload');
});

module.exports = router;