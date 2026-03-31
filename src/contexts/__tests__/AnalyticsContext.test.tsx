import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { AnalyticsProvider, useAnalytics } from '../AnalyticsContext';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

// 1. Mock the Supabase wrapper layer
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ error: null })
  }
}));

// 2. Clear global objects tracking window elements
beforeEach(() => {
  (window as any).dataLayer = [];
  (window as any).fbq = vi.fn();
  vi.clearAllMocks();
});

// 3. Harness Component for Testing Context Triggers
const TrackingSimulatorComponent = ({ execute }: { execute?: (analytics: any) => void }) => {
  const analytics = useAnalytics();
  if (execute) {
    execute(analytics);
  }
  return null;
};

const renderAnalyticsFunnel = (initialEntries = ['/'], execute?: any) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AnalyticsProvider>
        <TrackingSimulatorComponent execute={execute} />
      </AnalyticsProvider>
    </MemoryRouter>
  );
};

describe('Data Pipeline: Analytics Context Engine', () => {
    
  // --- CATEGORY 1: Campaign Entry ---
  describe('Category 1: UTM Parameters and Traffic Entry', () => {
    it('Variant 1.1: Direct Route Entry simulates clean anonymous load', () => {
        renderAnalyticsFunnel(['/']);
        
        // Ensure PageView fired GA4 correctly without UTMs
        const pushGA4 = (window as any).dataLayer.find((event: any) => event.event === 'page_view');
        expect(pushGA4).toBeDefined();
        expect(pushGA4.utm_source).toBeUndefined();
        
        // Ensure Meta Ads standard PageView triggered
        expect((window as any).fbq).toHaveBeenCalledWith('track', 'PageView', expect.any(Object), expect.any(Object));

        // Verifying Supabase API Hook fired the session tracker
        expect(supabase.from).toHaveBeenCalledWith('analytics_events');
    });

    it('Variant 1.2 & 1.3: Complex Meta Ads / Google Ads Click through URI', () => {
        renderAnalyticsFunnel(['/?utm_source=meta&utm_medium=retargeting&utm_campaign=spring_sale']);

        // Verify that the contextual params were correctly lifted into the global object mapping
        const pushGA4 = (window as any).dataLayer.find((event: any) => event.event === 'page_view');
        expect(pushGA4.utm_source).toBe('meta');
        expect(pushGA4.utm_campaign).toBe('spring_sale');
    });
  });

  // --- CATEGORY 2: Engagement ---
  describe('Category 2: User Engagements & Milestones', () => {
    it('Variant 2.1: Open Product Listing (ViewContent tracking mapping)', () => {
        let internalContext: any;
        renderAnalyticsFunnel(['/products'], (analytics) => { internalContext = analytics; });
        
        act(() => {
            internalContext.trackEcommerce('ViewContent', { content_ids: ['ragi-att-1kg'], value: 150, currency: 'INR' });
        });

        // Ensure Meta uses Standard 'ViewContent'
        expect((window as any).fbq).toHaveBeenCalledWith(
            'track', 'ViewContent', 
            expect.objectContaining({ content_ids: ['ragi-att-1kg'], value: 150 }), 
            expect.any(Object)
        );
        // Ensure GA4 intelligently mapped it to 'view_item' automatically 
        const ga4Match = (window as any).dataLayer.find((event: any) => event.event === 'view_item');
        expect(ga4Match).toMatchObject({ value: 150 });
    });

    it('Variant 2.2 & 2.3: Scroll Depth Hook triggering events safely', () => {
        let internalContext: any;
        renderAnalyticsFunnel(['/about'], (analytics) => { internalContext = analytics; });

        act(() => {
            internalContext.trackScroll(25);
            internalContext.trackScroll(50);
        });

        // Verifying mapping forces Meta to switch to 'trackCustom' for unconventional names
        expect((window as any).fbq).toHaveBeenCalledWith('trackCustom', 'ScrollDepth25', expect.any(Object), expect.any(Object));
        expect((window as any).fbq).toHaveBeenCalledWith('trackCustom', 'ScrollDepth50', expect.any(Object), expect.any(Object));
    });
  });

  // --- CATEGORY 3: E-commerce operations ---
  describe('Category 3: The Order Funnel (Cart, Initiate Checkout)', () => {
    it('Variant 3.1: Standard AddToCart functionality works across all 3 databases', () => {
        let internalContext: any;
        renderAnalyticsFunnel(['/'], (analytics) => { internalContext = analytics; });

        act(() => {
            internalContext.trackEcommerce('AddToCart', { content_ids: ['multi-millet-500g'], value: 89, currency: 'INR' });
        });

        const ga4Add = (window as any).dataLayer.find((event: any) => event.event === 'add_to_cart');
        expect(ga4Add).toBeDefined();
        expect(ga4Add.value).toBe(89);

        // Supabase DB Verification of payload packaging
        const dbPushPayload = (supabase.from('analytics_events').insert as any).mock.calls.pop()[0][0];
        expect(dbPushPayload.event_name).toBe('AddToCart');
        expect(dbPushPayload.payload.value).toBe(89);
    });

    it('Variant 3.3: Delete intent caught successfully from global flow', () => {
        let internalContext: any;
        renderAnalyticsFunnel(['/cart'], (analytics) => { internalContext = analytics; });

        act(() => {
            internalContext.trackEcommerce('RemoveFromCart', { content_ids: ['millet-flakes-200g'], value: 120, currency: 'INR' });
        });

        const removalEvent = (window as any).dataLayer.find((event: any) => event.event === 'remove_from_cart');
        expect(removalEvent).toBeDefined();
        expect(removalEvent.value).toBe(120);
    });
  });

  // --- CATEGORY 4: Registration ---
  describe('Category 4: Identify & Registration bridges', () => {
    it('Variants 4.2: Customer Login links Session to global identifier', () => {
        let internalContext: any;
        renderAnalyticsFunnel(['/login'], (analytics) => { internalContext = analytics; });

        act(() => {
            internalContext.trackIdentity('CustomerLogin', 'live-user-shop-12ab');
        });

        // Verifying bridging happens at the Supabase Layer seamlessly
        const dbPushPayload = (supabase.from('analytics_events').insert as any).mock.calls.pop()[0][0];
        expect(dbPushPayload.event_name).toBe('CustomerLogin');
        expect(dbPushPayload.payload.customer_id).toBe('live-user-shop-12ab');
    });
  });

});
