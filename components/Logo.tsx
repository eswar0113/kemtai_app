export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
      
      {/* Body stick figure in motion */}
      {/* Head */}
      <circle cx="50" cy="20" r="6" fill="white" />
      
      {/* Body */}
      <line x1="50" y1="26" x2="50" y2="45" stroke="white" strokeWidth="2" strokeLinecap="round" />
      
      {/* Arms raised (fitness pose) */}
      <line x1="50" y1="32" x2="30" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="32" x2="70" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Legs in dynamic stance */}
      <line x1="50" y1="45" x2="38" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="50" y1="45" x2="62" y2="70" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Accent dots for motion */}
      <circle cx="28" cy="16" r="3" fill="white" opacity="0.6" />
      <circle cx="72" cy="16" r="3" fill="white" opacity="0.6" />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#2563eb", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#1e40af", stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  );
}
