import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await query(`
    SELECT DATE_TRUNC('month', date) AS month, SUM(amount) AS total
    FROM transaction
    GROUP BY month
    ORDER BY month
  `);
  res.status(200).json(result);
}
