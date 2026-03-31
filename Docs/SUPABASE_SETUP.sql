-- Supabase Setup Script for Liimra Analytics MCP

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Customers Table (Long-term storage with RFM Modeling)
CREATE TABLE customers (
    id VARCHAR(255) PRIMARY KEY, -- Matches your Shopify/Backend Customer ID
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    total_spent DECIMAL(10, 2) DEFAULT 0.00,
    orders_count INTEGER DEFAULT 0,
    last_order_date TIMESTAMPTZ,
    recency_score INTEGER,
    frequency_score INTEGER,
    monetary_score INTEGER,
    rfm_segment VARCHAR(50), 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Orders Table (Long-term storage)
CREATE TABLE orders (
    id VARCHAR(255) PRIMARY KEY, -- Matches your Shopify/Backend Order ID
    customer_id VARCHAR(255) REFERENCES customers(id),
    sales_channel VARCHAR(50) NOT NULL DEFAULT 'D2C', 
    total_price DECIMAL(10, 2) NOT NULL,
    subtotal_price DECIMAL(10, 2),
    total_tax DECIMAL(10, 2),
    total_discounts DECIMAL(10, 2),
    financial_status VARCHAR(50), 
    fulfillment_status VARCHAR(50), 
    currency VARCHAR(10) DEFAULT 'INR',
    line_items JSONB NOT NULL,
    discount_codes JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Analytics Events Table (30-Day Rolling Storage)
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    anonymous_id VARCHAR(255) NOT NULL,
    customer_id VARCHAR(255) REFERENCES customers(id),
    order_id VARCHAR(255) REFERENCES orders(id),
    session_id VARCHAR(255),
    
    event_category VARCHAR(50) NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    
    page_url TEXT,
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(255),
    utm_term VARCHAR(255),
    utm_content VARCHAR(255),
    
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    user_agent TEXT,
    ip_address INET
);

-- Indexes for lightning-fast MCP querying
CREATE INDEX idx_events_timestamp ON analytics_events (timestamp DESC);
CREATE INDEX idx_events_name ON analytics_events (event_name);
CREATE INDEX idx_events_customer ON analytics_events (customer_id);
CREATE INDEX idx_events_order ON analytics_events (order_id);
CREATE INDEX idx_events_anonymous ON analytics_events (anonymous_id);
CREATE INDEX idx_events_payload ON analytics_events USING GIN (payload);
CREATE INDEX idx_orders_customer ON orders (customer_id);
CREATE INDEX idx_orders_channel ON orders (sales_channel);
CREATE INDEX idx_customers_rfm ON customers (rfm_segment);

-- SECURITY: Row Level Security (RLS)
-- We strictly only allow public 'INSERT' for events passing from frontend.
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to analytics" 
ON analytics_events FOR INSERT 
TO public 
WITH CHECK (true);
