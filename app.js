//-------------------------------------------------------
// GLOBAL STATE
//-------------------------------------------------------
let mlModel = null;
let currentQuiz = [];
let currentIndex = 0;
let selectedAnswers = [];
let score = 0;
let currentObjectName = "";

const FAV_KEY = "arQuizSaved"; // favourite questions
const RECENT_KEY = "arQuizRecentScan"; // recently scanned objects
const STATS_KEY = "arQuizStats"; // performance stats

// Screens
const screens = {
  home: document.getElementById("home-screen"),
  scan: document.getElementById("scan-screen"),
  quiz: document.getElementById("quiz-screen"),
  score: document.getElementById("score-screen"),
  answer: document.getElementById("answer-screen"),
  library: document.getElementById("library-screen"),
  help: document.getElementById("help-screen"),
};

function show(name) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[name].classList.remove("hidden");
}

//-------------------------------------------------------
// CAMERA ELEMENTS
//-------------------------------------------------------
const video = document.getElementById("cameraVideo");
const canvas = document.getElementById("cameraCanvas");
const ctx = canvas.getContext("2d");
const scanStatus = document.getElementById("scan-status");
const predictionText = document.getElementById("prediction-text");
let stream = null;

//-------------------------------------------------------
// LOAD ML MODEL
//-------------------------------------------------------
async function loadModel() {
  if (!mlModel) {
    scanStatus.textContent = "Loading AI model...";
    mlModel = await mobilenet.load();
    scanStatus.textContent = "Model Ready!";
  }
}

//-------------------------------------------------------
// CAMERA CONTROL
//-------------------------------------------------------
async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    scanStatus.textContent = "Camera ON – Hold object steadily.";
  } catch (e) {
    scanStatus.textContent = "Camera permission denied.";
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
  }
  scanStatus.textContent = "Camera stopped.";
}

//-------------------------------------------------------
// CAPTURE + DETECT
//-------------------------------------------------------
async function captureAndDetect() {
  await loadModel();

  if (!stream) {
    scanStatus.textContent = "Start camera first.";
    return;
  }

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  const preds = await mlModel.classify(video);
  if (!preds.length) {
    predictionText.textContent = "Cannot detect object. Try again.";
    return;
  }

  const top = preds[0];
  currentObjectName = top.className;

  predictionText.textContent = `Detected: ${currentObjectName} (${(
    top.probability * 100
  ).toFixed(1)}%)`;

  // store in recent scans
  const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  recent.push({
    object: currentObjectName,
    time: new Date().toLocaleString(),
  });
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));

  generateQuiz(currentObjectName);
  startQuiz();
}

//-------------------------------------------------------
// EXPLANATION GENERATOR
//-------------------------------------------------------
function explanation(obj) {
  return `The ${obj.toLowerCase()} must be handled carefully to avoid accidents and to follow proper laboratory safety rules.`;
}

//-------------------------------------------------------
// QUIZ GENERATOR
//-------------------------------------------------------
function generateQuiz(obj) {
  const o = obj.toLowerCase();

  currentQuiz = [
    {
      q: `What is the safe use of a ${o}?`,
      options: [
        `Using the ${o} correctly`,
        `Using the ${o} randomly`,
        `Ignoring all safety rules`,
        `Throwing the ${o} around`,
      ],
      answer: 0,
      why: explanation(o),
    },
    {
      q: `Which precaution is important while handling a ${o}?`,
      options: [
        `Wear proper lab PPE such as gloves and goggles`,
        `Use it with wet or slippery hands`,
        `Share it without cleaning`,
        `Keep it near the edge of the table`,
      ],
      answer: 0,
      why: explanation(o),
    },
    {
      q: `When should a ${o} NOT be used?`,
      options: [
        `If it is cracked, damaged or unsafe`,
        `Whenever a friend asks`,
        `Whenever you are bored`,
        `Whenever it looks shiny`,
      ],
      answer: 0,
      why: explanation(o),
    },
    {
      q: `Where should a ${o} be stored after use?`,
      options: [
        `In its proper storage area or rack`,
        `On the floor`,
        `In a random bag`,
        `On top of unstable objects`,
      ],
      answer: 0,
      why: explanation(o),
    },
    {
      q: `Why should a ${o} be handled gently?`,
      options: [
        `To prevent spills, breakage and injuries`,
        `Just for fun`,
        `There is no reason`,
        `To waste more time`,
      ],
      answer: 0,
      why: explanation(o),
    },
  ];

  selectedAnswers = new Array(currentQuiz.length).fill(null);
}

