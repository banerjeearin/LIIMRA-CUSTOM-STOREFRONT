import { useEffect, useRef } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useLocation } from "react-router-dom";

export const useScrollTracker = () => {
  const { trackScroll } = useAnalytics();
  const trackedDepths = useRef(new Set<number>());
  const location = useLocation();

  // Reset tracking when path changes
  useEffect(() => {
    trackedDepths.current.clear();
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const scrollableDistance = documentHeight - windowHeight;
      if (scrollableDistance <= 0) return; // Not scrollable
      
      const scrollPercentage = Math.round((scrollTop / scrollableDistance) * 100);

      const milestones = [25, 50, 75, 100] as const;
      
      milestones.forEach((depth) => {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackScroll(depth);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Trigger immediately in case user loads halfway down the page
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [trackScroll, location.pathname]);
};
