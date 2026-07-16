const bassSlider = document.getElementById('bassSlider');
const bassValue = document.getElementById('bassValue');
const player = document.getElementById('player');
const status = document.getElementById('status');
const downloadLink = document.getElementById('downloadLink');

bassSlider.oninput = () => {
    bassValue.innerText = bassSlider.value;
    // You can add WebAudio bass filter here later
}

async function uploadAudio() {
    const fileInput = document.getElementById('audioInput');
    if (fileInput.files.length === 0) {
        alert("Please select an audio file first");
        return;
    }

    const formData = new FormData();
    formData.append('audio', fileInput.files[0]);

    status.innerText = "Processing... Please keep this tab open";
    downloadLink.style.display = 'none';

    try {
        const response = await fetch('/process', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error("Processing failed");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Set player to play cleaned audio
        player.src = url;

        // Set download link
        downloadLink.href = url;
        downloadLink.style.display = 'inline-block';

        status.innerText = "Done! Play it or download below";

    } catch (error) {
        status.innerText = "Error: " + error.message;
    }
}