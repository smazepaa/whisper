function saveUploaded(req, res){
    const { filename } = req.params; // Retrieve the filename from the URL

    console.log(`Filename from URL: ${filename}`);
    if (req.file) {
        console.log(`Uploaded file: ${req.file.originalname}`);
        res.send('File uploaded successfully');
        // res.redirect('/');
    } else {
        res.status(400).send('No file uploaded.');
    }
}

module.exports = saveUploaded;