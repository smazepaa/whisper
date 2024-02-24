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
            showAfterTranscript(formDiv, fileInput, data._id);

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

                listItem.onclick = function() {
                    window.location.href = `/transcribe/audios/${audio._id}`; // Use the unique identifier for the audio
                };

                const dateSpan = document.createElement('span');
                dateSpan.textContent = new Date(audio.date).toLocaleDateString();
                dateSpan.style.fontSize = 'small';

                const removeButton = document.createElement('button');
                removeButton.className = 'remove-audio-button';
                const icon = document.createElement('i');
                icon.className = 'fa-solid fa-xmark';

                removeButton.appendChild(icon);

                removeButton.onclick = function() {
                    event.stopPropagation();
                    removeAudio(audio._id); // Replace with your unique identifier
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

function showAfterTranscript(formDiv, fileInput, id){
    const output = document.getElementById('output');
    output.textContent = "Transcription finished";
    const messagesDiv = document.getElementById('messages');
    messagesDiv.style.display = 'flex';
    formDiv.appendChild(messagesDiv);

    const details = document.createElement('a');
    details.href = `transcribe/audios/${id}`;
    details.textContent = 'See Transcription';
    details.className = 'download-link';

    const reTranscribe = document.createElement('a');
    reTranscribe.href = '/transcribe';
    reTranscribe.textContent = 'Transcribe Again';
    reTranscribe.className = 'download-link';

    messagesDiv.appendChild(details);
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

            const messagesDiv = document.getElementById('details');
            messagesDiv.innerHTML = "";
            messagesDiv.innerHTML = "<h1>Audio removed</h1>";

            fetchAndDisplayAudios();
        })
        .catch(error => {
            console.error('Error removing audio:', error);
        });
}

function toggleEditMode() {
    const displayDiv = document.getElementById('transcriptDisplay');
    const editArea = document.getElementById('transcriptionEditor');
    const actionButtons = document.getElementById('actionButtons');
    const editButtons = document.getElementById('editButtons');

    displayDiv.style.display = 'none';
    editArea.style.display = 'block';
    actionButtons.style.display = 'none'; // Hide the action buttons
    editButtons.style.display = 'block'; // Show the edit/save/cancel buttons
    editArea.value = displayDiv.textContent.trim();
}

function cancelEdit() {
    const displayDiv = document.getElementById('transcriptDisplay');
    const editArea = document.getElementById('transcriptionEditor');
    const actionButtons = document.getElementById('actionButtons');
    const editButtons = document.getElementById('editButtons');

    editArea.style.display = 'none';
    displayDiv.style.display = 'block';
    actionButtons.style.display = 'block';
    editButtons.style.display = 'none';
}

function modifyTranscription(audioId) {
    const editedTranscript = document.getElementById('transcriptionEditor').value;
    console.log(`/transcribe/update/${audioId}`);

    fetch(`/transcribe/update/${audioId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({transcript: editedTranscript}),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const displayDiv = document.getElementById('transcriptDisplay');
            displayDiv.textContent = editedTranscript;
            toggleEditMode();
            fetchAndDisplayAudios();
        })
        .catch(error => {
            console.error('Error saving edited transcript:', error);
        });
}

function downloadTranscript() {
    const transcript = document.getElementById('transcriptionEditor').value;
    const blob = new Blob([transcript], {type: 'text/plain'});
    const downloadUrl = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = 'transcription.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}