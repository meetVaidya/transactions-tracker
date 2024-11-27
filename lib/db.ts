import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.DB_USER, // Username from the image
  host: process.env.DB_HOST, // Host URL from the image
  database: process.env.DB_NAME, // Database name from the image
  password: process.env.DB_PASSWORD, // Replace this with the actual password
  port: 5432, // Port from the image
});

export const query = async (text: string, params?: any[]) => {
  const res = await pool.query(text, params);
  return res.rows;
};
