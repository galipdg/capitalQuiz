import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { loadQuizData, quiz } from "./routes/quiz.js"; // Quiz işlemleri
import logger from "./utils/logger.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public"))); // Statik dosyalar için

let currentLanguage = "tr"; // Varsayılan dil
let currentQuestion;
let score = 0;
let gameActive = false; // Oyun durumu başlangıçta kapalı

// JSON dil dosyalarını oku
const getTranslations = (lang) => {
  const translationsPath = path.join(process.cwd(), "locales", `${lang}.json`);
  try {
    if (fs.existsSync(translationsPath)) {
      return JSON.parse(fs.readFileSync(translationsPath, "utf-8"));
    } else {
      logger.error(`Translations file for '${lang}' does not exist.`);
      return {};
    }
  } catch (err) {
    logger.error(`Error reading translations file for '${lang}': ${err.message}`);
    return {};
  }
};


const nextQuestion = () => {
  const randomIndex = Math.floor(Math.random() * quiz.length);
  currentQuestion = quiz[randomIndex];
  logger.info(`Next question is active with country ${currentQuestion.country} and capital ${currentQuestion.capital}`);
  return currentQuestion;
};

app.post("/change-language", (req, res) => {
  currentLanguage = req.body.lang || "tr";
  const translations = getTranslations(currentLanguage);

  res.render("index", {
    lang: currentLanguage,
    translations,
    score,
    country: null,
    isGameOver: false,
    gameActive, 
  });
});

// **Ana sayfa endpoint'i**
app.get("/", (req, res) => {
  const translations = getTranslations(currentLanguage);

  res.render("index", {
    lang: currentLanguage,
    translations,
    score: 0,
    country: null,
    isGameOver: false,
    gameActive, // Oyun aktif mi değil mi, bunu gönderiyoruz
  });
});

// **Oyun başlatma endpoint'i**
app.post("/start-game", (req, res) => {
  const translations = getTranslations(currentLanguage);
  score = 0; // Skoru sıfırla
  gameActive = true; // Oyun başladı
  nextQuestion();
  logger.info(`Game started with country ${currentQuestion.country} and capital ${currentQuestion.capital}`);

  res.render("index", {
    lang: currentLanguage,
    translations,
    score,
    country: currentQuestion.country,
    isGameOver: false,
    gameActive,
  });
});

// **Oyun bitirme endpoint'i**
app.post("/end-game", (req, res) => {
  gameActive = false; // Oyun bitti
  res.redirect("/");
});

// **Cevap gönderme endpoint'i**
app.post("/submit-answer", (req, res) => {
  const translations = getTranslations(currentLanguage);
  const userAnswer = req.body.answer;

  if (userAnswer.toLowerCase() === currentQuestion.capital.toLowerCase()) {
    score++;
    nextQuestion();

    res.render("index", {
      lang: currentLanguage,
      translations,
      score,
      country: currentQuestion.country,
      isGameOver: false,
      gameActive,
    });
  } else {
    gameActive = false;
    res.render("index", {
      lang: currentLanguage,
      translations,
      userAnswer: userAnswer,
      score,
      correctAnswer: currentQuestion.capital,
      country: currentQuestion.country,
      isGameOver: true,
      gameActive,
    });
  }
});

app.use((req, res) => res.status(404).send("Page not found"));

export default app;