// netlify/functions/stripe-webhook.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fs = require("fs");
const path = require("path");

exports.handler = async (event, context) => {
  try {
    const sig = event.headers["stripe-signature"];

    // Validate webhook signature
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    // Only handle successful checkout
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;

      // Payment is confirmed
      const customer_email = session.customer_details.email || "unknown@email";

      // Determine studio type
      let studioType = "studio";
      if (session.metadata && session.metadata.studio_type) {
        studioType = session.metadata.studio_type;
      }

      // Generate slug
      const slug = customer_email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Build new studio entry
      const newStudio = {
        id: `studio-${Date.now()}`,
        owner_email: customer_email,
        type: studioType,
        slug: slug,
        display_name: `${slug}'s Studio`,
        created_at: new Date().toISOString()
      };

      // Path to studios.json
      const studiosPath = path.join(__dirname, "../../data/studios.json");

      // Load existing studios
      let db = { studios: [] };
      if (fs.existsSync(studiosPath)) {
        db = JSON.parse(fs.readFileSync(studiosPath));
      }

      // Add new studio
      db.studios.push(newStudio);

      // Save updated file
      fs.writeFileSync(studiosPath, JSON.stringify(db, null, 2));

      console.log("✅ Studio created:", newStudio);

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return { statusCode: 200, body: "Event ignored." };

  } catch (err) {
    console.error("❌ Webhook Processing Error:", err);
    return { statusCode: 500, body: "Error processing webhook." };
  }
};
