import { useEffect, useState, useRef, memo } from "react";

const NEON = "#aeb30a";

const ScrollProgress = memo(() => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight - windowHeight;
          const progress = (currentScrollY / documentHeight) * 100;
          setProgress(Math.min(progress, 100));
          lastScrollY.current = currentScrollY;
        }
        
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none"
      style={{ background: "rgba(255,255,255,0.1)" }}
    >
      <div
        className="h-full will-change-transform"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${NEON}, ${NEON}dd)`,
          boxShadow: `0 0 10px ${NEON}80`,
          transition: "width 0.15s ease-out",
        }}
      />
    </div>
  );
});

ScrollProgress.displayName = "ScrollProgress";

export default ScrollProgress;
