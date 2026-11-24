import React from 'react';

interface IslamicPatternProps {
  className?: string;
  opacity?: number;
  variant?: 'green' | 'red' | 'dual';
}

export const IslamicPattern: React.FC<IslamicPatternProps> = ({
  className = '',
  opacity = 0.06,
  variant = 'dual'
}) => {
  const primaryStroke = variant === 'green' ? '#087A43' : variant === 'red' ? '#C62828' : '#087A43';
  const secondaryStroke = variant === 'dual' ? '#C62828' : primaryStroke;

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`islamic-geom-${variant}`}
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            {/* 8-point Islamic Star polygon */}
            <path
              d="M40 0 L51.7 28.3 L80 40 L51.7 51.7 L40 80 L28.3 51.7 L0 40 L28.3 28.3 Z"
              fill="none"
              stroke={primaryStroke}
              strokeWidth="1.2"
            />
            {/* Inner intersecting square 1 */}
            <rect
              x="25.8"
              y="25.8"
              width="28.4"
              height="28.4"
              fill="none"
              stroke={secondaryStroke}
              strokeWidth="1"
            />
            {/* Inner intersecting square 2 rotated 45 deg */}
            <rect
              x="25.8"
              y="25.8"
              width="28.4"
              height="28.4"
              transform="rotate(45 40 40)"
              fill="none"
              stroke={primaryStroke}
              strokeWidth="1"
            />
            {/* Center star rosette */}
            <circle cx="40" cy="40" r="4" fill="none" stroke={secondaryStroke} strokeWidth="1" />
            {/* Corner connecting lattice */}
            <path
              d="M0 0 L15 15 M80 0 L65 15 M0 80 L15 65 M80 80 L65 65"
              stroke={primaryStroke}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#islamic-geom-${variant})`} />
      </svg>
    </div>
  );
};

export const IslamicArchDivider: React.FC<{ flip?: boolean; className?: string }> = ({
  flip = false,
  className = ''
}) => {
  return (
    <div className={`w-full overflow-hidden leading-none ${className} ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-8 text-brand-surface fill-current"
      >
        <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,60 L1200,120 L0,120 Z"></path>
      </svg>
    </div>
  );
};
