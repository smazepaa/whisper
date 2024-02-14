function removeFile() {
    let fileInput = document.getElementById('fileUpload');
    fileInput.value = '';
}

function logFileInfo() {
    let fileInput = document.getElementById('fileUpload');
    let file = fileInput.files[0];

    if (file) {
        console.log("File Name: " + file.name);
        console.log("File Size: " + file.size + " bytes");
        console.log("File Type: " + file.type);
    } else {
        console.log("No file selected.");
    }
}