//-------------------------------------------------------
// QUIZ FLOW
//-------------------------------------------------------
function startQuiz() {
  currentIndex = 0;
  show("quiz");
  renderQuestion();
}

function renderQuestion() {
  const q = currentQuiz[currentIndex];

  document.getElementById(
    "quiz-title"
  ).textContent = `Quiz – ${currentObjectName}`;
  document.getElementById("question-text").textContent = q.q;

  const optionsBox = document.getElementById("options");
  optionsBox.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";

    if (selectedAnswers[currentIndex] === idx) {
      btn.style.background = "#16a34a";
    }

    btn.onclick = () => {
      selectedAnswers[currentIndex] = idx;
      document
        .querySelectorAll(".option-btn")
        .forEach((b) => (b.style.background = "#2563eb"));
      btn.style.background = "#16a34a";
    };

    optionsBox.appendChild(btn);
  });

  document.getElementById("progress-text").textContent = `Question ${
    currentIndex + 1
  } of ${currentQuiz.length}`;

  const isLast = currentIndex === currentQuiz.length - 1;
  document.getElementById("btn-submit").classList.toggle("hidden", !isLast);
}

//-------------------------------------------------------
// SCORE + STATS
//-------------------------------------------------------
function updateStats(latestScore, totalQuestions) {
  const percent = Math.round((latestScore * 100) / totalQuestions);
  let stats = JSON.parse(localStorage.getItem(STATS_KEY) || "null");

  if (!stats) {
    stats = {
      attempts: 1,
      sumPercent: percent,
      bestPercent: percent,
      lastPercent: percent,
    };
  } else {
    stats.attempts += 1;
    stats.sumPercent += percent;
    stats.lastPercent = percent;
    if (percent > stats.bestPercent) stats.bestPercent = percent;
  }

  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  return stats;
}

function showScore() {
  // compute score
  score = 0;
  currentQuiz.forEach((q, i) => {
    if (selectedAnswers[i] === q.answer) score++;
  });

  document.getElementById(
    "score-display"
  ).textContent = `You scored ${score} out of ${currentQuiz.length}.`;

  const stats = updateStats(score, currentQuiz.length);
  const avg = Math.round(stats.sumPercent / stats.attempts);

  document.getElementById(
    "score-stats"
  ).textContent = `Last: ${stats.lastPercent}%  |  Best: ${stats.bestPercent}%  |  Attempts: ${stats.attempts}  |  Avg: ${avg}%`;

  show("score");
}

//-------------------------------------------------------
// ANSWER SCREEN (All / Correct / Wrong)
//-------------------------------------------------------
function renderAnswers(filter) {
  const box = document.getElementById("answers-list");
  box.innerHTML = "";

  currentQuiz.forEach((q, i) => {
    const user = selectedAnswers[i];
    const correct = q.answer;
    const isCorrect = user === correct;

    if (filter === "correct" && !isCorrect) return;
    if (filter === "wrong" && isCorrect) return;

    const div = document.createElement("p");
    div.innerHTML = `
      <strong>Q${i + 1}:</strong> ${q.q}<br>
      <strong>Your Answer:</strong> ${q.options[user] ?? "Not answered"}<br>
      <strong>Correct Answer:</strong> ${q.options[correct]}<br>
      <strong>Description:</strong> ${q.why}
    `;

    div.style.borderLeft = isCorrect
      ? "5px solid #16a34a"
      : "5px solid #dc2626";

    box.appendChild(div);
  });
}

function showAnswersAll() {
  renderAnswers("all");
  show("answer");
}
function showAnswersCorrect() {
  renderAnswers("correct");
  show("answer");
}
function showAnswersWrong() {
  renderAnswers("wrong");
  show("answer");
}

//-------------------------------------------------------
// SAVE ONE QUESTION (from Quiz)
//-------------------------------------------------------
document.getElementById("btn-save-question").onclick = () => {
  const q = currentQuiz[currentIndex];
  const favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");

  favs.push({
    object: currentObjectName,
    question: q.q,
    answer: q.options[q.answer],
    description: q.why,
  });

  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  alert("Question saved to favourites.");
};

