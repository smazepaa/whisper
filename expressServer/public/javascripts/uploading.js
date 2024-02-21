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
                showAfterTranscript(formDiv, fileInput, data);

            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

function removeFile() {
    document.getElementById('fileUpload').value = '';
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
    });

    closeSidebar.addEventListener('click', function() {
        sidebar.classList.remove('open');
    });

    // to close the sidebar when clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggle) {
            sidebar.classList.remove('open');
        }
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