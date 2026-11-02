import "server-only";

const serverKey = process.env.MIDTRANS_SERVER_KEY;
const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export async function createSnapTransaction(input: {
  orderId: string; amount: number; productName: string;
  playerId: string; email?: string;
}) {
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi.");
  const base = isProduction
    ? "https://app.midtrans.com"
    : "https://app.sandbox.midtrans.com";

  const auth = Buffer.from(`${serverKey}:`).toString("base64");
  const response = await fetch(`${base}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.amount
      },
      item_details: [{
        id: input.orderId,
        price: input.amount,
        quantity: 1,
        name: input.productName.slice(0, 50)
      }],
      customer_details: {
        email: input.email || "customer@example.invalid",
        first_name: "Customer"
      },
      custom_field1: input.playerId
    }),
    cache: "no-store"
  });

  const data = await response.json();
  if (!response.ok || !data.token || !data.redirect_url) {
    throw new Error(`Midtrans menolak pembuatan transaksi (${response.status}).`);
  }
  return { token: data.token as string, redirectUrl: data.redirect_url as string };
}

export function verifyMidtransSignature(payload: Record<string, unknown>) {
  const crypto = require("node:crypto") as typeof import("node:crypto");
  if (!serverKey) throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi.");
  const orderId = String(payload.order_id ?? "");
  const statusCode = String(payload.status_code ?? "");
  const grossAmount = String(payload.gross_amount ?? "");
  const signature = String(payload.signature_key ?? "");
  const expected = crypto.createHash("sha512")
    .update(orderId + statusCode + grossAmount + serverKey)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}
