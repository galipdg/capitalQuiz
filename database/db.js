import pg from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

dotenv.config();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    logger.error("Unable to connect to the database.", err.stack);
  } else {
    logger.info("Connected to the database successfully.");
  }
});

export default db;