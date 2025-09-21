import React, { useState, useEffect } from "react";

export default function Kidney3D({ scans, animate3D, setAnimate3D }) {
  const [rotate3D, setRotate3D] = useState(0);

  useEffect(() => {
    if (animate3D) {
      const interval = setInterval(() => {
        setRotate3D((prev) => (prev + 2) % 360);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [animate3D]);

  return (
    <div className="relative">
      <div
        className="kidney-3d w-24 h-16 rotate-3d cursor-pointer relative overflow-hidden"
        style={{ "--rotate-y": `${rotate3D}deg` }}
        onClick={() => setAnimate3D(!animate3D)}
      >
        {animate3D && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent scan-wave"></div>
        )}

        {scans.slice(0, 3).map(
          (scan, i) =>
            scan.stone_count > 0 && (
              <div
                key={i}
                className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${30 + i * 10}%`,
                  zIndex: 10,
                }}
              ></div>
            ),
        )}
      </div>
      <button
        onClick={() => setAnimate3D(!animate3D)}
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-teal-400 hover:text-teal-300"
      >
        {animate3D ? "Stop" : "Animate"}
      </button>
    </div>
  );
}
