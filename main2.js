/* eslint-env browser */
 
var audioContext = null;
var meter = null;
var canvasContext = null;
var WIDTH=500;
var HEIGHT=50;
var rafID = null;

window.onload = function() {
    var meeeter = document.getElementById("meter1")
    canvasContext = meeeter.getContext("2d");
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	audioContext = new AudioContext();
    try {
        navigator.getUserMedia = 
        	navigator.getUserMedia ||
        	navigator.webkitGetUserMedia ||
        	navigator.mozGetUserMedia;
        navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, didntGetStream);
    } catch (e) {
        alert('getUserMedia threw exception :' + e);
    }

}


function didntGetStream() {
    alert('Stream generation failed.');
}

var mediaStreamSource = null;

function gotStream(stream) {
    mediaStreamSource = audioContext.createMediaStreamSource(stream);
    meter = createAudioMeter(audioContext);
    mediaStreamSource.connect(meter);
    drawLoop();
}

function drawLoop( time ) {
    canvasContext.clearRect(0,0,WIDTH,HEIGHT);
    canvasContext.fillRect(0, 0, meter.volume*WIDTH*1, HEIGHT);
    var scale = Math.min(1, meter.volume*9)
    document.querySelectorAll('img').forEach(img => {
        img.style.transform = `scaleX(${scale})`
    })
    rafID = window.requestAnimationFrame( drawLoop );
}

