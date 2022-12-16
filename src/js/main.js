// Document Variables.
const song = document.querySelector("#song");
const player = document.querySelector("#audio");
const playBtn = document.querySelector(".playBtn");
const loopBtn = document.querySelector(".loopBtn");
const volumeSlider = document.querySelector(".volume-slider");
const progressContainer = document.querySelector(".controls-container");
const progressBar = document.querySelector(".progress-done");
const progressSlider = document.querySelector(".progress-bar");
const progressTimestamp = document.querySelector(".progress-time");
const endTimestamp = document.querySelector(".progress-duration");
const progressBtn = document.querySelector(".progress-done-button");
const forwardBtn = document.querySelector(".forwards");
const backwardBtn = document.querySelector(".backwards");
const audioPlayer = document.querySelector(".audio-player");

// Variables.
let seeking = false;
let globalVolume = 0.7;
let played = false;
let dragTime = 0;

// Events.
song.addEventListener("change", handleAudioFile, false);
playBtn.addEventListener("click", handlePLayBtn, false);
loopBtn.addEventListener("click", handleLoopBtn, false);
progressSlider.addEventListener("mousedown", (event) => {seeking = true; seek(event)}, false);
document.addEventListener("mousemove", seek, false);
document.addEventListener("mouseup", () => { changeProgress(); seeking = false; }, false);
volumeSlider.addEventListener("input", handleVolume, false);
forwardBtn.addEventListener("click", handleSkips, false);
backwardBtn.addEventListener("click", handleSkips, false);
document.addEventListener('keydown', handleKeyboard, false);
progressSlider.addEventListener('mouseover', handleMouseover, false);

// Functions.
function handleAudioFile() {
   player.src = URL.createObjectURL(this.files[0]);
   setTimeout(() => {
    progressBar.style = `transform: scaleX(0);`;
    progressBtn.style = `transform: translateX(-5px);`;
    progressTimestamp.textContent = `${convertTime(0) }`;

    player.volume = globalVolume;
    volumeSlider.value = globalVolume * 1000;
    progressBar.value = 0;
    endTimestamp.textContent = `${convertTime(Math.floor(player.duration))}`;

    audioPlayer.classList.remove("disabled");
    volumeSlider.disabled = false;
   }, 100);
}

function handlePLayBtn() {
    if(!player.src) return;

    if (player.paused) {
        player.play();

        playingInterval = setInterval(() => {
            if(!seeking) {
                progressTimestamp.textContent = `${convertTime(Math.floor(player.currentTime))}`;
                progressBar.style = `transform: scaleX(${(player.currentTime / player.duration)});`;
                progressBtn.style = `transform: translateX(${(player.currentTime / player.duration) * progressBar.offsetWidth - 5}px);`;
            }
        }, 10);
        return;
    }
    player.pause();

    clearInterval(playingInterval, 'pause');
}

function handleLoopBtn() {
    if(!player.src) return;

    if (player.loop) {
        player.loop = false;
        return;
    }
    player.loop = true;
}

function handleVolume() {
    if(!player.src) return;

    newVol = this.value / 1000;
    globalVolume = newVol;
    player.volume = newVol;
} 

function seek(e) {
    if(!player.src) return;

    if(!seeking) return;
    const leftOffset = progressBar.getBoundingClientRect().left;
    const seekTime = ((e.clientX - leftOffset) / progressBar.offsetWidth) * player.duration;
    if (seekTime >= 0 && seekTime <= player.duration) {  
        progressBar.style = `transform: scaleX(${(e.clientX - leftOffset) / progressBar.offsetWidth});`;
        progressBtn.style = `transform: translateX(${e.clientX - leftOffset - 5}px);`;
        progressTimestamp.textContent = `${convertTime(((e.clientX - leftOffset) / progressBar.offsetWidth) * player.duration) }`;
        dragTime = seekTime;
    } else if (seekTime >= player.duration) {
        progressBar.style = `transform: scaleX(1);`;
        progressBtn.style = `transform: translateX(${progressBar.offsetWidth - 5}px);`;
        progressTimestamp.textContent = `${convertTime(player.duration) }`;
        dragTime = player.duration;
    } else if (seekTime <= 0) {
        progressBar.style = `transform: scaleX(0);`;
        progressBtn.style = `transform: translateX(-5px);`;
        progressTimestamp.textContent = `${convertTime(0) }`;
        dragTime = 0;
    }
}

function changeProgress() {
    if(!player.src) return;

    if(!seeking) return;
    player.currentTime = dragTime;
    dragTime = 0;
}

function convertTime(timestamp) {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor(timestamp / 60 % 60);
    const seconds = Math.floor(timestamp % 60);

    let timeStr = '';
    if(hours > 0) {
        timeStr += `${hours}:`;
    }

    if (minutes < 10) {
        timeStr += `0${minutes}:`
    } else {
        timeStr += `${minutes}:`
    }

    if (seconds < 10) {
        timeStr += `0${seconds}`
    } else {
        timeStr += `${seconds}`
    }

    return timeStr;
}

function handleSkips() {
    if(!player.src) return;

    if(!this.getAttribute("skip")) return;
    player.currentTime += parseInt(this.getAttribute("skip"));
}

function handleKeyboard(e) {
    const keyCode = e.keyCode;
    switch (keyCode) {
        case 37:
            player.currentTime -= 5;
            break;
        case 39:
            player.currentTime += 5;
            break;
        case 32:
            handlePLayBtn();
            break;
        default:
            return;
    }
}

function handleMouseover() {
    if (seeking) {

    }
}

function playing() {

}