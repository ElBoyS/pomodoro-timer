const timer = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
  mode: "work",
};

let interval;
const modes = document.querySelector(".timer__header");
const button = document.querySelector(".timer__start");
const buttonSound = document.querySelector('[data-sound="start"]');
const buttonSoundEnd = document.querySelector('[data-sound="end"]');
const clock = document.querySelector(".timer__clock");
const progress = document.querySelector(".progress__value");

button.addEventListener("click", (e) => {
  const { target } = e;
  buttonSound.play();

  if (target.dataset.process === "start") {
    startTimer();
  } else {
    stopTimer();
  }
});

function getRemainingTime(endTime) {
  const currentTime = Date.parse(new Date());
  const difference = endTime - currentTime;

  const total = Number.parseInt(difference / 1000, 10);
  const minutes = Number.parseInt((total / 60) % 60, 10);
  const seconds = Number.parseInt(total % 60, 10);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.remainingTime;
  const endTime = Date.parse(new Date()) + total * 1000;

  interval = setInterval(function () {
    timer.remainingTime = getRemainingTime(endTime);
    updateClock();

    total = timer.remainingTime.total;
    if (total <= 0) {
      clearInterval(interval);
      buttonSoundEnd.play();
      switch (timer.mode) {
        case "work":
          switchMode("shortBreak");
          break;
        default:
          switchMode("work");
          break;
      }
    }

    progress.style.width =
      (timer.remainingTime.total * 100) / (timer[timer.mode] * 60) + "%";
  }, 1000);

  button.dataset.process = "pause";
  button.classList.add("timer__start--active");
}
function stopTimer() {
  button.dataset.process = "start";
  button.classList.remove("timer__start--active");
  clearInterval(interval);
}

function updateClock() {
  const { remainingTime } = timer;

  const minutes = `${remainingTime.minutes}`.padStart(2, "0");
  const seconds = `${remainingTime.seconds}`.padStart(2, "0");

  const min = document.getElementById("min");
  const sec = document.getElementById("sec");
  min.textContent = minutes;
  sec.textContent = seconds;
}

modes.addEventListener("click", handleChangeMode);

function handleChangeMode(e) {
  const target = e.target.closest(".timer-mode");
  const { mode: modes } = target.dataset;
  if (!modes) return;
  switchMode(modes);
}

function switchMode(mode) {
  timer.mode = mode;
  timer.remainingTime = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: 0,
  };

  Array.from(modes.children).forEach((elem) => {
    if (elem.dataset.mode === timer.mode) {
      elem.classList.add("active");
    } else {
      elem.classList.remove("active");
    }
  });

  updateClock();
  changeTheme(mode);
  stopTimer();
}

function changeTheme(mode) {
  switch (mode) {
    case "work":
      document.body.style.backgroundColor = "#0d0404";
      break;
    case "shortBreak":
      document.body.style.backgroundColor = "#040D06";
      break;
    case "longBreak":
      document.body.style.backgroundColor = "#04090D";
      break;
  }
}

switchMode("work");

clock.addEventListener("click", handleChangeTime);
function handleChangeTime(e) {
  const { target } = e;

  const action = target.dataset.operation;
  if (!action) return;

  stopTimer();
  if (action === "plus") {
    timer.remainingTime.total += 60;
    timer.remainingTime.minutes += 1;
    timer[timer.mode] += 1;
  } else {
    if (timer.remainingTime.minutes <= 1) {
      return;
    }
    timer.remainingTime.total -= 60;
    timer.remainingTime.minutes -= 1;
    timer[timer.mode] -= 1;
  }
  updateClock();
}
