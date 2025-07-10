 # Next.js Stripe Payments App with Supabase

A complete e-commerce demo built with Next.js, Stripe Checkout, and Supabase, featuring user authentication, product management, secure payment processing, and automatic purchase tracking.

## Features

- **User Authentication**: Email/password login with Supabase Auth
- **3 Product Categories**: Premium Membership, Cloud Storage, and API Access
- **Multiple Pricing Options**: One-time payments and subscriptions
- **Stripe Checkout Integration**: Secure hosted payment pages
- **Database Integration**: Supabase for user data and purchase records
- **Webhook Processing**: Automatic payment confirmation and database updates
- **Purchase Tracking**: Real-time purchase status from database
- **Responsive Design**: Mobile-friendly interface
- **TypeScript**: Full type safety

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## Product Structure

### Premium Membership
- **Monthly Plan**: $29.99 - Perfect for trying out premium features (Subscription)
- **Yearly Plan**: $99.99 - Best value for regular users (Subscription)
- **Lifetime Plan**: $199.99 - One-time payment for lifetime access

### Cloud Storage
- **50GB Storage**: $9.99 - Perfect for personal use (One-time)
- **100GB Storage**: $19.99 - Great for small teams (One-time)
- **500GB Storage**: $49.99 - For power users and businesses (One-time)

### API Access
- **Basic API**: $19.99 - Perfect for small projects (One-time)
- **Pro API**: $49.99 - For growing applications (One-time)
- **Enterprise API**: $99.99 - For large-scale applications (One-time)

## Complete Setup Guide

Follow these steps to set up the project from scratch:

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/obiscr/nextjs-stripe-supabase-starter.git
cd nextjs-stripe-supabase-starter

# Install dependencies
npm install
```

### Step 2: Create .env.local file

Create a `.env.local` file in the root directory.

```bash
- nextjs-stripe-supabase-starter
   - src/
   - **.env.local** create this file
   - ...
```

### Step 3: Create Supabase Account

1. Go to [Supabase](https://supabase.com) and create a free account

2. Create an organization and a new project

3. Go to **Project overview**

   Copy `Project URL` / `API Key` into *.env.local* file

   ```bash ins={2-3}
   # Supabase Keys (get from Supabase Project Dashboard > Project Settings > API Keys)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. Setup Service Role Key

   Go to **Project Settings** > **API Keys**
   Copy `service_role` key into *.env.local* file

   ```bash collapse={2-3} ins={4}
   # Supabase Keys (get from Supabase Project Dashboard > Project Settings > API Keys)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

   > Please keep `SERVICE_ROLE_KEY` private, DO NOT share with anyone.

### Step 4: Create Stripe Account

1. Go to [Stripe](https://stripe.com) and create a free account

2. Complete the account setup process

3. Go to [Stripe Dashboard](https://dashboard.stripe.com)

4. Navigate to **Developers** > **API Keys**

5. Copy your **Publishable key** and **Secret key** (use test keys for development) into `.env.local` file

   ```bash ins={2-3}
   # Stripe Keys
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

### Step 5: Set Up Stripe Webhook Endpoint

#### Local Dev

Because of local development, stripe's webhook cannot be accessed directly, so you need to use stripe cli to listen to webhook. Open terminal and run local listener.
    
```bash
> stripe listen --forward-to localhost:3000/api/webhooks/stripe
A newer version of the Stripe CLI is available, please update to: v1.28.0
> Ready! You are using Stripe API Version [2022-08-01]. Your webhook signing secret is whsec_xxxxx (^C to quit)
```

You will see the webhook signing secret in the terminal. Copy **whsec_xxxxx** into **.env.local** file.

```bash collapse={2-3} ins={4}
# Get from Stripe Dashboard: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

#### Production

Open Stripe Dashboard and go to Developers - Webhooks, Create a new webhook. 
    
**API Version**: 2025.06-30.basil

**Event**: Make sure you have selected following events.

```bash
- Checkout
   - checkout.session.completed
- Payment&Intent
   - payment_intent.succeeded
   - payment_intent.payment_failed
- Product
   - product.created
   - product.updated
   - product.deleted
- Price
   - price.created
   - price.updated
   - price.deleted
