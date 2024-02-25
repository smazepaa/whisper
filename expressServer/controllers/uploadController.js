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
                // It's important to set the responseType to 'json' if Django response is expected to be JSON
                responseType: 'json',
            });
            console.log('Django Response:', djangoResponse.data);
            res.send(djangoResponse.data);
        } catch (error) {
            console.error('Error making request to Django:', error.message);

            // Check if the error response is from Django or it's a network-related error
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                res.status(error.response.status).send(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                res.status(500).send('No response received from Django server.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                res.status(500).send('Error in making the request.');
            }
        }
    } else {
        res.status(400).send('No file uploaded.');
    }
}

module.exports = redirectToDjango;
