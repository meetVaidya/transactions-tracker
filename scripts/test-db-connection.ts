import { Pool, PoolConfig } from "pg";

// Database configuration
const dbConfig: PoolConfig = {
  user: "admin", // Replace with your database user
  host: "172.18.0.5", // IPv4Address of the container
  database: "financial_transactions", // Replace with your database name
  password: "password", // Replace with your password
  port: 5432, // Default PostgreSQL port
};
// Create a pool
const pool = new Pool(dbConfig);

// Example function to test the connection
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log("Successfully connected to the database");

    // Example query
    const result = await client.query("SELECT NOW()");
    console.log("Current time:", result.rows[0]);

    client.release();
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    // Close pool on application termination
    await pool.end();
  }
}

// Run the test
testConnection();
