const startScreen = document.getElementById("startScreen");
const enterButton = document.getElementById("enterButton");
const mainContent = document.getElementById("mainContent");
const topbar = document.getElementById("topbar");
const music = document.getElementById("music");
const muteToggle = document.getElementById("muteToggle");
const playPauseBtn = document.getElementById("playPauseBtn");
const volumeControl = document.getElementById("volumeControl");
const countdown = document.getElementById("countdown");
const capsuleStatus = document.getElementById("capsuleStatus");
const futureMessage = document.getElementById("futureMessage");

const unlockAt = new Date(2027, 9, 23, 0, 0, 0); // 23 October 2027, local time
let muted = false;

music.volume = Number(volumeControl.value) / 100;

async function enterSite() {
  startScreen.classList.add("hidden");
  mainContent.classList.remove("hidden");
  topbar.classList.remove("hidden");
  document.body.classList.add("entered");

  // Attempt playback directly from the user's click. Some browsers may still block it.
  try {
    await music.play();
    playPauseBtn.textContent = "إيقاف مؤقت";
    muteToggle.textContent = "إيقاف الموسيقى";
  } catch (error) {
    playPauseBtn.textContent = "تشغيل الموسيقى";
    muteToggle.textContent = "إيقاف الموسيقى";
  }
  checkCapsuleDate();
  updateCountdown();
}

enterButton.addEventListener("click", enterSite);
startScreen.addEventListener("click", (event) => {
  if (event.target !== enterButton) enterSite();
});
startScreen.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    enterSite();
  }
});

muteToggle.addEventListener("click", () => {
  muted = !muted;
  music.muted = muted;
  muteToggle.textContent = muted ? "تشغيل الموسيقى" : "إيقاف الموسيقى";
  muteToggle.setAttribute("aria-pressed", String(muted));
  if (!muted && music.paused) {
    music.play().then(() => {
      playPauseBtn.textContent = "إيقاف مؤقت";
    }).catch(() => {
      playPauseBtn.textContent = "تشغيل الموسيقى";
    });
  }
});

playPauseBtn.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      playPauseBtn.textContent = "إيقاف مؤقت";
    } catch (error) {
      playPauseBtn.textContent = "تعذّر التشغيل";
    }
  } else {
    music.pause();
    playPauseBtn.textContent = "تشغيل الموسيقى";
  }
});

volumeControl.addEventListener("input", () => {
  music.volume = Number(volumeControl.value) / 100;
  if (music.volume > 0 && muted) {
    muted = false;
    music.muted = false;
    muteToggle.textContent = "إيقاف الموسيقى";
    muteToggle.setAttribute("aria-pressed", "false");
  }
});

document.querySelectorAll(".song").forEach((button) => {
  button.addEventListener("click", async () => {
    const src = button.dataset.src;
    if (!src) return;
    document.querySelectorAll(".song").forEach((song) => song.classList.remove("active"));
    button.classList.add("active");
    music.src = src;
    music.load();
    try {
      await music.play();
      playPauseBtn.textContent = "إيقاف مؤقت";
    } catch (error) {
      playPauseBtn.textContent = "تشغيل الموسيقى";
    }
  });
});

function checkCapsuleDate() {
  const isUnlocked = new Date() >= unlockAt;
  if (isUnlocked) {
    futureMessage.classList.remove("hidden");
    capsuleStatus.textContent = "وصل الموعد، والرسالة صارت إلك.";
    countdown.textContent = "انفتحت كبسولة الزمن";
  } else {
    futureMessage.classList.add("hidden");
    capsuleStatus.textContent = "هالرسالة بعدها ناطرة موعدها.";
  }
}

function updateCountdown() {
  const now = new Date();
  const remaining = unlockAt.getTime() - now.getTime();

  if (remaining <= 0) {
    checkCapsuleDate();
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  countdown.textContent = `باقي ${days} يوم، ${hours} ساعة، ${minutes} دقيقة، ${seconds} ثانية`;
}

checkCapsuleDate();
updateCountdown();
setInterval(() => {
  checkCapsuleDate();
  updateCountdown();
}, 1000);

music.addEventListener("ended", () => {
  playPauseBtn.textContent = "تشغيل الموسيقى";
});

const creatorGate = document.getElementById("creatorGate");
const creatorForm = document.getElementById("creatorForm");
const creatorName = document.getElementById("creatorName");
const creatorError = document.getElementById("creatorError");

const acceptedNames = [
  "abdulrahman",
  "عبد الرحمن",
  "abdulrahmandandachi",
  "عبد الرحمن دندشي"
];

creatorForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const enteredName = creatorName.value.trim().toLowerCase();

  if (acceptedNames.includes(enteredName)) {
    creatorGate.classList.add("hidden");
  } else {
    creatorError.classList.remove("hidden");
    creatorName.focus();
    creatorName.select();
  }
});

creatorName.addEventListener("input", () => {
  creatorError.classList.add("hidden");
});
