import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Initialize Stripe with error handling
let stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ STRIPE_SECRET_KEY is not set in environment variables');
  } else {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized');
  }
} catch (error) {
  console.error('❌ Error initializing Stripe:', error.message);
}

/**
 * Create a Stripe checkout session
 */
export const createCheckoutSession = async (req, res) => {
  try {
    // Check if Stripe is initialized
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.'
      });
    }

    const { items, customerEmail, customerName, shippingAddress } = req.body;

    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in cart'
      });
    }

    if (!customerEmail || !customerName || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required'
      });
    }

    // Fetch products from database to get Stripe price IDs
    const productIds = items.map(item => item.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    // Create a map for quick lookup
    const productMap = new Map(products.map(p => [p._id.toString(), p]));

    // Build line items for Stripe
    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = productMap.get(item.product_id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.product_id} not found`
        });
      }

      if (!product.in_stock) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is out of stock`
        });
      }

      // Use Stripe price ID if available, otherwise create price data
      if (product.stripe_price_id) {
        lineItems.push({
          price: product.stripe_price_id,
          quantity: item.quantity
        });
      } else {
        lineItems.push({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: product.name,
              description: product.description || '',
              images: product.image_url ? [getFullImageUrl(product.image_url)] : [],
            },
            unit_amount: Math.round(product.price * 100), // Convert to pence
          },
          quantity: item.quantity,
        });
      }

      subtotal += product.price * item.quantity;
    }

    // Calculate shipping (free over £75)
    const shipping = subtotal > 75 ? 0 : 895; // 895 pence = £8.95
    const total = subtotal * 100 + shipping; // Total in pence

    // Create order in database with pending status
    const order = new Order({
      customer_name: customerName,
      customer_email: customerEmail,
      shipping_address: shippingAddress,
      items: items.map(item => {
        const product = productMap.get(item.product_id);
        return {
          product_id: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        };
      }),
      subtotal: subtotal,
      shipping: shipping / 100,
      total: total / 100,
      status: 'pending',
      payment_status: 'pending'
    });

    // Add shipping as a line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping'
          },
          unit_amount: shipping,
        },
        quantity: 1,
      });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      metadata: {
        order_id: order._id.toString(),
        customer_name: customerName,
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/PaymentCancel`,
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU', 'IE'], // Add more as needed
      },
    });

    // Save Stripe session ID to order
    order.stripe_session_id = session.id;
    await order.save();

    res.json({
      success: true,
      url: session.url,
      session_id: session.id,
      order_id: order._id
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Handle Stripe webhook events
 */
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSucceeded(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailed(failedPayment);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session) {
  try {
    const order = await Order.findOne({ stripe_session_id: session.id });
    
    if (!order) {
      console.error(`Order not found for session: ${session.id}`);
      return;
    }

    order.payment_status = 'paid';
    order.status = 'confirmed';
    order.stripe_payment_intent_id = session.payment_intent;
    
    if (session.shipping_details) {
      order.shipping_address = formatShippingAddress(session.shipping_details.address);
    }

    await order.save();
    console.log(`✅ Order ${order._id} confirmed and paid`);
  } catch (error) {
    console.error('Error handling checkout completion:', error);
    throw error;
  }
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(paymentIntent) {
  try {
    const order = await Order.findOne({ stripe_payment_intent_id: paymentIntent.id });
    
    if (order) {
      order.payment_status = 'paid';
      if (order.status === 'pending') {
        order.status = 'confirmed';
      }
      await order.save();
      console.log(`✅ Payment succeeded for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent) {
  try {
    const order = await Order.findOne({ stripe_payment_intent_id: paymentIntent.id });
    
    if (order) {
      order.payment_status = 'failed';
      await order.save();
      console.log(`❌ Payment failed for order ${order._id}`);
    }
  } catch (error) {
    console.error('Error handling payment failure:', error);
    throw error;
  }
}

/**
 * Format shipping address from Stripe format
 */
function formatShippingAddress(address) {
  const parts = [];
  if (address.line1) parts.push(address.line1);
  if (address.line2) parts.push(address.line2);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.postal_code) parts.push(address.postal_code);
  if (address.country) parts.push(address.country);
  return parts.join(', ');
}

/**
 * Get full image URL (handles both absolute and relative URLs)
 */
function getFullImageUrl(imageUrl) {
  if (!imageUrl) return '';
  
  // If already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise, construct full URL
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
}

/**
 * Verify checkout session and get order details
 */
export const verifySession = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Retrieve session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Find order in database
    const order = await Order.findOne({ stripe_session_id: session_id })
      .populate('items.product_id', 'name image_url');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        id: order._id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total: order.total,
        status: order.status,
        payment_status: order.payment_status,
        items: order.items,
        created_at: order.createdAt
      },
      session: {
        payment_status: session.payment_status,
        customer_email: session.customer_email
      }
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify session',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};
