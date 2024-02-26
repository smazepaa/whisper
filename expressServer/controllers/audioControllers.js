const Audio = require('../models/audio');
const {saveAudio, updateAudio} = require('../handlers/audios')
const redis = require('redis');
const axios = require('axios');

let redisClient;

(async () => {
    redisClient = redis.createClient({
        host: '127.0.0.1',
        port: 6379
    });
    redisClient.on('error', (e) => console.log('Error redisClient', e));
    redisClient.on('connection', (con) => console.log('redisClient connected', con));

    await redisClient.connect();
})()

async function addAudioToDb(req, res, next) {
    const filename = req.body.filename;
    const path = req.body.path;
    const transcript = req.body.transcript;

    saveAudio(filename, path, transcript)
        .then(audio => res.status(200).json({ _id: audio._id }))
        .catch(error => next(error));
}


async function getAllAudios(req, res, next){
    try {
        const audios = await Audio.find();
        res.json({ qty: audios.length, audios });
    } catch (error) {
        console.error('Error fetching audios:', error);
        next(error);
    }
}

async function getAudioById(req, res, next){
    let audio;
    let cashed = false;
    try {
        const audioId = req.params.id;
        const cashedResult = await redisClient.get(audioId);
        if (cashedResult) {
            cashed = true;
            audio = JSON.parse(cashedResult);
        }
        else{
            audio = await Audio.findById(audioId);
            // set the expiration time to 3600 seconds (1 hour)
            await redisClient.setEx(audioId, 3600, JSON.stringify(audio));
        }
        console.log('from cache', cashed);
        res.render('audioDetails', { audio });
    }
    catch (error) {
        next(error);
    }
}

async function deleteAudioById(req, res, next) {
    const audioId = req.params.id;
    try {
        await Audio.deleteOne({ _id: audioId });
        await redisClient.del(audioId);

        res.status(200).json({ message: 'Audio deleted successfully' });
    } catch (error) {
        console.error('Error deleting audio:', error);
        next(error);
    }
}

async function patchAudio(req, res, next) {
    const audioId = req.params.id;
    const audioData = req.body;

    try {
        const updatedAudio = await updateAudio(audioId, audioData);
        if (updatedAudio) {
            await redisClient.setEx(audioId, 3600, JSON.stringify(updatedAudio));
            res.status(200).json({ message: 'Audio updated successfully', audio: updatedAudio });
        } else {
            res.status(404).json({ message: 'Audio not found' });
        }
    } catch (error) {
        console.error('Error updating audio:', error);
        next(error);
    }
}


module.exports = {
    getAllAudios,
    addAudioToDb,
    deleteAudioById,
    getAudioById,
    patchAudio
}