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
                responseType: 'json',
            });
            console.log('Django Response:', djangoResponse.data);
            res.send(djangoResponse.data);
        } catch (error) {
            console.error('Error making request to Django:', error.message);
            if (error.response) {
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                res.status(error.response.status).send(error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
                res.status(500).send('No response received from Django server.');
            } else {
                console.error('Error message:', error.message);
                res.status(500).send('Error in making the request.');
            }
        } finally {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted successfully');
                }
            });
        }
    } else {
        res.status(400).send('No file uploaded.');
    }
}

module.exports = redirectToDjango;
