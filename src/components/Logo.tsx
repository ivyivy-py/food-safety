import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="NutriSafe ToxiScan Logo"
    >
      {/* Background Rounded Shield / Pin Base */}
      <rect width="100" height="100" rx="28" fill="#092227" />
      
      {/* Outer Marker Pin Contour */}
      <path
        d="M50 18C33 18 20 31.5 20 48.5C20 62 38 78 47.5 85.5C49 86.7 51 86.7 52.5 85.5C62 78 80 62 80 48.5C80 31.5 67 18 50 18Z"
        stroke="#10B981"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Top Eyebrow / Sensor Arc */}
      <path
        d="M29 32C35 27.5 42 25.5 50 25.5C58 25.5 65 27.5 71 32"
        stroke="#34D399"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Dashed Circular Reticle / Radar Array */}
      <circle
        cx="50"
        cy="45"
        r="15"
        stroke="#10B981"
        strokeWidth="3.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Central Verified Bio-Marker Checkmark */}
      <path
        d="M40.5 45.5L46.5 51.5L59.5 38.5"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Orange Indicator Dot */}
      <circle cx="30" cy="62" r="4.2" fill="#F59E0B" />

      {/* Right Cyan Indicator Dot */}
      <circle cx="70" cy="62" r="4.2" fill="#38BDF8" />
    </svg>
  );
};
