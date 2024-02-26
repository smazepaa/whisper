const Audio = require("../models/audio");

async function saveAudio(filename, path, transcript) {
    const audio = new Audio({ filename, path, transcript});
    return audio.save();
}

async function updateAudio(id, audioData) {
    try {
        return await Audio.findOneAndUpdate({ _id: id }, { $set: audioData }, { new: true });
    } catch (error) {
        console.error('Error updating audio:', error);
        throw error;
    }
}

module.exports = {
    saveAudio,
    updateAudio
};
