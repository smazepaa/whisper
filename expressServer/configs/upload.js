const multer = require('multer');

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

module.exports = upload;