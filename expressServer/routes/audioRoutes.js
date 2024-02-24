const express = require('express');
const router = express.Router();

const {getAllAudios, addAudioToDb, deleteAudioById} = require('../controllers/audioControllers');

router.get('/audios', getAllAudios);

router.post('/create', addAudioToDb);

router.delete('/delete/:id', deleteAudioById)
router.get('/', (req, res)=>{
    res.render('fileUpload');
});

module.exports = router;