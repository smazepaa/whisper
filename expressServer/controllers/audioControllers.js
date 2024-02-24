const Audio = require('../models/audio');
const {saveAudio, updateAudio, deleteAudio} = require('../handlers/audios')


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

async function getAudioByFilename(req, res) {
    const filename = req.params.filename;
    try {
        const user = await Audio.findOne({ filename: filename });
        res.render('user-profile', { user: user });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function deleteAudioById(req, res) {
    const audioId = req.params.id;
    await Audio.deleteOne({ _id: audioId });
    res.send({message: 'audio was deleted'});
}

module.exports = {
    getAllAudios,
    addAudioToDb,
    deleteAudioById
}