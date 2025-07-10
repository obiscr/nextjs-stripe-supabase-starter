import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { Database } from '@/lib/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables for webhook');
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const handleStripeProductSync = {
  async syncProduct(product: Stripe.Product) {
    console.log('Syncing product to Supabase:', product.id);
    
    const productData = {
      id: product.id,
      custom_id: product.metadata?.custom_id || null,
      name: product.name,
      description: product.description || null,
      icon: product.images?.[0] || null,
    };

    const { data, error } = await supabase
      .from('products')
      .upsert(productData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error syncing product:', error);
      throw error;
    }

    console.log('Product synced successfully:', data);
    return data;
  },

  async syncPrice(price: Stripe.Price) {
    console.log('Syncing price to Supabase:', price.id);
    
    if (typeof price.product === 'string') {
      const stripe = getStripe();
      const product = await stripe.products.retrieve(price.product);
      await this.syncProduct(product);
    }

    const priceData = {
      id: price.id,
      custom_id: price.metadata?.custom_id || null,
      product_id: typeof price.product === 'string' ? price.product : price.product.id,
      name: price.nickname || `Price for ${price.id}`,
      price: price.unit_amount || 0,
      description: price.metadata?.description || null,
      features: price.metadata?.features ? JSON.parse(price.metadata.features) : [],
      popular: price.metadata?.popular === 'true',
      currency: price.currency,
      recurring_interval: price.recurring?.interval || null,
    };

    const { data, error } = await supabase
      .from('product_items')
      .upsert(priceData, {
        onConflict: 'id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error syncing price:', error);
      throw error;
    }

    console.log('Price synced successfully:', data);
    return data;
  },

  async deleteProduct(productId: string) {
    console.log('Deleting product from Supabase:', productId);
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }

    console.log('Product deleted successfully');
  },

  async deletePrice(priceId: string) {
    console.log('Deleting price from Supabase:', priceId);
    
    const { error } = await supabase
      .from('product_items')
      .delete()
      .eq('id', priceId);

    if (error) {
      console.error('Error deleting price:', error);
      throw error;
    }

    console.log('Price deleted successfully');
  },

  async createUserPurchase(session: any) {
    console.log('Creating user purchase record:', session.id);
    
    try {
      const purchaseData = {
        user_id: session.metadata?.userId,
        product_item_id: session.metadata?.priceId,
        stripe_product_id: session.metadata?.itemId,
        stripe_payment_intent_id: session.payment_intent,
        stripe_session_id: session.id,
        stripe_customer_id: session.customer,
        amount_paid: session.amount_total || 0,
        currency: session.currency || 'usd',
        payment_status: 'completed',
      };

      console.log('Purchase data:', purchaseData);

      // Check if user and price exist
      if (!purchaseData.user_id || !purchaseData.product_item_id) {
        console.error('Missing required data:', { 
          userId: purchaseData.user_id, 
          priceId: purchaseData.product_item_id 
        });
        return null;
      }

      const { data, error } = await supabase
        .from('user_purchases')
        .upsert(purchaseData, {
          onConflict: 'user_id,product_item_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user purchase:', error);
        throw error;
      }

      console.log('User purchase created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating user purchase:', error);
      throw error;
    }
  },
};