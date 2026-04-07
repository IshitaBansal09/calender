"use client";

import { useState, useEffect } from "react";
import { MONTH_NAMES, MONTH_THEMES, getMonthImageUrl } from "../utils/calendar";

interface HeroImageProps {
  month: number;
  year: number;
}

export default function HeroImage({ month, year }: HeroImageProps) {
  const theme = MONTH_THEMES[month];
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(getMonthImageUrl(month));

  useEffect(() => {
    setLoaded(false);
    setImgSrc(getMonthImageUrl(month));
  }, [month]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
      {/* Background color while loading */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: theme.bg }}
      />

      {/* Month image */}
      <img
        src={imgSrc}
        alt={`${MONTH_NAMES[month]} ${year}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60" />

      {/* Season badge */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm"
        style={{ backgroundColor: `${theme.primary}cc` }}
      >
        {theme.season}
      </div>

      {/* Month label overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <div className="text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
          {MONTH_NAMES[month]}
        </div>
        <div className="text-lg opacity-80 drop-shadow font-light">{year}</div>
      </div>

      {/* Decorative corner dots */}
      <div className="absolute top-3 right-3 grid grid-cols-3 gap-1 opacity-30">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white" />
        ))}
      </div>
    </div>
  );
}
