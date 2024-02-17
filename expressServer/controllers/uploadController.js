const FormData = require("form-data");
const fs = require("fs");
const DJANGO_ORIGIN = require("../configs/django-origin");
const axios = require("axios");

async function redirectToDjango(req, res) {
    if (req.file) {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const path = DJANGO_ORIGIN + '/transcribe/file/';
        try {
            const djangoResponse = await axios.post(path, formData, {
                headers: {
                    ...formData.getHeaders(),
                },
            });
            console.log('Django Response:', djangoResponse.data);
            const transcriptText = djangoResponse.data['transcription'];
            res.render('transcription', { transcript: transcriptText });
        } catch (error) {
            console.error('Error making request to Django:', error.message);
            res.json({ error: error.message });
        }
    } else {
        res.status(400).send('No file uploaded.');
    }
}

module.exports = redirectToDjango;