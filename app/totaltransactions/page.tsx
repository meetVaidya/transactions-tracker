"use client";

import { useEffect, useState } from "react";

const TotalTransactionAmount = () => {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/total-transaction")
      .then((res) => res.json())
      .then((data) => setTotal(data.total))
      .catch((error) => {
        console.error("Error fetching total:", error);
      });
  }, []);

  return (
    <div>
      <h3>Total Transaction Amount</h3>
      <p>${total?.toFixed(2)}</p>
    </div>
  );
};

export default TotalTransactionAmount;
