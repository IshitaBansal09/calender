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
    <div className="relative w-full h-full overflow-hidden">
      {/* Background placeholder */}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ backgroundColor: theme.bg }}
      />

      {/* Month image */}
      <img
        src={imgSrc}
        alt={`${MONTH_NAMES[month]} ${year}`}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/65" />

      {/* Season badge */}
      <div
        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm shadow-sm"
        style={{ backgroundColor: `${theme.primary}cc` }}
      >
        {theme.season}
      </div>

      {/* Month & year overlay */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-12 text-white"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)"
        }}
      >
        <div
          className="font-playfair text-5xl md:text-6xl font-bold tracking-tight drop-shadow-lg leading-none"
        >
          {MONTH_NAMES[month]}
        </div>
        <div className="text-sm mt-1.5 opacity-75 drop-shadow font-light tracking-widest uppercase">
          {year}
        </div>
      </div>

      {/* Decorative corner dots */}
      <div className="absolute top-4 right-4 grid grid-cols-3 gap-1 opacity-25">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white" />
        ))}
      </div>
    </div>
  );
}