```

Finish the setup steps. Open webhook url and copy Signing secret **whsec_xxxxx** into **.env.local** file.

```bash collapse={2-3} ins={4}
# Get from Stripe Dashboard: https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 6: Initialize Supabase

1. Login to Supabase

```bash
> npx supabase login
Hello from Supabase! Press Enter to open browser and login automatically.

Here is your login link in case browser did not open https://supabase.com/dashboard/cli/login?session_id=uuid&token_name=cli_@hostname&public_key=string

Enter your verification code: c4d28d97
Token cli_@hostname created successfully.

You are now logged in. Happy coding!
```

2. Init supabase

```bash
> npx supabase init
Generate VS Code settings for Deno? [y/N] N
Generate IntelliJ Settings for Deno? [y/N] N
Finished supabase init.
```

3. Link to your supabase project

```bash collapse={3-37}
> npx supabase link --project-ref your-project-id
Enter your database password (or leave blank to skip): // Enter your database password here
Connecting to remote database...
NOTICE (42P06): schema "supabase_migrations" already exists, skipping
Finished supabase link.
WARNING: Local config differs from linked project. Try updating supabase/config.toml
diff supabase/config.toml your-project-id
--- supabase/config.toml
+++ your-project-id
@@ -54,8 +54,8 @@

[auth]
enabled = true
-site_url = "http://127.0.0.1:3000"
-additional_redirect_urls = ["https://127.0.0.1:3000"]
+site_url = "http://localhost:3000"
+additional_redirect_urls = []
jwt_expiry = 3600
enable_refresh_token_rotation = true
refresh_token_reuse_interval = 10
@@ -96,9 +96,9 @@
[auth.email]
enable_signup = true
double_confirm_changes = true
-enable_confirmations = false
+enable_confirmations = true
secure_password_change = false
-max_frequency = "1s"
+max_frequency = "1m0s"
otp_length = 6
otp_expiry = 3600
[auth.email.template]
```

4. Apply migrations

```bash
> npx supabase db push
Connecting to remote database...
Do you want to push these migrations to the remote database?
• 20250710080949_init.sql

[Y/n] Y
NOTICE (42P06): schema "supabase_migrations" already exists, skipping
NOTICE (42P07): relation "schema_migrations" already exists, skipping
NOTICE (42701): column "statements" of relation "schema_migrations" already exists, skipping
NOTICE (42701): column "name" of relation "schema_migrations" already exists, skipping
Applying migration 20250710080949_init.sql...
NOTICE (42710): extension "uuid-ossp" already exists, skipping
Finished supabase db push.
```

### Step 7: Initialize Stripe Products

Run the automated script to create products and prices in your Stripe account:

```bash collapse={8-14, 19-27, 31-39, 43-51}
> npm run stripe:init

# You will see the following output.

> nextjs-stripe-app@0.1.0 stripe:init
> ts-node scripts/stripe-init.ts

(node:76080) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:76080) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/obiscr/projects/nextjs-stripe-supabase-starter/scripts/stripe-init.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/obiscr/projects/nextjs-stripe-supabase-starter/package.json.
[dotenv@17.2.0] injecting env (7) from .env.local (tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] })
🚀 Starting Stripe initialization...


📋 Processing product: Premium Membership
──────────────────────────────────────────────────
📦 Creating product: Premium Membership
✅ Product created: ************** - Premium Membership
💰 Creating price: Premium Monthly - $29.99
✅ Price created: ************** - Premium Monthly
💰 Creating price: Premium Yearly - $99.99
✅ Price created: ************** - Premium Yearly
💰 Creating price: Premium Lifetime - $199.99
✅ Price created: ************** - Premium Lifetime
✨ Completed Premium Membership with 3 prices

📋 Processing product: Cloud Storage
──────────────────────────────────────────────────
📦 Creating product: Cloud Storage
✅ Product created: ************** - Cloud Storage
💰 Creating price: 50GB Storage - $9.99
✅ Price created: ************** - 50GB Storage
💰 Creating price: 100GB Storage - $19.99
✅ Price created: ************** - 100GB Storage
💰 Creating price: 500GB Storage - $49.99
✅ Price created: ************** - 500GB Storage
✨ Completed Cloud Storage with 3 prices

📋 Processing product: API Access
──────────────────────────────────────────────────
📦 Creating product: API Access
✅ Product created: ************** - API Access
💰 Creating price: Basic API - $19.99
✅ Price created: ************** - Basic API
💰 Creating price: Pro API - $49.99
✅ Price created: ************** - Pro API
💰 Creating price: Enterprise API - $99.99
✅ Price created: ************** - Enterprise API
✨ Completed API Access with 3 prices

🎉 Stripe initialization completed successfully!

📊 Summary:
────────────────────────────────────────────────────────────

🏷️  Premium Membership (**************)
   💰 Premium Monthly: ************** - $29.99
   💰 Premium Yearly: ************** - $99.99
   💰 Premium Lifetime: ************** - $199.99

🏷️  Cloud Storage (**************)
   💰 50GB Storage: ************** - $9.99
   💰 100GB Storage: ************** - $19.99
   💰 500GB Storage: ************** - $49.99

🏷️  API Access (**************)
   💰 Basic API: ************** - $19.99
   💰 Pro API: ************** - $49.99
   💰 Enterprise API: ************** - $99.99

✅ You can now run your application and see the products!
🔗 Stripe Dashboard: https://dashboard.stripe.com/products
```

