// netlify/functions/join-create-session.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    // Create Stripe Checkout Session for $100 Studio Membership
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "MyBox Studios — $100 Studio Membership",
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/join.html`,

      metadata: {
        app: "mybox-studios",
        studio_type: "studio", // webhook will determine music or movies later
      }
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: session.id }),
    };

  } catch (error) {
    console.error("Join Checkout Session Error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to create checkout session.",
        details: error.message,
      }),
    };
  }
};
