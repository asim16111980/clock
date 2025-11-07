// Get references for elements
const secondHand = document.getElementsByClassName("second");
const minuteHand = document.getElementsByClassName("minute");
const hourHand = document.getElementsByClassName("hour");
const modeSwitch = document.getElementsByClassName("mode-switch");

// Handle mode switching
modeSwitch[0].addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// --- Audio tick setup (Web Audio API) ---
let audioCtx = null;
let audioAllowed = false; // becomes true after user interaction/resume

function initAudio() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

// Resume audio on first user interaction (many browsers block autoplay)
function resumeAudioOnInteraction() {
  initAudio();
  if (audioCtx.state === "suspended") audioCtx.resume();
  audioAllowed = true;
}
// Try to resume on first click/tap — use once so listener is removed after first run
document.addEventListener("click", resumeAudioOnInteraction, { once: true });

// Play a short tick. type: 'second' or 'hour'
function playTick(type = "second") {
  if (!audioCtx) return; // not initialized yet
  // If audio hasn't been allowed/resumed yet, avoid playing (will be resumed on interaction)
  if (!audioAllowed && audioCtx.state !== "running") return;

  const now = audioCtx.currentTime;

  // Use an oscillator + gain envelope for a short click-like sound
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();

    if (type === "second") {
   // إعدادات صوت التكة الواقعية
  o.type = 'triangle';
  o.frequency.setValueAtTime(300, now);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.6, now + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(now);
    o.stop(now + 0.15);
  } else if (type === "hour") {
    // a slightly lower, longer tick for hours
    o.type = "sine";
    o.frequency.setValueAtTime(600, now);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.8, now + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    o.connect(g);
    g.connect(audioCtx.destination);
    o.start(now);
    o.stop(now + 0.2);
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
  const before = new Date();
  const prevSecond = before.getSeconds();
  updateClock();

  // initialize/ensure audio context exists (will be resumed after user interaction)
  initAudio();

  // Play second tick every time (updateClock called once per second)
  try {
    playTick("second");
  } catch (e) {
    // ignore audio errors
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

_updateAndTick(); // Initial call to set the clock immediately and play initial ticks if allowed
