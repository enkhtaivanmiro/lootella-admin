import React from "react";

export default function LootellaLogo({ className = "w-40" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="28"
        className="font-sans"
        fontSize="28"
        fontWeight="bold"
        fill="white"
        letterSpacing="0.05em"
      >
        LOOTELLA
      </text>
    </svg>
  );
}
