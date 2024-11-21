import { NextResponse } from "next/server";
import { query } from "../../../lib/db";

export async function GET() {
  try {
    const result = await query("SELECT SUM(amount) AS total FROM transactions");

    // Add logging to debug
    console.log("Query result:", result);

    if (!result || result.length === 0) {
      return NextResponse.json({ total: 0 }, { status: 200 });
    }

    const total = result[0]?.total ?? 0;

    return NextResponse.json({ total }, { status: 200 });
  } catch (error: any) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 },
    );
  }
}
