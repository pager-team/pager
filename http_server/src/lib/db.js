import db from "promise-mysql";
import config from "../config.js";

const pool = db.createPool({
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  connectionLimit: 10
});

export default pool;
