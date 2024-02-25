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

async function getAudioById(req, res){
    const audioId = req.params.id;
    let audio;
    let cashed = false;
    try {
        const cashedResult = await redisClient.get(audioId);
        if (cashedResult) {
            cashed = true;
            audio = JSON.parse(cashedResult);
        }
        else{
            audio = await Audio.findById(audioId);
            await redisClient.set(audioId, JSON.stringify(audio));
        }

        console.log('from cache', cashed);
        res.render('audioDetails', { audio });
    }
    catch (error) {
        res.status(404).send(error);
    }
}

async function deleteAudioById(req, res) {
    const audioId = req.params.id;
    await Audio.deleteOne({ _id: audioId });
    res.json({message: 'audio deleted'});
}

async function patchAudio(req, res) {
    const audioId = req.params.id;
    const audioData = req.body;

    try {
        await updateAudio(audioId, audioData);
        res.status(200).json({ message: 'Audio updated successfully' });
    } catch (error) {
        console.error('Error updating audio:', error);
        res.status(500).json({ message: 'Error updating audio', error });
    }
}

module.exports = {
    getAllAudios,
    addAudioToDb,
    deleteAudioById,
    getAudioById,
    patchAudio
}