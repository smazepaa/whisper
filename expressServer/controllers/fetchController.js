const fs = require('fs');
const path = require('path');

function fetchFile(req, res){
    const { filename } = req.params;
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    console.log(filePath);

    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        // Send the file
        res.sendFile(filePath);
    });
}

module.exports = fetchFile;