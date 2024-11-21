import { Pool } from "pg";

const pool = new Pool({
  user: "admin", // Username from the image
  host: "timescaledb", // Host URL from the image
  database: "financial_transactions", // Database name from the image
  password: "password", // Replace this with the actual password
  port: 5432, // Port from the image
});

export const query = async (text: string, params?: any[]) => {
  const res = await pool.query(text, params);
  return res.rows;
};
