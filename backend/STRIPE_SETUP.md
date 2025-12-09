# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for jm-placemats.com.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. MongoDB database connection configured
3. Backend server running

## Step 1: Get Your Stripe API Keys

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** and **Secret key**
   - For testing, use the **Test mode** keys
   - For production, use the **Live mode** keys

## Step 2: Configure Environment Variables

Add the following to your `.env` file in the `backend` directory:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret (see Step 4)

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3001  # Change to https://jm-placemats.com in production
```

## Step 3: Install Dependencies

```bash
cd backend
npm install
```

This will install the Stripe SDK along with other dependencies.

## Step 4: Set Up Stripe Webhooks

Webhooks allow Stripe to notify your server about payment events.

### For Local Development (using Stripe CLI):

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login to Stripe:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### For Production:

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://your-backend-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the **Signing secret** and add it to your production `.env`

## Step 5: Seed Products Database

Populate your MongoDB database with products:

```bash
cd backend
node src/scripts/seedProducts.js
```

This will create all the products from your catalog in the database.

## Step 6: (Optional) Sync Products to Stripe

If you want to create Stripe Products and Prices for better management:

1. You can manually create products in Stripe Dashboard
2. Or use Stripe API to create products programmatically
3. Update the `stripe_product_id` and `stripe_price_id` fields in your MongoDB products

The current implementation works without pre-creating Stripe products - it creates prices on-the-fly during checkout.

## Step 7: Test the Integration

1. Start your backend server:
   ```bash
   npm run dev
   ```

2. Start your frontend:
   ```bash
   npm run dev
   ```

3. Test the checkout flow:
   - Add products to cart
   - Go to checkout
   - Use Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date and any CVC

## Testing Cards

Stripe provides test cards for different scenarios:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

See more: https://stripe.com/docs/testing

## Production Checklist

Before going live:

- [ ] Switch to Stripe Live mode keys
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Set up production webhook endpoint
- [ ] Test with real card (use small amount first)
- [ ] Set up order fulfillment workflow
- [ ] Configure email notifications for orders
- [ ] Set up error monitoring

## API Endpoints

### Create Checkout Session
```
POST /api/stripe/create-checkout-session
```

### Verify Session (for success page)
```
GET /api/stripe/verify-session?session_id={CHECKOUT_SESSION_ID}
```

### Webhook Endpoint
```
POST /api/stripe/webhook
```

## Troubleshooting

### Webhook signature verification fails
- Make sure `STRIPE_WEBHOOK_SECRET` is correct
- Ensure webhook endpoint receives raw body (already configured)
- Check that you're using the correct webhook secret for your environment (test vs live)

### Products not showing
- Run the seed script: `node src/scripts/seedProducts.js`
- Check MongoDB connection
- Verify products API: `GET /api/products`

### Checkout redirect fails
- Verify `FRONTEND_URL` in `.env` matches your frontend URL
- Check CORS settings in `server.js`

## Support

For Stripe-specific issues, check:
- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
