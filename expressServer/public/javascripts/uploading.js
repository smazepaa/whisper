document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('uploadForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('fileUpload');
        if (fileInput.files.length === 0) {
            alert("Please choose a file to upload.");
            return;
        }
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        // removeFile();
        //document.title = 'Your transcribed file';

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
                //form.style.display = 'none';

                const messagesDiv = document.getElementById('messages');
                messagesDiv.style.display = 'block';
                messagesDiv.innerHTML = `<p>${data['transcription']}</p>`;
            })

            .catch(error => {
                console.error('Error:', error);
            });

    });
});

function removeFile() {
    document.getElementById('fileUpload').value = '';
}
