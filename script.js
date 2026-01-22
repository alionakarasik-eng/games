/******** НАСТРОЙКА ********/
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxh3QsO6TMTJpk0exm9nuY90e8zuB8JuDPop8OA_60lIUFsrGBpVcuN5YxFztME-xhw/exec";
const ANTI_SPAM_DELAY = 30000; // 30 секунд

/******** ВОПРОСЫ (НЕ ТРОГАЕМ) ********/
const questions = [
  { q:"Повышение CO₂ всегда напрямую повышает температуру на Земле.", a:"Миф", exp:"Есть локальные циклы, которые могут временно маскировать эффект." },
  { q:"Арктика тает быстрее, чем Антарктида.", a:"Факт", exp:"Северные льды тоньше и тают быстрее." },
  { q:"Ледники в Гренландии тают только из-за естественных циклов.", a:"Миф", exp:"Антропогенные выбросы ускоряют процесс." },
  { q:"За последние 100 лет температура Земли выросла примерно на 1°C.", a:"Факт", exp:"Это подтверждено климатологами." },
  { q:"Пластик разлагается за 5 лет.", a:"Миф", exp:"Он разлагается сотни лет." }
];

/******** СОСТОЯНИЕ ********/
let current = 0;
let score = 0;
let answered = 0;
let isFinished = false;
let lastSendTime = 0;

/******** ЭЛЕМЕНТЫ ********/
const card = document.getElementById("card");
const qEl = document.getElementById("question");
const aEl = document.getElementById("answer");
const nextBtn = document.getElementById("next");

/******** ПОКАЗ ВОПРОСА ********/
function showQuestion() {
  card.className = "card hide";
  setTimeout(() => {
    qEl.innerText = questions[current].q;
    aEl.innerText = "";
    card.className = "card";
    nextBtn.style.display = "none";
  }, 300);
}

/******** ОТВЕТ ********/
function answer(userAnswer) {
  if (nextBtn.style.display === "inline-block") return;

  const correct = questions[current].a === userAnswer;
  answered++;

  if (correct) score++;

  card.classList.add(correct ? "correct" : "wrong");

  aEl.innerText =
    (correct ? "✔ Правильно. " : "✖ Неправильно. ") +
    questions[current].exp;

  nextBtn.style.display = "inline-block";
}

/******** ДАЛЕЕ ********/
nextBtn.onclick = () => {
  card.classList.remove("correct","wrong");
  current++;

  if (current < questions.length) {
    showQuestion();
  } else {
    isFinished = true;
    qEl.innerText = "Игра окончена 🎉";
    aEl.innerText = `Результат: ${score} из ${answered}`;
    sendResult(true);
  }
};

/******** КНОПКИ ********/
document.getElementById("myth").onclick = () => answer("Миф");
document.getElementById("fact").onclick = () => answer("Факт");

/******** СТАРТ ********/
document.getElementById("start").onclick = () => {
  document.documentElement.requestFullscreen?.();
  document.getElementById("start").style.display = "none";
  document.getElementById("app").style.display = "flex";
  showQuestion();
};

/******** СВАЙПЫ ********/
let startX = 0;
card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
card.addEventListener("touchend", e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (dx > 60) answer("Факт");
  if (dx < -60) answer("Миф");
});

/******** ОТПРАВКА В GOOGLE SHEETS ********/
function sendResult(finishedFlag) {
  const now = Date.now();
  if (now - lastSendTime < ANTI_SPAM_DELAY) return;
  lastSendTime = now;

  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      score: score,
      answered: answered,
      total: questions.length,
      finished: finishedFlag
    })
  }).catch(err => console.error("Send error", err));
}

/******** ЕСЛИ ВЫШЛИ ИЗ ИГРЫ ********/
window.addEventListener("beforeunload", () => {
  if (!isFinished && answered > 0) {
    sendResult(false);
  }
});

