const express = require('express');
const router = express.Router();

const redirectToDjango= require('../controllers/uploadController')
const upload = require('../configs/upload')

const {steps, benefits} = require('../public/variables')

router.get('/', (req, res)=>{
    res.render('mainPage', {steps: steps, benefits: benefits});
});

router.post('/file', upload.single('file'), redirectToDjango);

router.get('/favicon.ico', (req, res) => res.status(204));

router.get('/error-page', (req, res) => {
    const errorMessage = req.query.error || 'Unknown error'; // Default message if none provided
    res.render('errorPage', { message: errorMessage });
});

module.exports = router;