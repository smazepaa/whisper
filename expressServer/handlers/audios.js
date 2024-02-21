const Audio = require("../models/audio");

async function saveAudio(filename, path, transcript) {
    const user = new Audio({ filename, path, transcript});
    return user.save();
}

async function updateAudio(id, data) {
    try {
        return await Audio.findOneAndUpdate({ _id: id }, { $set: data });
    } catch (error) {
        console.error('error', error);
        return false;
    }
}

async function deleteAudio(id) {
    const audio = await Audio.deleteOne({ _id: id });
    return audio.save();
}

module.exports = {
    saveAudio,
    updateAudio,
    deleteAudio
};
