"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Tooltip } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface TransactionMapProps {
  data: Array<{
    merchant_state: string;
    count: number;
  }>;
}

export function TransactionMap({ data }: TransactionMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  return (
    <div className="h-[400px] w-full">
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateData = data.find(
                (d) => d.merchant_state === geo.properties.name,
              );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    stateData
                      ? `rgba(0, 136, 254, ${Math.min(stateData.count / 1000, 1)})`
                      : "#EEE"
                  }
                  stroke="#FFF"
                  onMouseEnter={() => {
                    setTooltipContent(
                      `${geo.properties.name}: ${stateData ? stateData.count : 0} transactions`,
                    );
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      <Tooltip>{tooltipContent}</Tooltip>
    </div>
  );
}
