const Audio = require('../models/audio');
const {saveAudio, updateAudio} = require('../handlers/audios')


async function addAudioToDb(req, res) {
    const filename = req.body.filename;
    const path = req.body.path;
    const transcript = req.body.transcript;

    saveAudio(filename, path, transcript)
        .then(audio => res.status(200).json({ message: 'Audio added', audio }))
        .catch(error => res.status(500).json({ message: 'Issue with adding audio to DB', error }));
}


async function getAllAudios(req, res){
    try {
        const audios = await Audio.find();
        res.json({ qty: audios.length, audios });
    } catch (error) {
        console.error('Error fetching audios:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAudioById(req, res) {
    try {
        const audioId = req.params.id;
        const audio = await Audio.findById(audioId);
        res.render('audioDetails', { audio }); // Render a Pug template with audio details
    } catch (error) {
        res.status(404).send("Audio not found");
    }
}

async function deleteAudioById(req, res) {
    const audioId = req.params.id;
    await Audio.deleteOne({ _id: audioId });
    res.json({message: 'audio was deleted'});
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