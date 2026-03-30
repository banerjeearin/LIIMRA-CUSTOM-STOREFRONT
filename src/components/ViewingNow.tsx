import React, { useState, useEffect, useMemo } from 'react';

interface ViewingNowProps {
  className?: string;
  dotColor?: string;
  textColor?: string;
  showText?: boolean;
}

const ViewingNow: React.FC<ViewingNowProps> = ({ 
  className = "", 
  dotColor = "#aeb30a", // Default neon/yellow
  textColor = "hsl(var(--liimra-ink-light))",
  showText = true 
}) => {
  // Generate a plausible initial count that is stable for the session
  const initialCount = useMemo(() => Math.floor(Math.random() * (48 - 24 + 1)) + 24, []);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + change;
        
        // Keep within a realistic range
        if (next < 18) return 18 + Math.floor(Math.random() * 5);
        if (next > 62) return 62 - Math.floor(Math.random() * 5);
        return next;
      });
    }, 10000 + Math.random() * 5000); // 10-15 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span 
        className="w-2 h-2 rounded-full animate-pulse shrink-0" 
        style={{ backgroundColor: dotColor, boxShadow: `0 0 8px ${dotColor}44` }} 
      />
      {showText && (
        <span 
          className="font-body text-[10px] tracking-[0.15em] uppercase"
          style={{ color: textColor }}
        >
          {count} people viewing now
        </span>
      )}
    </div>
  );
};

export default ViewingNow;
