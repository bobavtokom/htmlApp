var myMusic = document.getElementById("music");

function play() {
    myMusic.play();
    var playButton = document.getElementById("play");
    var pauseButton = document.getElementById("pause");
    playButton.style.display = "none";
    pauseButton.style.display = "block";
}

function pause() {
    myMusic.pause();
    var playButton = document.getElementById("play");
    var pauseButton = document.getElementById("pause");
    playButton.style.display = "block";
    pauseButton.style.display = "none";
}