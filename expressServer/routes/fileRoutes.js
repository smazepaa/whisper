const express = require('express');
const router = express.Router();

const redirectToDjango= require('../controllers/uploadController')
const upload = require('../configs/upload')

const {steps, benefits} = require('../public/variables')

router.get('/', (req, res)=>{
    res.render('mainPage', {steps: steps, benefits: benefits});
});

router.post('/file', upload.single('file'), redirectToDjango);

module.exports = router;