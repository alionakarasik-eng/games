const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbylLGebraEHl4bJUIFuv8N0zA7o7h8pfD8vfCqmeJ-0xascY-OJgVzzsg8uKtQWj5CG/exec";

const questions = [
  {q:"Повышение CO₂ всегда напрямую повышает температуру на Земле.",a:"Миф",exp:"Есть локальные циклы, которые временно маскируют эффект."},
  {q:"Арктика тает быстрее, чем Антарктида, потому что там меньше льда.",a:"Факт",exp:"Северные льды тоньше и тают быстрее."},
  {q:"Ледники в Гренландии тают только из-за естественных циклов Земли.",a:"Миф",exp:"Антропогенные выбросы ускоряют таяние."},
  {q:"За последние 100 лет температура Земли выросла примерно на 1°C.",a:"Факт",exp:"Это подтверждено климатологами."},
  {q:"Пластик в океане разлагается за 5 лет.",a:"Миф",exp:"Он разлагается сотни лет."},
  {q:"Электромобили полностью экологичны.",a:"Миф",exp:"Производство батарей вредит природе."},
  {q:"Все животные одинаково реагируют на климат.",a:"Миф",exp:"Реакции сильно различаются."},
  {q:"Некоторые виды восстановились благодаря законам.",a:"Факт",exp:"Пример — калан и орлы."},
  {q:"ВИЭ не влияют на природу.",a:"Миф",exp:"Влияние есть, но польза выше."},
  {q:"Отказ от угля снижает выбросы CO₂.",a:"Факт",exp:"Подтверждено опытом Европы."}
];

let current = 0;
let score = 0;
let startX = 0;

const card = document.getElementById("card");
const qEl = document.getElementById("question");
const aEl = document.getElementById("answer");
const scoreEl = document.getElementById("score");
const nextBtn = document.getElementById("next");

function showQuestion() {
  card.classList.remove("correct","wrong");
  qEl.innerText = questions[current].q;
  aEl.innerText = "";
  scoreEl.innerText = `Счёт: ${score}/${questions.length}`;
  nextBtn.style.display = "none";
}

function answer(ans) {
  const correct = questions[current].a === ans;
  if (correct) score++;

  card.classList.add(correct ? "correct" : "wrong");
  aEl.innerText = `${correct ? "✔ Правильно" : "✖ Неправильно"} — ${questions[current].exp}`;
  scoreEl.innerText = `Счёт: ${score}/${questions.length}`;
  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    sendResult();
    qEl.innerText = "Игра окончена 🎉";
    aEl.innerText = `Ваш результат: ${score}/${questions.length}`;
    nextBtn.style.display = "none";
  }
};

document.getElementById("myth").onclick = () => answer("Миф");
document.getElementById("fact").onclick = () => answer("Факт");

// свайпы
card.addEventListener("touchstart", e => startX = e.touches[0].clientX);
card.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) answer(diff > 0 ? "Факт" : "Миф");
});

// старт + fullscreen
document.getElementById("start").onclick = () => {
  document.documentElement.requestFullscreen?.();
  document.getElementById("start").style.display = "none";
  document.getElementById("app").style.display = "flex";
  showQuestion();
};

// отправка статистики
function sendResult() {
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      score: score,
      total: questions.length,
      percent: Math.round(score / questions.length * 100),
      device: navigator.userAgent
    })
  });
}
