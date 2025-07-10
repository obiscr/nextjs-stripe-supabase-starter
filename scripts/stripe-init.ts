#!/usr/bin/env ts-node

import Stripe from 'stripe';
import dotenv from 'dotenv';
import * as readline from 'readline';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Check environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
  typescript: true,
});

// Product configuration
interface ProductConfig {
  name: string;
  description: string;
  metadata?: Record<string, string>;
  prices: {
    nickname: string;
    unit_amount: number;
    currency: string;
    metadata?: Record<string, string>;
    recurring?: {
      interval: 'month' | 'year';
    };
  }[];
}

const productsConfig: ProductConfig[] = [
  {
    name: 'Premium Membership',
    description: 'Access to all premium features with unlimited usage and priority support',
    metadata: {
      custom_id: 'premium-membership',
      icon: 'crown'
    },
    prices: [
      {
        nickname: 'Premium Monthly',
        unit_amount: 2999, // $29.99
        currency: 'usd',
        recurring: { interval: 'month' },
        metadata: {
          custom_id: 'premium-monthly',
          description: 'Perfect for trying out premium features',
          features: JSON.stringify(['All premium features', 'Priority support', 'Monthly billing'])
        }
      },
      {
        nickname: 'Premium Yearly',
        unit_amount: 9999, // $99.99
        currency: 'usd',
        recurring: { interval: 'year' },
        metadata: {
          custom_id: 'premium-yearly',
          description: 'Best value for regular users',
          features: JSON.stringify(['All premium features', 'Priority support', 'Save 72%', 'Annual billing']),
          popular: 'true'
        }
      },
      {
        nickname: 'Premium Lifetime',
        unit_amount: 19999, // $199.99
        currency: 'usd',
        metadata: {
          custom_id: 'premium-lifetime',
          description: 'One-time payment for lifetime access',
          features: JSON.stringify(['All premium features', 'Priority support', 'One-time payment', 'Lifetime access'])
        }
      }
    ]
  },
  {
    name: 'Cloud Storage',
    description: 'Secure cloud storage for your files and documents',
    metadata: {
      custom_id: 'cloud-storage',
      icon: 'cloud'
    },
    prices: [
      {
        nickname: '50GB Storage',
        unit_amount: 999, // $9.99
        currency: 'usd',
        metadata: {
          custom_id: 'storage-50gb',
          description: 'Perfect for personal use',
          features: JSON.stringify(['50GB storage', 'File sync', 'Basic sharing'])
        }
      },
      {
        nickname: '100GB Storage',
        unit_amount: 1999, // $19.99
        currency: 'usd',
        metadata: {
          custom_id: 'storage-100gb',
          description: 'Great for small teams',
          features: JSON.stringify(['100GB storage', 'File sync', 'Advanced sharing', 'Version history']),
          popular: 'true'
        }
      },
      {
        nickname: '500GB Storage',
        unit_amount: 4999, // $49.99
        currency: 'usd',
        metadata: {
          custom_id: 'storage-500gb',
          description: 'For power users and businesses',
          features: JSON.stringify(['500GB storage', 'File sync', 'Advanced sharing', 'Version history', 'Priority support'])
        }
      }
    ]
  },
  {
    name: 'API Access',
    description: 'Advanced API access with higher rate limits and premium features',
    metadata: {
      custom_id: 'api-access',
      icon: 'code'
    },
    prices: [
      {
        nickname: 'Basic API',
        unit_amount: 1999, // $19.99
        currency: 'usd',
        metadata: {
          custom_id: 'api-basic',
          description: 'Perfect for small projects',
          features: JSON.stringify(['1,000 API calls/month', 'Basic endpoints', 'Email support'])
        }
      },
      {
        nickname: 'Pro API',
        unit_amount: 4999, // $49.99
        currency: 'usd',
        metadata: {
          custom_id: 'api-pro',
          description: 'For growing applications',
          features: JSON.stringify(['10,000 API calls/month', 'All endpoints', 'Priority support', 'Analytics']),
          popular: 'true'
        }
      },
      {
        nickname: 'Enterprise API',
        unit_amount: 9999, // $99.99
        currency: 'usd',
        metadata: {
          custom_id: 'api-enterprise',
          description: 'For large-scale applications',
          features: JSON.stringify(['Unlimited API calls', 'All endpoints', 'Dedicated support', 'Custom integrations'])
        }
      }
    ]
  }
];

