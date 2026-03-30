import { useEffect, useRef, useState } from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";

export const useImpressionTracker = (
  elementName: string,
  payload?: any,
  threshold: number = 0.5 // 50% visibility
) => {
  const ref = useRef<HTMLElement | null>(null);
  const [hasTracked, setHasTracked] = useState(false);
  const { trackEyeball } = useAnalytics();

  useEffect(() => {
    // Check if the current environment is running on the client server
    const currentRef = ref.current;
    
    // Safety check - we only want to track once
    if (!currentRef || hasTracked || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          trackEyeball(elementName, payload);
          setHasTracked(true);
          observer.disconnect(); // Stop observing after tracking once
        }
      },
      {
        threshold, // 0 to 1 scale indicating percentage of element visible
        rootMargin: "0px",
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [elementName, payload, threshold, hasTracked, trackEyeball]);

  return ref;
};
