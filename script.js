// Get references for elements
const secondHand = document.getElementsByClassName("second");
const minuteHand = document.getElementsByClassName("minute");
const hourHand = document.getElementsByClassName("hour");
const modeSwitch = document.getElementsByClassName("mode-switch");
const video = document.getElementById("video");

// Handle mode switching
modeSwitch[0].addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// --- Audio tick setup (Web Audio API) ---
// let audioCtx = null;
// let audioAllowed = false; // becomes true after user interaction/resume

// function initAudio() {
//   if (!audioCtx)
//     audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// }

// // Resume audio on first user interaction (many browsers block autoplay)
// function resumeAudioOnInteraction() {
//   initAudio();
//   if (audioCtx.state === "suspended") audioCtx.resume();
//   audioAllowed = true;
// }
// Try to resume on first click/tap — use once so listener is removed after first run
// document.addEventListener("click", resumeAudioOnInteraction, { once: true });

const tickSound = new Audio("./tick.wav");
tickSound.volume = 0.3;
video.volume = 0.4;
// const hourSound = new Audio("sounds/hour.mp3");

function playTick(type = 'second') {
  if (type === 'second') {
    tickSound.currentTime = 0;     
    tickSound.play();
  } else if (type === 'hour') {
    hourSound.currentTime = 0;
    hourSound.play();
  }
}

// Function to update clock hands
function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const secondsDegree = Math.round((seconds / 60) * 360);
  const minutesDegree = Math.round((minutes / 60) * 360);
  const hoursDegree = Math.round((hours / 12) * 360 + (minutes / 60) * 30);
  secondHand[0].style.transform = `rotate(${secondsDegree}deg)`;
  minuteHand[0].style.transform = `rotate(${minutesDegree}deg)`;
  hourHand[0].style.transform = `rotate(${hoursDegree}deg)`;
}
setInterval(_updateAndTick, 1000);
// Keep track of previous hour so we can play an hour-tick when it changes
let _prevHour = null;

function _updateAndTick() {
  updateClock();

  // initialize/ensure audio context exists (will be resumed after user interaction)
  // initAudio();

  // Play second tick every time (updateClock called once per second)
  try {
    playTick("second");
  } catch (e) {
    console.log(e);
  }

  // Play hour tick when the hour changes
  const now = new Date();
  const currentHour = now.getHours();
  if (_prevHour === null) _prevHour = currentHour;
  else if (currentHour !== _prevHour) {
    try {
      playTick("hour");
    } catch (e) {}
    _prevHour = currentHour;
  }
}

_updateAndTick(); 
