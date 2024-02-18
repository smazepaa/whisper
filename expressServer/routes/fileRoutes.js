const express = require('express');
const router = express.Router();

const redirectToDjango= require('../controllers/uploadController')
const upload = require('../configs/upload')

let steps = [
    { title: 'Upload an audio file', description: "Click the 'Upload audio' button and select an audio file from your computer or simply drag and drop a file inside the editor." },
    { title: 'Select the language', description: 'Choose the language you want from the dropdown and Textify will automatically create an audio transcription.' },
    { title: 'Download transcription', description: "Choose the transcript file format you prefer and click on the download icon that's just above the transcript editor." }
]

router.get('/', (req, res)=>{
    res.render('mainPage', {steps: steps});
});
router.get('/transcribe', (req, res)=>{
    res.render('fileUpload', {title: 'Choose a file to upload'});
});

router.post('/file', upload.single('file'), redirectToDjango);

module.exports = router;