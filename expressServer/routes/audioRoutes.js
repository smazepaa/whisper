const express = require('express');
const router = express.Router();

const {getAllAudios, addAudioToDb, deleteAudioById, getAudioById, patchAudio} = require('../controllers/audioControllers');

router.get('/audios', getAllAudios);

router.get('/audios/:id', getAudioById);

router.post('/create', addAudioToDb);

router.delete('/delete/:id', deleteAudioById);

router.patch('/update/:id', patchAudio);

router.get('/', (req, res)=>{
    res.render('fileUpload');
});

module.exports = router;