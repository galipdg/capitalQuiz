import app from "./app.js";
import { loadQuizData } from "./routes/quiz.js";
import logger from "./utils/logger.js";

const port = 3000;

// Sunucuyu başlat
app.listen(port, async () => {
  await loadQuizData(); // Quiz verilerini yükle
  logger.info(`Server is running at http://localhost:${port}`);
});

