import "server-only";

/**
 * Deliberately fail-closed.
 * Implement this adapter only after obtaining the official VIP Reseller API docs.
 * The storefront URL is not an API specification. Never guess auth/signature/body formats.
 */
export async function createSupplierOrder(_input: {
  invoice: string; productCode: string; playerId: string; serverId?: string;
}) {
  const required = [
    "VIP_RESELLER_API_BASE_URL", "VIP_RESELLER_API_KEY",
    "VIP_RESELLER_CREATE_ORDER_PATH"
  ];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Integrasi supplier belum siap. Konfigurasi belum lengkap: ${missing.join(", ")}`);
  }
  throw new Error(
    "Supplier belum diaktifkan: format autentikasi dan payload wajib dipetakan dari dokumentasi resmi VIP Reseller."
  );
}
