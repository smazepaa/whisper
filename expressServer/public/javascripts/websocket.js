document.addEventListener("DOMContentLoaded", function() {
    const wsUri = "ws://localhost:3001";
    const output = document.querySelector("#output");
    const websocket = new WebSocket(wsUri);

    function writeToScreen(message) {
        let p = output.querySelector("p");
        if (!p) {
            p = document.createElement("p");
            p.textContent = message;
            output.appendChild(p);
        } else {
            p.textContent = message;
        }
    }

    websocket.onmessage = (e) => {
        if (e.data instanceof Blob) {
            let reader = new FileReader();
            reader.onload = () => {
                console.log(reader.result);
                writeToScreen(reader.result);
            };
            reader.readAsText(e.data);
        } else {
            writeToScreen(e.data);
        }
    };

    websocket.onerror = (e) => {
        writeToScreen(`ERROR: ${e.data}`);
    };
});