// Netlify serverless function: Create PayPal order
// POST /.netlify/functions/paypal-create-order
// Body: { "total": 49.99 }

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = process.env.PAYPAL_API || "https://api-m.sandbox.paypal.com";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

async function getAccessToken() {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + Buffer.from(PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PayPal auth failed (${res.status}): ${text}`);
  }
  const data = await res.json();
  if (!data.access_token) {
    throw new Error("No access_token in PayPal auth response");
  }
  return data.access_token;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method Not Allowed" });
  }

  if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
    console.error("Missing PAYPAL_CLIENT_ID or PAYPAL_SECRET env vars");
    return jsonResponse(500, { error: "PayPal is not configured on the server" });
  }

  try {
    const { total } = JSON.parse(event.body);
    if (!total || total <= 0) {
      return jsonResponse(400, { error: "Invalid total" });
    }

    const accessToken = await getAccessToken();

    const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "PayPal-Request-Id": `forgeks-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total.toFixed(2),
            },
            description: "Forge Ks — Game Purchase",
          },
        ],
        application_context: {
          brand_name: "Forge Ks",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      }),
    });

    const order = await res.json();

    if (!res.ok) {
      console.error("PayPal create order error:", JSON.stringify(order));
      return jsonResponse(res.status, { error: order.message || "Failed to create order", details: order });
    }

    return jsonResponse(200, { id: order.id, status: order.status });
  } catch (err) {
    console.error("Server error:", err);
    return jsonResponse(500, { error: err.message });
  }
}
