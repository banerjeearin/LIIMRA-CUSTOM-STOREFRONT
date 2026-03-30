import React, { createContext, useContext, useEffect, useCallback, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For CAPI deduplication event_id

interface TrackEventParams {
  eventName: string;
  payload?: any;
  eventId?: string;
}

interface AnalyticsContextType {
  trackEvent: (params: TrackEventParams) => void;
  trackEyeball: (elementName: string, payload?: any) => void;
  trackEcommerce: (action: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase", payload?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  useEffect(() => {
    const gtmId = import.meta.env.VITE_GTM_ID;
    const pixelId = import.meta.env.VITE_META_PIXEL_ID;

    // Google Tag Manager
    if (gtmId && typeof window !== "undefined" && !document.getElementById("gtm-script")) {
      const gtmScript = document.createElement("script");
      gtmScript.id = "gtm-script";
      gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${gtmId}');`;
      document.head.appendChild(gtmScript);

      const gtmNoscript = document.createElement("noscript");
      gtmNoscript.id = "gtm-noscript";
      gtmNoscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
      document.body.insertBefore(gtmNoscript, document.body.firstChild);
    }

    // Meta Pixel
    if (pixelId && typeof window !== "undefined" && !document.getElementById("meta-pixel-script")) {
      const pixelScript = document.createElement("script");
      pixelScript.id = "meta-pixel-script";
      pixelScript.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');`;
      document.head.appendChild(pixelScript);

      const pixelNoscript = document.createElement("noscript");
      pixelNoscript.id = "meta-pixel-noscript";
      pixelNoscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
      document.body.insertBefore(pixelNoscript, document.body.firstChild);
    }
  }, []);

  // Core tracking function mapping to DataLayer (GTM) and Meta Pixel
  const trackEvent = useCallback(({ eventName, payload, eventId }: TrackEventParams) => {
    // 1. DataLayer (Google Tag Manager)
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: eventName,
        ...payload,
        event_id: eventId,
      });
    }

    // 2. Meta Pixel (fbq)
    if (typeof window !== "undefined" && (window as any).fbq) {
      // Standard events directly map if they match FB standard event names
      const standardEvents = ["ViewContent", "AddToCart", "InitiateCheckout", "Purchase", "PageView"];
      
      if (standardEvents.includes(eventName)) {
        (window as any).fbq("track", eventName, payload, { eventID: eventId });
      } else {
        (window as any).fbq("trackCustom", eventName, payload, { eventID: eventId });
      }
    }

    // Console logging for dev verification
    if (import.meta.env.DEV) {
      console.log(`[Analytics Track] ${eventName}`, payload, `(event_id: ${eventId})`);
    }
  }, []);

  // Track page views on route change
  useEffect(() => {
    const pageViewEventId = uuidv4();
    trackEvent({
      eventName: "PageView",
      payload: { path: location.pathname, search: location.search },
      eventId: pageViewEventId,
    });
  }, [location, trackEvent]);

  // Convenience method for eyeball (impression) tracking
  const trackEyeball = useCallback((elementName: string, payload?: any) => {
    trackEvent({
      eventName: "Eyeball_Impression",
      payload: { element_name: elementName, ...payload },
      eventId: uuidv4(),
    });
  }, [trackEvent]);

  // Convenience method for standard e-commerce tracking
  const trackEcommerce = useCallback((action: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase", payload?: any) => {
    trackEvent({
      eventName: action,
      payload: payload,
      eventId: uuidv4(), // Critical for deduplication with server-side CAPI
    });
  }, [trackEvent]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackEyeball, trackEcommerce }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }
  return context;
};
