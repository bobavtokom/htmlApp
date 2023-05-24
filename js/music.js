function play() {
    document.getElementById("music").play();
    document.getElementById("play").style.display = "none";
    document.getElementById("pause").style.display = "block";
}

function pause() {
    document.getElementById("music").pause();
    document.getElementById("play").style.display = "block";
    document.getElementById("pause").style.display = "none";
}
