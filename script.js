document.addEventListener("DOMContentLoaded", () => {

const questions = [
  { q: "Повышение CO₂ всегда напрямую повышает температуру на Земле.", a: "Миф", e: "Есть природные циклы, временно маскирующие эффект." },
  { q: "Арктика тает быстрее, чем Антарктида.", a: "Факт", e: "Арктический лёд тоньше и уязвимее." },
  { q: "Пластик в океане разлагается за 5 лет.", a: "Миф", e: "Пластик разлагается сотни лет." },
  { q: "Отказ от угля снижает выбросы CO₂.", a: "Факт", e: "Подтверждено опытом стран Европы." }
];

let current = 0;
let answered = 0;
let correct = 0;
let finished = false;
let lastSend = 0;

const start = document.getElementById("start");
const app = document.getElementById("app");
const card = document.getElementById("card");
const questionEl = document.getElementById("question");
const explanationEl = document.getElementById("explanation");
const scoreEl = document.getElementById("score");
const mythBtn = document.getElementById("myth");
const factBtn = document.getElementById("fact");
const nextBtn = document.getElementById("next");

// START
start.onclick = () => {
  document.documentElement.requestFullscreen?.();
  start.style.display = "none";
  app.classList.remove("hidden");
  showQuestion();
};

// SHOW QUESTION
function showQuestion() {
  card.className = "card";
  explanationEl.innerText = "";
  nextBtn.style.display = "none";
  questionEl.innerText = questions[current].q;
  updateScore();
}

// ANSWER
function answer(userAnswer) {
  if (nextBtn.style.display === "inline-block") return;

  const q = questions[current];
  answered++;

  if (userAnswer === q.a) {
    correct++;
    card.classList.add("correct");
  } else {
    card.classList.add("wrong");
  }

  explanationEl.innerText = `Правильный ответ: ${q.a}. ${q.e}`;
  nextBtn.style.display = "inline-block";
  sendStats(false);
}

// NEXT
nextBtn.onclick = () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    finished = true;
    questionEl.innerText = "Игра окончена 🎉";
    explanationEl.innerText = "";
    mythBtn.disabled = true;
    factBtn.disabled = true;
    nextBtn.style.display = "none";
    sendStats(true);
  }
};

// SCORE
function updateScore() {
  scoreEl.innerText = `Ответил: ${answered} | Правильно: ${correct}`;
}

// BUTTONS
mythBtn.onclick = () => answer("Миф");
factBtn.onclick = () => answer("Факт");

// SWIPE
let startX = null;

card.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

card.addEventListener("touchend", e => {
  if (startX === null) return;
  const diff = e.changedTouches[0].clientX - startX;
  if (diff > 60) answer("Факт");
  if (diff < -60) answer("Миф");
  startX = null;
});

// SEND TO GOOGLE SHEETS
function sendStats(isFinished) {
  const now = Date.now();
  if (now - lastSend < 3000) return;
  lastSend = now;

  fetch("https://script.google.com/macros/s/AKfycbyRR9dchP0bzgR0_JS1zbbvq3WQn50H8qBU-jIJm_l90XJgy70J2rx7z-HiWyaNOzFt/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      answered,
      correct,
      finished: isFinished
    })
  }).catch(() => {});
}

// CLOSE PAGE
window.addEventListener("beforeunload", () => {
  if (!finished && answered > 0) {
    navigator.sendBeacon(
      "https://script.google.com/macros/s/AKfycbyRR9dchP0bzgR0_JS1zbbvq3WQn50H8qBU-jIJm_l90XJgy70J2rx7z-HiWyaNOzFt/exec",
      JSON.stringify({
        answered,
        correct,
        finished: false
      })
    );
  }
});

});
