import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe } from '@/lib/stripe';
import { handleStripeProductSync } from '@/utils/supabase/webhook';
import Stripe from 'stripe';

const stripe = getStripe();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('Missing STRIPE_WEBHOOK_SECRET');
      return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        
        await handleCheckoutCompleted(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        
        await handlePaymentSucceeded(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        
        await handlePaymentFailed(failedPayment);
        break;

      case 'product.created':
        const createdProduct = event.data.object as Stripe.Product;
        console.log('Product created:', createdProduct.id);
        await handleStripeProductSync.syncProduct(createdProduct);
        break;

      case 'product.updated':
        const updatedProduct = event.data.object as Stripe.Product;
        console.log('Product updated:', updatedProduct.id);
        await handleStripeProductSync.syncProduct(updatedProduct);
        break;

      case 'product.deleted':
        const deletedProduct = event.data.object as Stripe.Product;
        console.log('Product deleted:', deletedProduct.id);
        await handleStripeProductSync.deleteProduct(deletedProduct.id);
        break;

      case 'price.created':
        const createdPrice = event.data.object as Stripe.Price;
        console.log('Price created:', createdPrice.id);
        await handleStripeProductSync.syncPrice(createdPrice);
        break;

      case 'price.updated':
        const updatedPrice = event.data.object as Stripe.Price;
        console.log('Price updated:', updatedPrice.id);
        await handleStripeProductSync.syncPrice(updatedPrice);
        break;

      case 'price.deleted':
        const deletedPrice = event.data.object as Stripe.Price;
        console.log('Price deleted:', deletedPrice.id);
        await handleStripeProductSync.deletePrice(deletedPrice.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle successful checkout session
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing completed checkout session:', {
    id: session.id,
    amount_total: session.amount_total,
    currency: session.currency,
    status: session.status,
    metadata: session.metadata,
  });

  try {
    // Create user purchase record in database
    await handleStripeProductSync.createUserPurchase(session);
    console.log('✅ User purchase record created successfully');
  } catch (error) {
    console.error('❌ Failed to create user purchase record:', error);
    // Note: We don't throw here to avoid webhook failures
    // The payment was successful even if database update fails
  }
}

// Handle successful payment intent
async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing successful payment:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    metadata: paymentIntent.metadata,
  });

  // Add business logic here
  // For example: update order status, send confirmation email, etc.
}

// Handle failed payment
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing failed payment:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: paymentIntent.status,
    last_payment_error: paymentIntent.last_payment_error,
  });

  // Add failure handling logic here
  // For example: notify user, update order status, etc.
}
