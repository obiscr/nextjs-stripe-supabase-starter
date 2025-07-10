import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { getBaseUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { priceId, itemId } = await request.json();

    if (!priceId || !itemId) {
      return NextResponse.json(
        { error: 'Price ID and Item ID are required' },
        { status: 400 }
      );
    }

    // Get user information from Supabase
    const cookieStore = cookies();
    const supabase = await createClient(cookieStore);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const stripe = getStripe();

    // Get the base URL
    const baseUrl = getBaseUrl(request);

    // Get price information to determine if it's a subscription or one-time payment
    const price = await stripe.prices.retrieve(priceId);
    
    // Determine the correct mode based on the price type
    const mode = price.recurring ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
      metadata: {
        itemId: itemId,
        userId: user.id,
        userEmail: user.email || '',
        priceId: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
