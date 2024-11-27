"use client";

import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export function TransactionRateGauge() {
  const [rate, setRate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRate(Math.floor(Math.random() * 100));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[200px] w-[200px] mx-auto">
      <CircularProgressbar
        value={rate}
        text={`${rate}/s`}
        styles={buildStyles({
          textSize: "16px",
          pathColor: `rgba(62, 152, 199, ${rate / 100})`,
          textColor: "#888888",
          trailColor: "#d6d6d6",
        })}
      />
    </div>
  );
}
