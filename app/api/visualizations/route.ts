import { NextResponse } from "next/server";
import { getVisualizationData } from "@/lib/db";
import NextCors from "next-cors";

async function handler(req: Request) {
  // Run the middleware
  await NextCors(req, NextResponse, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  try {
    const data = await getVisualizationData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching visualization data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export const GET = handler;
