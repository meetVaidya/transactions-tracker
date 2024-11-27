import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let client;
  try {
    client = await pool.connect();

    const [volumeData, statusData, topRegionsData, mapData] = await Promise.all(
      [
        client.query(`
        SELECT date_trunc('day', date) as day, COUNT(*) as count
        FROM transactions
        GROUP BY day
        ORDER BY day
        LIMIT 30
      `),
        client.query(`
          SELECT
            CASE
              WHEN use_chip THEN 'Chip'
              ELSE 'Non-Chip'
            END as status,
            COUNT(*) as count,
            SUM(amount) as total_amount
          FROM transactions
          GROUP BY use_chip
      `),
        client.query(`
            SELECT merchant_state, COUNT(*) as count, SUM(amount) as total_amount
            FROM transactions
            GROUP BY merchant_state
            ORDER BY count DESC
            LIMIT 10
          `),
        client.query(`
          WITH state_centers AS (
            SELECT state, lat, lon
            FROM (
              VALUES
                ('AL', 32.7794, -86.8287),
                ('AK', 64.2008, -149.4937),
                ('AZ', 34.0489, -111.0937),
                ('AR', 34.7465, -92.2896),
                ('CA', 37.2734, -119.2735),
                ('CO', 38.9972, -105.5478),
                ('CT', 41.6219, -72.7273),
                ('DE', 38.9896, -75.5050),
                ('DC', 38.9072, -77.0369),
                ('FL', 28.6305, -82.4497),
                ('GA', 32.6415, -83.4426),
                ('HI', 20.2927, -156.3737),
                ('ID', 44.2394, -114.5103),
                ('IL', 40.0417, -89.1965),
                ('IN', 39.8942, -86.2816),
                ('IA', 42.0751, -93.4960),
                ('KS', 38.4937, -98.3804),
                ('KY', 37.5347, -85.3021),
                ('LA', 31.0689, -91.9968),
                ('ME', 45.3695, -69.2428),
                ('MD', 39.0458, -76.6413),
                ('MA', 42.2596, -71.8083),
                ('MI', 44.3467, -85.4102),
                ('MN', 46.2807, -94.3053),
                ('MS', 32.7364, -89.6678),
                ('MO', 38.3566, -92.4580),
                ('MT', 46.9219, -110.4544),
                ('NE', 41.5378, -99.7951),
                ('NV', 38.8026, -116.4194),
                ('NH', 43.6805, -71.5811),
                ('NJ', 40.1907, -74.6728),
                ('NM', 34.4071, -106.1126),
                ('NY', 42.9538, -75.5268),
                ('NC', 35.5557, -79.3877),
                ('ND', 47.4501, -100.4659),
                ('OH', 40.2862, -82.7937),
                ('OK', 35.5889, -97.4943),
                ('OR', 43.9336, -120.5583),
                ('PA', 40.8781, -77.7996),
                ('RI', 41.6762, -71.5562),
                ('SC', 33.8569, -80.9450),
                ('SD', 44.2853, -100.2264),
                ('TN', 35.8580, -86.3505),
                ('TX', 31.4757, -99.3312),
                ('UT', 39.3055, -111.6703),
                ('VT', 44.0687, -72.6658),
                ('VA', 37.5215, -78.8537),
                ('WA', 47.3826, -120.4472),
                ('WV', 38.6409, -80.6227),
                ('WI', 44.2563, -89.6385),
                ('WY', 42.9957, -107.5512)
            ) AS s(state, lat, lon)
          )
          SELECT
            s.state,
            s.lat,
            s.lon,
            COALESCE(COUNT(t.merchant_state), 0) as count,
            ROUND(COALESCE(AVG(t.amount)::numeric, 0), 2) as avg_amount
          FROM state_centers s
          LEFT JOIN transactions t ON s.state = t.merchant_state
          GROUP BY s.state, s.lat, s.lon
          ORDER BY count DESC`),
      ],
    );

    return NextResponse.json({
      volumeData: volumeData.rows || [],
      statusData: statusData.rows || [],
      topRegionsData: topRegionsData.rows || [],
      mapData: mapData.rows || [],
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        volumeData: [],
        statusData: [],
        topRegionsData: [],
        mapData: [],
      },
      { status: 500 },
    );
  } finally {
    if (client) client.release();
  }
}
