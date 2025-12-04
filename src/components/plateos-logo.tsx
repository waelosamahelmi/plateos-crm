export function PlateOSLogo({ className = "w-32 h-32" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="plate-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cheese-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <radialGradient id="tomato-gradient">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </radialGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Background circle */}
      <circle cx="100" cy="100" r="85" fill="url(#plate-gradient)" opacity="0.15" />
      
      {/* Main plate circle */}
      <circle cx="100" cy="100" r="70" fill="url(#plate-gradient)" />
      
      {/* Shine effect */}
      <ellipse cx="85" cy="75" rx="35" ry="25" fill="url(#shine)" opacity="0.3" transform="rotate(-30 85 75)" />
      
      {/* Inner ring */}
      <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="2" opacity="0.2" />
      
      {/* Center badge - Red dot instead of P */}
      <circle cx="100" cy="100" r="35" fill="white" />
      <circle cx="100" cy="100" r="20" fill="#DC2626" />
      <circle cx="100" cy="100" r="20" fill="url(#plate-gradient)" opacity="0.8" />
      
      {/* Shine on red dot */}
      <ellipse cx="95" cy="92" rx="8" ry="6" fill="white" opacity="0.4" transform="rotate(-30 95 92)" />
      
      {/* OS letters - minimalist */}
      <path
        d="M 100 100 L 180 60 A 85 85 0 0 1 180 140 Z"
        fill="url(#plate-gradient)"
        stroke="white"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      
      {/* Cheese layer */}
      <path
        d="M 100 100 L 175 65 A 80 80 0 0 1 175 135 Z"
        fill="url(#cheese-gradient)"
        opacity="0.4"
      />
      
      {/* Pepperoni spots */}
      <circle cx="140" cy="100" r="8" fill="url(#tomato-gradient)" />
      <circle cx="155" cy="85" r="7" fill="url(#tomato-gradient)" />
      <circle cx="160" cy="115" r="6" fill="url(#tomato-gradient)" />
      <circle cx="125" cy="90" r="6" fill="url(#tomato-gradient)" />
      
      {/* Cheese drip effect */}
      <ellipse cx="170" cy="135" rx="8" ry="4" fill="#FBBF24" opacity="0.6" />
      <rect x="168" y="135" width="4" height="8" rx="2" fill="#FBBF24" opacity="0.6" />
      
      {/* OS text badge */}
      <circle cx="100" cy="100" r="35" fill="white" opacity="0.95" />
      <circle cx="100" cy="100" r="35" fill="url(#plate-gradient)" opacity="0.1" />
      <text
        x="100"
        y="113"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="900"
        fill="url(#plate-gradient)"
        textAnchor="middle"
        letterSpacing="-2"
      >
        OS
      </text>
      
      {/* Steam lines */}
      <path
        d="M 145 50 Q 148 45 145 40"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      <path
        d="M 155 55 Q 158 50 155 45"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
        fill="none"
      />
      <path
        d="M 165 52 Q 168 47 165 42"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
        fill="none"
      />
    </svg>
  );
}

export function PlateOSWordmark({ className = "h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>

      {/* PlateOS text */}
      <text
        x="10"
        y="70"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="60"
        fontWeight="900"
        fill="url(#text-gradient)"
        letterSpacing="-3"
      >
        Plate
        <tspan fill="currentColor" className="text-slate-600">OS</tspan>
      </text>
    </svg>
  );
}