//-------------------------------------------------------
// SAVE ALL WRONG QUESTIONS (from Answer Screen)
//-------------------------------------------------------
document.getElementById("btn-save-wrong").onclick = () => {
  const favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");

  currentQuiz.forEach((q, i) => {
    const user = selectedAnswers[i];
    const correct = q.answer;
    if (user !== correct) {
      // wrong or not answered
      favs.push({
        object: currentObjectName,
        question: q.q,
        answer: q.options[correct],
        description: q.why,
      });
    }
  });

  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  alert("All wrong questions saved.");
};

//-------------------------------------------------------
// LIBRARY (Favourite + Recently Scanned) + REMOVE
//-------------------------------------------------------
function loadLibrary() {
  const favList = document.getElementById("fav-list");
  const recentList = document.getElementById("recent-list");
  favList.innerHTML = "";
  recentList.innerHTML = "";

  const favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");

  if (favs.length === 0) {
    favList.innerHTML = "<li>No favourite questions saved yet.</li>";
  } else {
    favs.forEach((f, idx) => {
      const li = document.createElement("li");
      li.innerHTML =
        `${f.object} → ${f.question} → Correct: ${f.answer}` +
        ` <button class="chip-btn remove-fav" data-index="${idx}">Remove</button>`;
      favList.appendChild(li);
    });
  }

  if (recent.length === 0) {
    recentList.innerHTML = "<li>No objects scanned yet.</li>";
  } else {
    recent.forEach((r, idx) => {
      const li = document.createElement("li");
      li.innerHTML =
        `${r.time} – ${r.object}` +
        ` <button class="chip-btn remove-recent" data-index="${idx}">Remove</button>`;
      recentList.appendChild(li);
    });
  }

  attachLibraryRemoveHandlers();
  show("library");
}

function attachLibraryRemoveHandlers() {
  document.querySelectorAll(".remove-fav").forEach((btn) => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index, 10);
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
      favs.splice(idx, 1);
      localStorage.setItem(FAV_KEY, JSON.stringify(favs));
      loadLibrary();
    };
  });

  document.querySelectorAll(".remove-recent").forEach((btn) => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index, 10);
      const rec = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
      rec.splice(idx, 1);
      localStorage.setItem(RECENT_KEY, JSON.stringify(rec));
      loadLibrary();
    };
  });
}

// Clear all favourites / recent
document.getElementById("btn-clear-fav").onclick = () => {
  localStorage.setItem(FAV_KEY, JSON.stringify([]));
  loadLibrary();
};

document.getElementById("btn-clear-recent").onclick = () => {
  localStorage.setItem(RECENT_KEY, JSON.stringify([]));
  loadLibrary();
};

//-------------------------------------------------------
// BUTTON HANDLERS
//-------------------------------------------------------
document.getElementById("btn-scan").onclick = () => show("scan");
document.getElementById("btn-help").onclick = () => show("help");
document.getElementById("btn-help-back").onclick = () => show("home");

document.getElementById("btn-start-camera").onclick = startCamera;
document.getElementById("btn-stop-camera").onclick = stopCamera;
document.getElementById("btn-capture").onclick = captureAndDetect;

document.getElementById("btn-scan-back").onclick = () => {
  stopCamera();
  show("home");
};

document.getElementById("btn-prev").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
};
document.getElementById("btn-next").onclick = () => {
  if (currentIndex < currentQuiz.length - 1) {
    currentIndex++;
    renderQuestion();
  }
};
document.getElementById("btn-submit").onclick = showScore;
document.getElementById("btn-view-answers").onclick = showAnswersAll;

document.getElementById("btn-show-all").onclick = showAnswersAll;
document.getElementById("btn-show-correct").onclick = showAnswersCorrect;
document.getElementById("btn-show-wrong").onclick = showAnswersWrong;

document.getElementById("btn-answer-back").onclick = () => show("score");
document.getElementById("btn-answer-exit").onclick = () => show("home");

document.getElementById("btn-score-back").onclick = () => show("quiz");
document.getElementById("btn-score-exit").onclick = () => show("home");

document.getElementById("btn-library-back").onclick = () => show("home");
document.getElementById("btn-library").onclick = loadLibrary;

document.getElementById("btn-quiz-back").onclick = () => show("scan");
document.getElementById("btn-quiz-exit").onclick = () => show("home");
