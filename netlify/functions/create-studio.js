// FILE: netlify/functions/create-studio.js
// PURPOSE: Automatically create a new studio JSON file when a user pays the $100 membership fee.

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    // Verify request is POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body);

    // Extract the Stripe session ID sent from webhook
    const sessionId = body.session_id;
    if (!sessionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "session_id is required" }),
      };
    }

    // Retrieve full Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || "New Creator";

    // Create slug: john-doe → john-doe
    const slug = customerName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Build studio JSON object
    const newStudio = {
      display_name: customerName,
      owner_email: customerEmail,
      created_at: new Date().toISOString(),
      items: [], // empty for now
    };

    // Convert to file content
    const fileContent = JSON.stringify(newStudio, null, 2);

    // Push file to GitHub
    const repoOwner = "YOUR_GITHUB_USERNAME";
    const repoName = "YOUR_REPO_NAME"; // e.g., mybox-studio-site
    const filePath = `data/studios/${slug}.json`;

    const githubUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    // Check if file exists
    const existingFile = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    }).then((res) => res.json());

    const commitMessage = `Create studio file for ${customerName}`;

    // Build upload body
    const uploadBody = {
      message: commitMessage,
      content: Buffer.from(fileContent).toString("base64"),
      committer: {
        name: "MyBox Studios",
        email: "noreply@myboxstudios.com",
      },
    };

    if (existingFile.sha) {
      uploadBody.sha = existingFile.sha; // update existing file
    }

    // Upload via GitHub API
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
    console.log("ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
