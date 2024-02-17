function removeFile() {
    let fileInput = document.getElementById('fileUpload');
    fileInput.value = '';
    let form = document.querySelector('form');
    form.action = '/upload';
}

function logFileInfo() {
    let fileInput = document.getElementById('fileUpload');
    let file = fileInput.files[0];
    let form = document.querySelector('form');

    if (file) {
        console.log("File Name: " + file.name);
        console.log("File Size: " + file.size + " bytes");
        console.log("File Type: " + file.type);
    } else {
        console.log("No file selected.");
    }

    form.action = '/file';
    console.log(form.action);
}