// "use client";

// import { useState } from "react";
// import {
//   ComposableMap,
//   Geographies,
//   Geography,
//   ZoomableGroup,
// } from "react-simple-maps";
// import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
// import { Button } from "./ui/button";

// const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// interface TransactionMapProps {
//   data: Array<{
//     merchant_state: string | null;
//     count: string;
//   }>;
// }

// export function TransactionMap({ data }: TransactionMapProps) {
//   const [tooltipContent, setTooltipContent] = useState("");
//   const [position, setPosition] = useState({
//     coordinates: [0, 0] as [number, number],
//     zoom: 1,
//   });

//   function handleZoomIn() {
//     if (position.zoom >= 4) return;
//     setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.2 }));
//   }

//   function handleZoomOut() {
//     if (position.zoom <= 1) return;
//     setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.2 }));
//   }

//   function handleMoveEnd(position: {
//     coordinates: [number, number];
//     zoom: number;
//   }) {
//     setPosition(position);
//   }

//   return (
//     <div className="relative h-full w-full">
//       <ComposableMap
//         projection="geoAlbersUsa"
//         projectionConfig={{ scale: 1000 }}
//         style={{
//           width: "100%",
//           height: "100%",
//         }}
//       >
//         <ZoomableGroup
//           zoom={position.zoom}
//           center={position.coordinates}
//           onMoveEnd={handleMoveEnd}
//         >
//           <Geographies geography={geoUrl}>
//             {({ geographies }) =>
//               geographies.map((geo) => {
//                 const stateAbbr = geo.properties.postal; // State abbreviation
//                 const stateData = data.find(
//                   (d) => d.merchant_state === stateAbbr,
//                 );
//                 const stateInfo = stateMapping[stateAbbr];

