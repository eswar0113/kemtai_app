export function HeroBanner() {
  return (
    <svg
      viewBox="0 0 1200 600"
      className="w-full h-auto max-h-96"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main gradient background */}
      <defs>
        <linearGradient id="heroBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1e40af", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#2563eb", stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 1 }} />
        </linearGradient>
        
        <radialGradient id="glow1" cx="20%" cy="30%" r="50%">
          <stop offset="0%" style={{ stopColor: "#60a5fa", stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: 0 }} />
        </radialGradient>
        
        <radialGradient id="glow2" cx="80%" cy="70%" r="50%">
          <stop offset="0%" style={{ stopColor: "#0ea5e9", stopOpacity: 0.2 }} />
          <stop offset="100%" style={{ stopColor: "#0f172a", stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width="1200" height="600" fill="url(#heroBg)" />

      {/* Glow effects */}
      <circle cx="200" cy="200" r="300" fill="url(#glow1)" />
      <circle cx="1000" cy="450" r="350" fill="url(#glow2)" />

      {/* Grid pattern background */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
        </pattern>
      </defs>
      <rect width="1200" height="600" fill="url(#grid)" />

      {/* Left side - Person in fitness pose */}
      <g opacity="0.9">
        {/* Head */}
        <circle cx="200" cy="120" r="25" fill="white" />
        
        {/* Body */}
        <line x1="200" y1="145" x2="200" y2="280" stroke="white" strokeWidth="8" strokeLinecap="round" />
        
        {/* Left arm raised */}
        <line x1="200" y1="170" x2="80" y2="100" stroke="white" strokeWidth="7" strokeLinecap="round" />
        
        {/* Right arm raised */}
        <line x1="200" y1="170" x2="320" y2="100" stroke="white" strokeWidth="7" strokeLinecap="round" />
        
        {/* Left leg */}
        <line x1="200" y1="280" x2="140" y2="420" stroke="white" strokeWidth="7" strokeLinecap="round" />
        
        {/* Right leg */}
        <line x1="200" y1="280" x2="260" y2="420" stroke="white" strokeWidth="7" strokeLinecap="round" />
        
        {/* Hand circles */}
        <circle cx="80" cy="100" r="12" fill="white" />
        <circle cx="320" cy="100" r="12" fill="white" />
        
        {/* Foot circles */}
        <circle cx="140" cy="420" r="12" fill="white" />
        <circle cx="260" cy="420" r="12" fill="white" />
      </g>

      {/* Right side - Decorative pulse circles */}
      <g opacity="0.6">
        {/* Pulse rings */}
        <circle cx="950" cy="200" r="60" fill="none" stroke="white" strokeWidth="2" opacity="0.8" />
        <circle cx="950" cy="200" r="90" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4" />
        <circle cx="950" cy="200" r="120" fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
        
        {/* Center dot */}
        <circle cx="950" cy="200" r="8" fill="white" />
      </g>

      {/* Bottom accent line */}
      <line x1="0" y1="550" x2="1200" y2="550" stroke="white" strokeWidth="3" opacity="0.3" />
      
      {/* Accent shapes */}
      <g opacity="0.15">
        <rect x="100" y="450" width="200" height="100" fill="white" />
        <rect x="950" y="400" width="150" height="150" fill="white" />
      </g>
    </svg>
  );
}
