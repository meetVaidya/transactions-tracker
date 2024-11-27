import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let client;
  try {
    client = await pool.connect();

    const [
      totalAmount,
      uniqueUsers,
      merchantStates,
      recentTransactions,
      monthlyData,
    ] = await Promise.all([
      client.query("SELECT SUM(amount) as total FROM transactions"),
      client.query(
        "SELECT COUNT(DISTINCT client_id) as count FROM transactions",
      ),
      client.query(
        "SELECT COUNT(DISTINCT merchant_state) as count FROM transactions",
      ),
      client.query("SELECT * FROM transactions ORDER BY date DESC LIMIT 5"),
      client.query(`
        SELECT
          date_trunc('month', date) as month,
          SUM(amount) as total
        FROM transactions
        GROUP BY date_trunc('month', date)
        ORDER BY month
        LIMIT 12
      `),
    ]);

    return NextResponse.json({
      totalAmount: totalAmount.rows[0]?.total || 0,
      uniqueUsers: uniqueUsers.rows[0]?.count || 0,
      merchantStates: merchantStates.rows[0]?.count || 0,
      recentTransactions: recentTransactions.rows || [],
      monthlyData: monthlyData.rows || [],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        totalAmount: 0,
        uniqueUsers: 0,
        merchantStates: 0,
        recentTransactions: [],
        monthlyData: [],
      },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
