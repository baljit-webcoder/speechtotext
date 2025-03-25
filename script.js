const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const output = document.getElementById('output');
const exportBtn = document.getElementById('exportBtn');
const copyBtn = document.getElementById('copyBtn');

let recognition;

// Check if browser supports SpeechRecognition
if (!('webkitSpeechRecognition' in window)) {
  alert('Your browser does not support Speech Recognition. Try using Chrome!');
} else {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    startBtn.disabled = true;
    stopBtn.disabled = false;
    exportBtn.style.display = 'none';
    copyBtn.style.display = 'none';
    output.value = '';
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    output.value = transcript;
  };

  recognition.onerror = (event) => {
    alert('Error: ' + event.error);
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;

    // Show export and copy buttons if there is any transcribed text
    if (output.value.trim()) {
      exportBtn.style.display = 'inline-block';
      copyBtn.style.display = 'inline-block';
    }
  };

  startBtn.onclick = () => {
    recognition.start();
  };

  stopBtn.onclick = () => {
    recognition.stop();
  };

  exportBtn.onclick = () => {
    const textToExport = output.value;
    if (!textToExport) {
      alert('No text to export!');
      return;
    }
    const blob = new Blob([textToExport], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transcription.txt';
    link.click();
  };

  copyBtn.onclick = () => {
    const textToCopy = output.value;
    if (!textToCopy) {
      alert('No text to copy!');
      return;
    }
    navigator.clipboard.writeText(textToCopy)
      .then(() => alert('Text copied to clipboard!'))
      .catch(() => alert('Failed to copy text!'));
  };
}
