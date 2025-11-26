// FILE: netlify/functions/stripe-webhook.js
// PURPOSE: Handle Stripe webhook events and trigger studio file creation.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle event type
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    console.log("💰 Payment complete for:", session.customer_details.email);

    try {
      // Call create-studio.js Netlify function
      const fetch = (await import("node-fetch")).default;
      await fetch(
        process.env.URL + "/.netlify/functions/create-studio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: session.id }),
        }
      );

      console.log("🎉 Studio creation triggered!");
    } catch (err) {
      console.error("❌ ERROR calling create-studio.js:", err);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
