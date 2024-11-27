"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionVolumeChart } from "@/components/transaction-volume-chart";
import Link from "next/link";
import { TransactionStatusChart } from "@/components/transaction-status-chart";
import { TopRegionsChart } from "@/components/top-regions-chart";
import { TransactionMap } from "@/components/transaction-map";
import { TransactionRateGauge } from "@/components/transaction-rate-gauge";

// Define interfaces for the data structure
interface VisualizationData {
  volumeData: any[]; // Replace 'any' with specific type
  statusData: any[];
  topRegionsData: any[];
  mapData: any[];
}

export default function VisualizationsPage() {
  const [data, setData] = useState<VisualizationData | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/visualizations");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const newData = await response.json();
      setData(newData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for subsequent fetches
    const interval = setInterval(fetchData, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Visualizations</h2>
        </div>
        <div className="flex space-x-4">
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
          >
            Overview
          </Link>
          <Link
            href="/analytics"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
          >
            Analytics
          </Link>
          <Link
            href="/reports"
            className="px-4 py-2 rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
          >
            Reports
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Transaction Volume Trends</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <TransactionVolumeChart data={data.volumeData} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Transaction Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionStatusChart data={data.statusData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Top Regions by Transaction Count</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <TopRegionsChart data={data.topRegionsData} />
            </CardContent>
          </Card>
          {/* <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Map</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <TransactionMap data={data.mapData} />
            </CardContent>
          </Card> */}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-3">
            {/* <TransactionMap data={data.mapData} /> */}
          </div>
          {/* <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Real-time Transaction Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionRateGauge />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