// Helper function: delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function: format price display
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
};

// Create product
async function createProduct(productConfig: ProductConfig): Promise<string> {
  try {
    console.log(`📦 Creating product: ${productConfig.name}`);
    
    const product = await stripe.products.create({
      name: productConfig.name,
      description: productConfig.description,
      metadata: productConfig.metadata || {},
    });
    
    console.log(`✅ Product created: ${product.id} - ${product.name}`);
    return product.id;
  } catch (error) {
    console.error(`❌ Failed to create product ${productConfig.name}:`, error);
    throw error;
  }
}

// Create price
async function createPrice(productId: string, priceConfig: ProductConfig['prices'][0]): Promise<string> {
  try {
    console.log(`💰 Creating price: ${priceConfig.nickname} - ${formatPrice(priceConfig.unit_amount)}`);
    
    const priceData: Stripe.PriceCreateParams = {
      product: productId,
      unit_amount: priceConfig.unit_amount,
      currency: priceConfig.currency,
      nickname: priceConfig.nickname,
      metadata: priceConfig.metadata || {},
    };

    // Add subscription configuration (if any)
    if (priceConfig.recurring) {
      priceData.recurring = priceConfig.recurring;
    }
    
    const price = await stripe.prices.create(priceData);
    
    console.log(`✅ Price created: ${price.id} - ${priceConfig.nickname}`);
    return price.id;
  } catch (error) {
    console.error(`❌ Failed to create price ${priceConfig.nickname}:`, error);
    throw error;
  }
}

// Check if products already exist
async function checkExistingProducts(): Promise<boolean> {
  try {
    const products = await stripe.products.list({ limit: 100 });
    const existingProducts = products.data.filter(p => p.active);
    
    if (existingProducts.length > 0) {
      console.log(`⚠️  Found ${existingProducts.length} existing products:`);
      existingProducts.forEach(p => {
        console.log(`   - ${p.id}: ${p.name}`);
      });
      
      // Ask user if they want to continue
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      return new Promise((resolve) => {
        rl.question('\n❓ Do you want to continue creating new products? (y/N): ', (answer: string) => {
          rl.close();
          resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
        });
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Failed to check existing products:', error);
    return false;
  }
}

// Main function
async function initializeStripe() {
  console.log('🚀 Starting Stripe initialization...\n');
  
  try {
    // Check existing products
    const shouldContinue = await checkExistingProducts();
    if (!shouldContinue) {
      console.log('❌ Initialization cancelled by user');
      return;
    }
    
    const results: Array<{
      product: string;
      productId: string;
      prices: Array<{ name: string; priceId: string; amount: number }>;
    }> = [];
    
    // Create products and prices one by one
    for (const productConfig of productsConfig) {
      console.log(`\n📋 Processing product: ${productConfig.name}`);
      console.log('─'.repeat(50));
      
      // Create product
      const productId = await createProduct(productConfig);
      
      // Short delay to avoid API limits
      await delay(500);
      
      // Create price
      const priceResults: Array<{ name: string; priceId: string; amount: number }> = [];
      
      for (const priceConfig of productConfig.prices) {
        const priceId = await createPrice(productId, priceConfig);
        priceResults.push({
          name: priceConfig.nickname,
          priceId,
          amount: priceConfig.unit_amount
        });
        
        // Short delay
        await delay(300);
      }
      
      results.push({
        product: productConfig.name,
        productId,
        prices: priceResults
      });
      
      console.log(`✨ Completed ${productConfig.name} with ${priceResults.length} prices`);
    }
    
    // Show summary
    console.log('\n🎉 Stripe initialization completed successfully!\n');
    console.log('📊 Summary:');
    console.log('─'.repeat(60));
    
    results.forEach(result => {
      console.log(`\n🏷️  ${result.product} (${result.productId})`);
      result.prices.forEach(price => {
        console.log(`   💰 ${price.name}: ${price.priceId} - ${formatPrice(price.amount)}`);
      });
    });
    
    console.log('\n✅ You can now run your application and see the products!');
    console.log('🔗 Stripe Dashboard: https://dashboard.stripe.com/products');
    
  } catch (error) {
    console.error('\n❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Run script
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeStripe();
}

export { initializeStripe };