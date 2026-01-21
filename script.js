document.addEventListener("DOMContentLoaded", () => {

  // ================= НАСТРОЙКИ =================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRR9dchP0bzgR0_JS1zbbvq3WQn50H8qBU-jIJm_l90XJgy70J2rx7z-HiWyaNOzFt/execУ";

// ================= ВОПРОСЫ =================
const questions = [
  {
    q: "Plastic decomposes naturally in nature.",
    a: false,
    exp: "Plastic can take hundreds of years to decompose."
  },
  {
    q: "Glass can be recycled endlessly.",
    a: true,
    exp: "Glass does not lose quality when recycled."
  },
  {
    q: "Paper recycling saves trees.",
    a: true,
    exp: "Recycling paper reduces deforestation."
  }
];

// ================= ПЕРЕМЕННЫЕ =================
let current = 0;
let answered = 0;
let correct = 0;
let finished = false;

// ================= ЭЛЕМЕНТЫ =================
const startBtn = document.getElementById("startBtn");
const game = document.getElementById("game");
const card = document.getElementById("card");
const questionEl = document.getElementById("question");
const feedbackEl = document.getElementById("feedback");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("nextBtn");

// ================= СТАРТ =================
startBtn.onclick = () => {
  document.documentElement.requestFullscreen?.();
  startBtn.style.display = "none";
  game.classList.remove("hidden");
  showQuestion();
};

// ================= ПОКАЗ ВОПРОСА =================
function showQuestion() {
  card.className = "";
  feedbackEl.innerText = "";
  nextBtn.style.display = "none";

  questionEl.innerText = questions[current].q;
  scoreEl.innerText = `Answered: ${answered} | Correct: ${correct}`;
}

// ================= ОТВЕТ =================
function answer(userAnswer) {
  if (finished) return;

  answered++;
  const isCorrect = questions[current].a === userAnswer;
  if (isCorrect) correct++;

  card.classList.add(isCorrect ? "correct" : "wrong");

  feedbackEl.innerText =
    (isCorrect ? "✔ Correct. " : "✖ Wrong. ") +
    questions[current].exp;

  sendProgress();
  nextBtn.style.display = "inline-block";
}

// ================= СЛЕДУЮЩИЙ ВОПРОС =================
nextBtn.onclick = () => {
  current++;

  if (current >= questions.length) {
    finishGame();
  } else {
    showQuestion();
  }
};

// ================= ФИНИШ =================
function finishGame() {
  finished = true;

  questionEl.innerText = "Game finished!";
  feedbackEl.innerText = `Final score: ${correct} / ${answered}`;
  nextBtn.style.display = "none";

  sendProgress(true);
}

// ================= ОТПРАВКА ДАННЫХ =================
function sendProgress(final = false) {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      answered: answered,
      correct: correct,
      total: questions.length,
      percent: answered
        ? Math.round((correct / answered) * 100)
        : 0,
      finished: final
    })
  });
}

// ================= ЕСЛИ ЗАКРЫЛИ СТРАНИЦУ =================
window.addEventListener("beforeunload", () =>
});
