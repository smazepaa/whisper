const express = require('express');
const router = express.Router();
const multer = require('multer');

const saveUploaded  = require('../controllers/uploadController')
const fetchFile  = require('../controllers/fetchController')

// multer with storage options
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // for the original file name
    }
});

const upload = multer({ storage: storage });

router.get('/', (req, res)=>{
    res.render('fileUpload');
});

router.post('/file/:filename', upload.single('file'), saveUploaded)
router.get('/file/:filename', fetchFile)

module.exports = router;