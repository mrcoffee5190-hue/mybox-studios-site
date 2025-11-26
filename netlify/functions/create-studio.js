// FILE: netlify/functions/create-studio.js
// PURPOSE: Automatically create a new studio JSON file after a successful $100 membership payment.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Must be POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body);

    // Expect session_id from webhook
    const sessionId = body.session_id;

    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "session_id is required" }),
      };
    }

    // Retrieve the full Stripe Checkout Session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || "New Creator";

    // Convert name → URL slug
    let slug = customerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Build studio JSON object
    const newStudio = {
      display_name: customerName,
      owner_email: customerEmail,
      created_at: new Date().toISOString(),
      items: []
    };

    const fileContent = JSON.stringify(newStudio, null, 2);

    // -----------------------------------------
    // 🔥 GitHub Configuration (Corrected)
    // -----------------------------------------
    const repoOwner = "mrcoffee5190-hue";
    const repoName = "mybox-studios-site";
    const filePath = `data/studios/${slug}.json`;

    const githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Does this file already exist?
    const existingFile = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }).then((res) => res.json());

    const commitMessage = `Create studio file for ${customerName}`;

    // Build payload for GitHub commit
    const uploadBody = {
      message: commitMessage,
      content: Buffer.from(fileContent).toString("base64"),
      committer: {
        name: "MyBox Studios Bot",
        email: "noreply@myboxstudios.com",
      },
    };

    // If file exists, update instead of create
    if (existingFile.sha) {
      uploadBody.sha = existingFile.sha;
    }

    // Upload file to GitHub
    const githubResponse = await fetch(githubUrl, {
      method: "PUT",
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify(uploadBody),
    });

    const githubResult = await githubResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        slug,
        github: githubResult,
      }),
    };
  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
