import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await query(`
    SELECT client_id, amount, date
    FROM transaction
    ORDER BY date DESC
    LIMIT 5
  `);
  res.status(200).json(result);
}
