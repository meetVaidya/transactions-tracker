"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionVolumeChart } from "@/components/transaction-volume-chart";
import { ProcessingLatencyChart } from "@/components/processing-latency-chart";
import { TransactionStatusChart } from "@/components/transaction-status-chart";
import { TopRegionsChart } from "@/components/top-regions-chart";
import { TransactionMap } from "@/components/transaction-map";
import { TransactionRateGauge } from "@/components/transaction-rate-gauge";
import { TransactionTable } from "@/components/transaction-table";

async function getData() {
  const res = await fetch("http://localhost:3000/api/visualizations", {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function VisualizationsPage() {
  const [data, setData] = useState<{
    volumeData: any;
    latencyData: any;
    statusData: any;
    topRegionsData: any;
    mapData: any;
    recentTransactions: any;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getData();
      setData(result);
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Visualizations</h2>
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
              <CardTitle>Processing Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <ProcessingLatencyChart data={data.latencyData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Transaction Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionStatusChart data={data.statusData} />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Top Regions by Transaction Count</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <TopRegionsChart data={data.topRegionsData} />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Transaction Map</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionMap data={data.mapData} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Real-time Transaction Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionRateGauge />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTable data={data.recentTransactions} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
