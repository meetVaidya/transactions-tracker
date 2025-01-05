import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

export async function getDashboardData() {
  const client = await pool.connect();
  try {
    const totalAmount = await client.query(
      "SELECT SUM(amount) as total FROM transactions",
    );
    const uniqueUsers = await client.query(
      "SELECT COUNT(DISTINCT client_id) as count FROM transactions",
    );
    const merchantStates = await client.query(
      "SELECT COUNT(DISTINCT merchant_state) as count FROM transactions",
    );
    const recentTransactions = await client.query(
      "SELECT * FROM transactions ORDER BY date DESC LIMIT 5",
    );
    const monthlyData = await client.query(`
      SELECT
        date_trunc('month', date) as month,
        SUM(amount) as total
      FROM transactions
      GROUP BY date_trunc('month', date)
      ORDER BY month
      LIMIT 12
    `);

    return {
      totalAmount: totalAmount.rows[0].total,
      uniqueUsers: uniqueUsers.rows[0].count,
      merchantStates: merchantStates.rows[0].count,
      recentTransactions: recentTransactions.rows,
      monthlyData: monthlyData.rows,
    };
  } finally {
    client.release();
  }
}

export async function getVisualizationData() {
  const client = await pool.connect();
  try {
    const volumeData = await client.query(`
      SELECT date_trunc('day', date) as day, COUNT(*) as count
      FROM transactions
      GROUP BY day
      ORDER BY day
      LIMIT 30
    `);

    const latencyData = await client.query(`
      SELECT date_trunc('hour', date) as hour, AVG(EXTRACT(EPOCH FROM (date - lag(date) OVER (ORDER BY date)))) as avg_latency
      FROM transactions
      GROUP BY hour
      ORDER BY hour
      LIMIT 24
    `);

    const statusData = await client.query(`
      SELECT
        CASE
          WHEN use_chip = true THEN 'Chip'
          ELSE 'Non-Chip'
        END as status,
        COUNT(*) as count
      FROM transactions
      GROUP BY status
    `);

    const topRegionsData = await client.query(`
      SELECT merchant_state, COUNT(*) as count, SUM(amount) as total_amount
      FROM transactions
      GROUP BY merchant_state
      ORDER BY count DESC
      LIMIT 10
    `);

    const mapData = await client.query(`
      SELECT merchant_state, COUNT(*) as count
      FROM transactions
      GROUP BY merchant_state
    `);

    const recentTransactions = await client.query(`
      SELECT *
      FROM transactions
      ORDER BY date DESC
      LIMIT 100
    `);

    return {
      volumeData: volumeData.rows,
      latencyData: latencyData.rows,
      statusData: statusData.rows,
      topRegionsData: topRegionsData.rows,
      mapData: mapData.rows,
      recentTransactions: recentTransactions.rows,
    };
  } finally {
    client.release();
  }
}
