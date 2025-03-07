import db from "../database/db.js";
import logger from "../utils/logger.js";

let quiz = [];

export const loadQuizData = async () => {
  try {
    const result = await db.query("SELECT * FROM capitals");
    quiz = result.rows;
    logger.info(`Quiz data loaded successfully. Total questions: ${quiz.length}`);
  } catch (err) {
    logger.error("Error loading quiz data:", err.message);
  }
};

export { quiz };