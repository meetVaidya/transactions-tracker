import { query } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await query(
    "SELECT COUNT(DISTINCT client_id) AS unique_users FROM transaction",
  );
  res.status(200).json(result[0].unique_users);
}
