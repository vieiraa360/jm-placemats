import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { items, customerEmail, customerName } = await req.json();

    if (!items || items.length === 0) {
      return Response.json({ error: 'No items in cart' }, { status: 400 });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail || user.email,
      metadata: {
        user_id: user.id,
        customer_name: customerName || user.full_name,
      },
      success_url: `${req.headers.get('origin')}/PaymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/PaymentCancel`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}