document.addEventListener("DOMContentLoaded", function() {

    handleSidebar();

    const form = document.getElementById('uploadForm');
    const formDiv = document.getElementById('formDiv');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('fileUpload');

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        form.style.display = 'none';

        postToTranscript(formData, formDiv, fileInput);
    });
});

function removeFile() {
    document.getElementById('fileUpload').value = '';
}

function checkFormat(){
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];
    const messagesDiv = document.getElementById('small-m');
    if (file) {
        if (file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/x-wav') {
            messagesDiv.textContent = '';
        }
        else {
            messagesDiv.textContent = 'Please upload an MP3 or WAV file.';
            removeFile();
        }
    }
}

function createDownload(fileInput, data){
    const originalFileName = fileInput.files[0].name;
    const baseFileName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));

    const blob = new Blob([data['transcription']], { type: 'text/plain' });
    const downloadUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = `${baseFileName}_transcription.txt`;
    downloadLink.textContent = 'Download Transcript';
    downloadLink.className = 'download-link';

    return downloadLink;
}

function handleSidebar(){
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('transcriptionHistorySidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    sidebarToggle.addEventListener('click', function(event) {
        sidebar.classList.add('open');
        event.stopPropagation();
        fetchAndDisplayAudios();
    });

    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('open');
    });

    // to close the sidebar when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });
}

function postToTranscript(formData, formDiv, fileInput){
    fetch('/file', {
        method: 'POST',
        body: formData,
    })
        .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        })
        .then(data => {
            console.log('Success:', data);

            let endpointData = {
                filename: fileInput.files[0].name,
                path: '../uploads/' + fileInput.files[0].name,
                transcript: data['transcription']
            }

            return fetch('/transcribe/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(endpointData),
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Create success:', data);

            showAfterTranscript(formDiv, fileInput, data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function fetchAndDisplayAudios() {
    fetch('/transcribe/audios')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const list = document.getElementById('transcriptionHistoryList');
            list.innerHTML = '';

            // Sort the audios by date in descending order
            const sortedAudios = data.audios.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });

            data.audios.forEach(audio => {
                const listItem = document.createElement('li');
                listItem.textContent = audio.filename;

                const dateSpan = document.createElement('span');
                dateSpan.textContent = ` - ${new Date(audio.date).toLocaleDateString()}`;
                dateSpan.style.fontSize = 'small';

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.onclick = function() {
                    removeAudio(audio._id);
                };

                listItem.appendChild(dateSpan);
                listItem.appendChild(removeButton);
                list.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error fetching audios:', error);
        });
}

function showAfterTranscript(formDiv, fileInput, data){
    const messagesDiv = document.getElementById('messages');
    messagesDiv.style.display = 'flex';
    formDiv.appendChild(messagesDiv);

    const downloadLink = createDownload(fileInput, data);

    const reTranscribe = document.createElement('a');
    reTranscribe.href = '/transcribe';
    reTranscribe.textContent = 'Transcribe Again';
    reTranscribe.className = 'download-link';

    messagesDiv.appendChild(downloadLink);
    messagesDiv.appendChild(reTranscribe);
}

function removeAudio(audioId) {
    fetch(`/transcribe/delete/${audioId}`, {
        method: 'DELETE',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fetchAndDisplayAudios();
        })
        .catch(error => {
            console.error('Error removing audio:', error);
        });
}