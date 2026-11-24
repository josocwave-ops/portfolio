"use client";

import { useEffect } from "react";
import { sawArea } from "./notices";

// Notes that a visitor has opened one of the four areas, for the "explorer"
// achievement (all four folders opened). Draws nothing.
export default function TrackArea({ area, all }: { area: string; all: string[] }) {
  useEffect(() => sawArea(area, all), [area, all]);
  return null;
}