This will create all the products and prices defined in the configuration. You can check them in your Stripe Dashboard.

At this point, you can see the webhook trigger in stripe webhook dashboard.

```bash
A newer version of the Stripe CLI is available, please update to: v1.28.0
> Ready! You are using Stripe API Version [2022-08-01]. Your webhook signing secret is whsec_xxxxx (^C to quit)
2025-07-10 21:44:51   --> product.created [evt_******************]
2025-07-10 21:44:52   --> plan.created [evt_******************]
2025-07-10 21:44:52  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:52   --> price.created [evt_******************]
2025-07-10 21:44:53  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:53   --> plan.created [evt_******************]
2025-07-10 21:44:53  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:53   --> price.created [evt_******************]
2025-07-10 21:44:54  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:54   --> price.created [evt_******************]
2025-07-10 21:44:54  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:54   --> product.created [evt_******************]
2025-07-10 21:44:54  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:55  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:55   --> price.created [evt_******************]
2025-07-10 21:44:56  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:56   --> price.created [evt_******************]
2025-07-10 21:44:57   --> price.created [evt_******************]
2025-07-10 21:44:57  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:58   --> product.created [evt_******************]
2025-07-10 21:44:58  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:58  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:44:58   --> price.created [evt_******************]
2025-07-10 21:44:59   --> price.created [evt_******************]
2025-07-10 21:44:59  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:45:00   --> price.created [evt_******************]
2025-07-10 21:45:00  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
2025-07-10 21:45:01  <--  [200] POST http://localhost:3000/api/webhooks/stripe [evt_******************]
```

If everything goes well, you will see the product and product item data in supabase.

### Step 8: Generate data types

```
> npm run supabase:gen-types

> nextjs-stripe-app@0.1.0 supabase:gen-types
> supabase gen types typescript --linked > lib/database.types.ts
```

### Step 9: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Finish the complete purchase flow

1. Register a new user

   + Click "Login" button, 
   + switch to "Register" tab
   + Create a new account with email and password

   ![](https://github.com/user-attachments/assets/2ef39888-1ef7-406c-92c7-865a5c796d98)

2. Browse products

   + View the 3 product categories
   + Each product has multiple pricing tiers

   ![](https://github.com/user-attachments/assets/a297d176-654b-4d4c-a733-2f32f7b25f63)

3. Make a test purchase

   + Click "Buy Now" on any product
   + You'll be redirected to Stripe Checkout
   + Use test card number: `4242 4242 4242 4242`
   + Use any future expiry date and CVC
   + Complete the payment

   ![](https://github.com/user-attachments/assets/b996c2a7-16ed-4fa0-91b2-889b4e6246c3)
   
4. Payment successful

   + You'll be redirected to success page

   ![](https://github.com/user-attachments/assets/32499129-f0d8-44ca-bbd8-681a1e15fa3b)

5. Verify purchase

   + Return to homepage
   + The purchased item should show "Purchased" status

   ![](https://github.com/user-attachments/assets/61a7d58e-378f-4788-a3f3-c94cceceb802)

## Summary

This is a simple example of how to use Stripe with Supabase. You can use this as a starting point for your own project.