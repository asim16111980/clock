// Get references for elements
const secondHand = document.getElementsByClassName("second");
const minuteHand = document.getElementsByClassName("minute");
const hourHand = document.getElementsByClassName("hour");
const modeSwitch = document.getElementsByClassName("mode-switch")
const video = document.getElementById("video");

// Handle mode switching
modeSwitch[0].addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

document.addEventListener("click", () => {
  video.muted = false;
});

const tickSound = new Audio("./tick.wav");
tickSound.volume = 0.3;
video.volume = 0.4;
// const hourSound = new Audio("sounds/hour.mp3");

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

function _updateAndTick() {
  updateClock();

  // Play second tick every time (updateClock called once per second)
  try {
    tickSound.currentTime = 0;
    tickSound.play();
  } catch (e) {
    console.log(e);
  }
}

_updateAndTick();
