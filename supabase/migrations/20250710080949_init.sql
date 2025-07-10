-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table - using Stripe product IDs as primary key
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY, -- This will be the Stripe product ID
    custom_id TEXT UNIQUE, -- Our custom identifier
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Product items table - using Stripe price IDs as primary key
CREATE TABLE IF NOT EXISTS product_items (
    id TEXT PRIMARY KEY, -- This will be the Stripe price ID
    custom_id TEXT UNIQUE, -- Our custom identifier
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price INTEGER NOT NULL, -- Price in cents
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    popular BOOLEAN DEFAULT FALSE,
    currency TEXT DEFAULT 'usd',
    recurring_interval TEXT, -- monthly, yearly, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- User purchases table
CREATE TABLE IF NOT EXISTS user_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_item_id TEXT NOT NULL REFERENCES product_items(id) ON DELETE CASCADE,
    stripe_product_id TEXT NOT NULL,
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    stripe_customer_id TEXT,
    amount_paid INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    payment_status TEXT DEFAULT 'pending',
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, product_item_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_custom_id ON products(custom_id);
CREATE INDEX IF NOT EXISTS idx_product_items_custom_id ON product_items(custom_id);
CREATE INDEX IF NOT EXISTS idx_product_items_product_id ON product_items(product_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_product_item_id ON user_purchases(product_item_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_stripe_session_id ON user_purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_stripe_customer_id ON user_purchases(stripe_customer_id);

-- Row Level Security (RLS) policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;

-- Products and product items are readable by everyone
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Product items are viewable by everyone" ON product_items FOR SELECT USING (true);

-- Users can only view their own purchases
CREATE POLICY "Users can view own purchases" ON user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own purchases" ON user_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_products 
    BEFORE UPDATE ON products 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_product_items 
    BEFORE UPDATE ON product_items 
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
