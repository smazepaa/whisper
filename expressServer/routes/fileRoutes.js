const express = require('express');
const router = express.Router();

const redirectToDjango= require('../controllers/uploadController')
const upload = require('../configs/upload')

router.get('/', (req, res)=>{
    res.render('fileUpload', {title: 'Choose a file to upload'});
});

router.post('/file', upload.single('file'), redirectToDjango);

module.exports = router;