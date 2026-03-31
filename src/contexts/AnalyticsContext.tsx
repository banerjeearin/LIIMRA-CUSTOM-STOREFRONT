import React, { createContext, useContext, useEffect, useCallback, ReactNode, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For CAPI deduplication event_id
import { supabase } from "@/lib/supabase";

interface TrackEventParams {
  eventName: string;
  payload?: any;
  eventId?: string;
  category?: string;
}

interface AnalyticsContextType {
  anonymousId: string;
  trackEvent: (params: TrackEventParams) => void;
  trackEyeball: (elementName: string, payload?: any) => void;
  trackEcommerce: (action: "ViewContent" | "AddToCart" | "RemoveFromCart" | "InitiateCheckout" | "Purchase", payload?: any) => void;
  trackScroll: (depth: 25 | 50 | 75 | 100) => void;
  trackEngagement: (action: "Search" | "ShareProduct", payload?: any) => void;
  trackIdentity: (action: "CustomerLogin" | "CustomerRegister", customerId: string, traits?: any) => void;
  trackNavigation: (action: "CollectionView", payload?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

const ANONYMOUS_ID_KEY = "liimra_anonymous_id";

const getOrCreateAnonymousId = (): string => {
  if (typeof window === "undefined") return uuidv4();
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
};

const parseUtmParams = (searchString: string) => {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(searchString);
  return {
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_term: params.get("utm_term") || undefined,
    utm_content: params.get("utm_content") || undefined,
  };
};

const eventMappings: Record<string, { meta: string, ga4: string, category: string }> = {
  "PageView": { meta: "PageView", ga4: "page_view", category: "NAVIGATION" },
  "CollectionView": { meta: "ViewCategory", ga4: "view_item_list", category: "NAVIGATION" },
  "ViewContent": { meta: "ViewContent", ga4: "view_item", category: "ENGAGEMENT" },
  "AddToCart": { meta: "AddToCart", ga4: "add_to_cart", category: "CART" },
  "RemoveFromCart": { meta: "RemoveFromCart", ga4: "remove_from_cart", category: "CART" },
  "InitiateCheckout": { meta: "InitiateCheckout", ga4: "begin_checkout", category: "CONVERSION" },
  "Purchase": { meta: "Purchase", ga4: "purchase", category: "CONVERSION" },
  "Search": { meta: "Search", ga4: "search", category: "ENGAGEMENT" },
  "ShareProduct": { meta: "ShareProduct", ga4: "share", category: "ENGAGEMENT" },
  "CustomerLogin": { meta: "CustomerLogin", ga4: "login", category: "IDENTITY" },
  "CustomerRegister": { meta: "CompleteRegistration", ga4: "sign_up", category: "IDENTITY" },
};

export const AnalyticsProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [anonymousId] = useState<string>(() => getOrCreateAnonymousId());

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
  const trackEvent = useCallback(({ eventName, payload, eventId, category }: TrackEventParams) => {
    const mapping = eventMappings[eventName] || { meta: eventName, ga4: eventName, category: category || "CUSTOM" };
    const enrichedPayload = {
      ...payload,
      anonymous_id: anonymousId,
      event_category: mapping.category,
    };

    // 1. DataLayer (Google Tag Manager)
    if (typeof window !== "undefined" && (window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: mapping.ga4, // Use GA4 standard name for tag manager event trigger
        gtm_event_name: eventName, // The unified name
        ...enrichedPayload,
        event_id: eventId,
      });
    }

    // 2. Meta Pixel (fbq)
    if (typeof window !== "undefined" && (window as any).fbq) {
      // Standard events directly map if they match FB standard event names
      const standardEvents = ["PageView", "ViewContent", "AddToCart", "InitiateCheckout", "Purchase", "Search", "CompleteRegistration", "Contact"];
      
      if (standardEvents.includes(mapping.meta)) {
        (window as any).fbq("track", mapping.meta, enrichedPayload, { eventID: eventId });
      } else {
        (window as any).fbq("trackCustom", mapping.meta, enrichedPayload, { eventID: eventId });
      }
    }

    // 3. Supabase Database Push (Native API Route equivalent)
    if (supabase) {
      // Intentionally not awaiting so it doesn't block the UI thread
      supabase.from('analytics_events').insert([{
        anonymous_id: anonymousId,
        event_category: mapping.category,
        event_name: eventName,
        page_url: window.location.href,
        referrer_url: document.referrer,
        utm_source: payload?.utm_source || null,
        utm_medium: payload?.utm_medium || null,
        utm_campaign: payload?.utm_campaign || null,
        utm_term: payload?.utm_term || null,
        utm_content: payload?.utm_content || null,
        payload: enrichedPayload
      }]).catch((err) => {
        if (import.meta.env.DEV) console.error("Supabase Tracking Error:", err);
      });
    }

    // Console logging for dev verification
    if (import.meta.env.DEV) {
      console.log(`[Analytics Track] [${mapping.category}] ${eventName} (GA4: ${mapping.ga4}, Meta: ${mapping.meta})`, enrichedPayload);
    }
  }, [anonymousId]);

  // Track page views on route change
  useEffect(() => {
    const pageViewEventId = uuidv4();
    const utms = parseUtmParams(location.search);
    trackEvent({
      eventName: "PageView",
      payload: { 
        page_url: window.location.href,
        path: location.pathname, 
        search: location.search,
        referrer_url: document.referrer,
        ...utms
      },
      eventId: pageViewEventId,
    });
  }, [location, trackEvent]);

  // Convenience method for eyeball (impression) tracking
  const trackEyeball = useCallback((elementName: string, payload?: any) => {
    trackEvent({
      eventName: "Eyeball_Impression",
      category: "ENGAGEMENT",
      payload: { element_name: elementName, ...payload },
      eventId: uuidv4(),
    });
  }, [trackEvent]);

  // Convenience method for standard e-commerce tracking
  const trackEcommerce = useCallback((action: "ViewContent" | "AddToCart" | "RemoveFromCart" | "InitiateCheckout" | "Purchase", payload?: any) => {
    trackEvent({
      eventName: action,
      payload: payload,
      eventId: uuidv4(), // Critical for deduplication with server-side CAPI
    });
  }, [trackEvent]);

  // Track Scroll
  const trackScroll = useCallback((depth: 25 | 50 | 75 | 100) => {
    trackEvent({
      eventName: `ScrollDepth${depth}`,
      category: "ENGAGEMENT",
      payload: { scroll_depth: depth },
      eventId: uuidv4(),
    });
  }, [trackEvent]);

  // Track Generic Engagement
  const trackEngagement = useCallback((action: "Search" | "ShareProduct", payload?: any) => {
    trackEvent({
      eventName: action,
      payload: payload,
      eventId: uuidv4(),
    });
  }, [trackEvent]);

  // Track Identity
  const trackIdentity = useCallback((action: "CustomerLogin" | "CustomerRegister", customerId: string, traits?: any) => {
    trackEvent({
      eventName: action,
      payload: { customer_id: customerId, ...traits },
      eventId: uuidv4(),
    });
  }, [trackEvent]);

  // Track Navigation
  const trackNavigation = useCallback((action: "CollectionView", payload?: any) => {
    trackEvent({
      eventName: action,
      payload: payload,
      eventId: uuidv4(),
    });
  }, [trackEvent]);

  return (
    <AnalyticsContext.Provider value={{ 
      anonymousId, trackEvent, trackEyeball, trackEcommerce, 
      trackScroll, trackEngagement, trackIdentity, trackNavigation 
    }}>
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