//                 return (
//                   <Geography
//                     key={geo.rsmKey}
//                     geography={geo}
//                     fill={
//                       stateData && stateData.count
//                         ? `rgba(0, 136, 254, ${Math.min(parseInt(stateData.count) / 1000, 1)})`
//                         : "#EEE"
//                     }
//                     stroke="#FFF"
//                     onMouseEnter={() => {
//                       if (stateData && stateInfo) {
//                         setTooltipContent(
//                           `${stateInfo.name}: ${stateData.count} transaction${
//                             parseInt(stateData.count) === 1 ? "" : "s"
//                           }`,
//                         );
//                       } else {
//                         setTooltipContent("");
//                       }
//                     }}
//                     onMouseLeave={() => {
//                       setTooltipContent("");
//                     }}
//                   />
//                 );
//               })
//             }
//           </Geographies>
//         </ZoomableGroup>
//       </ComposableMap>
//       <div className="absolute bottom-2 right-2 flex flex-col gap-2">
//         <Button onClick={handleZoomIn} className="rounded-full p-2 shadow-md">
//           +
//         </Button>
//         <Button onClick={handleZoomOut} className="rounded-full p-2 shadow-md">
//           -
//         </Button>
//       </div>
//       <TooltipProvider>
//         <Tooltip>{tooltipContent}</Tooltip>
//       </TooltipProvider>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const stateMapping: {
  [key: string]: { name: string; coordinates: [number, number] };
} = {
  AL: { name: "Alabama", coordinates: [32.7794, -86.8287] },
  AK: { name: "Alaska", coordinates: [64.2008, -149.4937] },
  AZ: { name: "Arizona", coordinates: [34.0489, -111.0937] },
  AR: { name: "Arkansas", coordinates: [34.7465, -92.2896] },
  CA: { name: "California", coordinates: [37.2734, -119.2735] },
  CO: { name: "Colorado", coordinates: [38.9972, -105.5478] },
  CT: { name: "Connecticut", coordinates: [41.6219, -72.7273] },
  DE: { name: "Delaware", coordinates: [38.9896, -75.505] },
  DC: { name: "District of Columbia", coordinates: [38.9072, -77.0369] },
  FL: { name: "Florida", coordinates: [28.6305, -82.4497] },
  GA: { name: "Georgia", coordinates: [32.6415, -83.4426] },
  HI: { name: "Hawaii", coordinates: [20.2927, -156.3737] },
  ID: { name: "Idaho", coordinates: [44.2394, -114.5103] },
  IL: { name: "Illinois", coordinates: [40.0417, -89.1965] },
  IN: { name: "Indiana", coordinates: [39.8942, -86.2816] },
  IA: { name: "Iowa", coordinates: [42.0751, -93.496] },
  KS: { name: "Kansas", coordinates: [38.4937, -98.3804] },
  KY: { name: "Kentucky", coordinates: [37.5347, -85.3021] },
  LA: { name: "Louisiana", coordinates: [31.0689, -91.9968] },
  ME: { name: "Maine", coordinates: [45.3695, -69.2428] },
  MD: { name: "Maryland", coordinates: [39.0458, -76.6413] },
  MA: { name: "Massachusetts", coordinates: [42.2596, -71.8083] },
  MI: { name: "Michigan", coordinates: [44.3467, -85.4102] },
  MN: { name: "Minnesota", coordinates: [46.2807, -94.3053] },
  MS: { name: "Mississippi", coordinates: [32.7364, -89.6678] },
  MO: { name: "Missouri", coordinates: [38.3566, -92.458] },
  MT: { name: "Montana", coordinates: [46.9219, -110.4544] },
  NE: { name: "Nebraska", coordinates: [41.5378, -99.7951] },
  NV: { name: "Nevada", coordinates: [38.8026, -116.4194] },
  NH: { name: "New Hampshire", coordinates: [43.6805, -71.5811] },
  NJ: { name: "New Jersey", coordinates: [40.1907, -74.6728] },
  NM: { name: "New Mexico", coordinates: [34.4071, -106.1126] },
  NY: { name: "New York", coordinates: [42.9538, -75.5268] },
  NC: { name: "North Carolina", coordinates: [35.5557, -79.3877] },
  ND: { name: "North Dakota", coordinates: [47.4501, -100.4659] },
  OH: { name: "Ohio", coordinates: [40.2862, -82.7937] },
  OK: { name: "Oklahoma", coordinates: [35.5889, -97.4943] },
  OR: { name: "Oregon", coordinates: [43.9336, -120.5583] },
  PA: { name: "Pennsylvania", coordinates: [40.8781, -77.7996] },
  RI: { name: "Rhode Island", coordinates: [41.6762, -71.5562] },
  SC: { name: "South Carolina", coordinates: [33.8569, -80.945] },
  SD: { name: "South Dakota", coordinates: [44.2853, -100.2264] },
  TN: { name: "Tennessee", coordinates: [35.858, -86.3505] },
  TX: { name: "Texas", coordinates: [31.4757, -99.3312] },
  UT: { name: "Utah", coordinates: [39.3055, -111.6703] },
  VT: { name: "Vermont", coordinates: [44.0687, -72.6658] },
  VA: { name: "Virginia", coordinates: [37.5215, -78.8537] },
  WA: { name: "Washington", coordinates: [47.3826, -120.4472] },
  WV: { name: "West Virginia", coordinates: [38.6409, -80.6227] },
  WI: { name: "Wisconsin", coordinates: [44.2563, -89.6385] },
  WY: { name: "Wyoming", coordinates: [42.9957, -107.5512] },
};

interface MapData {
  state: string;
  lat: string;
  lon: string;
  count: string;
  avg_amount: string;
}

interface TransactionMapProps {
  data: MapData[];
}

export function TransactionMap({ data = [] }: TransactionMapProps) {
  const [tooltipContent, setTooltipContent] = useState("");

  const colorScale = scaleLinear<string>()
    .domain([0, Math.max(...(data || []).map((d) => parseInt(d.count)))])
    .range(["#e6f2ff", "#0066cc"]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transaction Map</CardTitle>
        <CardDescription>
          Geographic distribution of transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateAbbr = geo.properties.postal;
                  const stateData = data?.find((d) => d.state === stateAbbr);
                  const stateInfo = stateMapping[stateAbbr];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={
                        stateData
                          ? colorScale(parseInt(stateData.count))
                          : "#EEE"
                      }
                      stroke="#FFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none", fill: "#F53" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => {
                        if (stateInfo) {
                          setTooltipContent(
                            `${stateInfo.name}: ${stateData ? stateData.count : "No"} transactions`,
                          );
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {(data || []).map((d) => (
              <Marker
                key={d.state}
                coordinates={stateMapping[d.state]?.coordinates || [0, 0]}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <circle r={5} fill="#F53" stroke="#fff" strokeWidth={2} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stateMapping[d.state]?.name || d.state}</p>
                      <p>Transactions: {d.count}</p>
                      <p>Avg Amount: ${parseFloat(d.avg_amount).toFixed(2)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Marker>
            ))}
          </ComposableMap>
        </div>
        {tooltipContent && (
          <div className="mt-2 text-sm text-muted-foreground">
            {tooltipContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
