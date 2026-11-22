// MIRRA licence key engine: orders (PayHere + bank transfer), key generation,
// PC activation (signed licences), and the admin API. Mounted at /api/mirra/*.
//
// Environment (read per request; see docs/mirra-store-spec.md §6):
//   DATABASE_URL            Postgres connection string
//   MIRRA_SIGNING_KEY       Ed25519 private key (PEM) — signs licences the app verifies
//   MIRRA_ADMIN_PASSWORD    password for /mirra/admin
//   MIRRA_ADMIN_SECRET      optional: signs admin sessions (defaults to a hash of the signing key)
//   PAYHERE_MERCHANT_ID, PAYHERE_MERCHANT_SECRET, PAYHERE_SANDBOX ("false" for live)
//   BANK_NAME, BANK_ACCOUNT_NAME, BANK_ACCOUNT_NUMBER, BANK_BRANCH
//   MIRRA_DOWNLOAD_URL      where the installer is hosted
//   SITE_URL                https://www.esystemlk.com
//   RESEND_API_KEY, MAIL_FROM, ADMIN_EMAIL   optional emails
import crypto from "node:crypto";
import { q } from "./db.server";
import { MIRRA_PLANS, MIRRA_CURRENCY, MIRRA_VERSION, mirraPlan } from "../../data/mirra";

const env = (k: string, d = "") => (process.env[k] ?? d).trim();
const siteUrl = () => env("SITE_URL", "https://www.esystemlk.com").replace(/\/$/, "");
const downloadUrl = () => env("MIRRA_DOWNLOAD_URL", `https://github.com/DARK-V-98/esystemlkcom/releases/download/mirra-v${MIRRA_VERSION}/MIRRA-Setup-${MIRRA_VERSION}.exe`);
const MAX_SLIP = 3 * 1024 * 1024;
const SLIP_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
const KEY_RE = /^[A-Z]{4}(-[A-Z2-9]{4}){4}$/;
const DEVICE_RE = /^[a-f0-9]{32}$/;
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

// ---------- small helpers ----------
function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
const md5U = (s: string) => crypto.createHash("md5").update(s).digest("hex").toUpperCase();
const randomFrom = (alpha: string, n: number) => Array.from(crypto.randomBytes(n), (b) => alpha[b % alpha.length]).join("");
export const newKey = () => `MIRR-${randomFrom(ALPHA, 4)}-${randomFrom(ALPHA, 4)}-${randomFrom(ALPHA, 4)}-${randomFrom(ALPHA, 4)}`;
const newOrderId = () => `MR${randomFrom("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 8)}`;
const safeEq = (a: string, b: string) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const str = (v: unknown, max = 200) => String(v ?? "").trim().slice(0, max);
const iso = (d: any) => (d ? new Date(d).toISOString() : null);

async function body(req: Request): Promise<any> {
  const type = req.headers.get("content-type") || "";
  const len = Number(req.headers.get("content-length") || 0);
  if (len > 5 * 1024 * 1024) throw new HttpError(413, "Upload is too large.");
  if (type.includes("application/json")) return req.json().catch(() => { throw new HttpError(400, "Bad JSON."); });
  if (type.includes("application/x-www-form-urlencoded")) return Object.fromEntries(new URLSearchParams(await req.text()));
  return {};
}

// ---------- licence signing ----------
function signingKey() {
  const pem = env("MIRRA_SIGNING_KEY").replace(/\\n/g, "\n");
  if (!pem) throw new HttpError(503, "Activation is not set up on the server yet.");
  return crypto.createPrivateKey(pem);
}
function signLicence(payload: Record<string, unknown>) {
  const sig = crypto.sign(null, Buffer.from(JSON.stringify(payload)), signingKey());
  return { payload, sig: sig.toString("base64") };
}

// ---------- keys & fulfilment ----------
async function createKeys(planId: string, count: number, opts: { orderId?: string; note?: string; devices?: number; days?: number | null } = {}) {
  const plan = mirraPlan(planId);
  if (!plan) throw new HttpError(400, "Unknown plan.");
  const devices = Math.max(1, Math.min(10, Number(opts.devices) || plan.devices));
  const days = opts.days === undefined ? plan.days : opts.days;
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    const key = newKey();
    await q("INSERT INTO mirra_keys (key, plan, max_devices, duration_days, order_id, note) VALUES ($1,$2,$3,$4,$5,$6)",
      [key, plan.id, devices, days, opts.orderId ?? null, opts.note ?? null]);
    keys.push(key);
  }
  return keys;
}

// Marks an order paid and attaches a new key. Safe to call twice (PayHere can retry).
async function fulfil(orderId: string, paymentRef: string) {
  const [order] = await q("SELECT * FROM mirra_orders WHERE id=$1", [orderId]);
  if (!order) throw new HttpError(404, "Order not found.");
  if (order.status === "paid") return order.license_key as string;
  const [key] = await createKeys(order.plan, 1, { orderId, note: `Order ${orderId}` });
  const done = await q(
    "UPDATE mirra_orders SET status='paid', license_key=$2, payment_ref=$3, updated_at=now() WHERE id=$1 AND status<>'paid' RETURNING id",
    [orderId, key, paymentRef],
  );
  if (!done.length) { // someone else fulfilled it first
    await q("DELETE FROM mirra_keys WHERE key=$1", [key]);
    const [o] = await q("SELECT license_key FROM mirra_orders WHERE id=$1", [orderId]);
    return o.license_key as string;
  }
  await sendMail(order.email, `Your MIRRA Premium key — order ${orderId}`, keyEmail(order, key)).catch(() => {});
  return key;
}

// ---------- email (optional, via Resend) ----------
async function sendMail(to: string, subject: string, html: string) {
  const apiKey = env("RESEND_API_KEY"), from = env("MAIL_FROM");
  if (!apiKey || !from || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to, subject, html }),
  });
}
const esc = (s: string) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const orderLink = (o: any) => `${siteUrl()}/mirra/order?id=${o.id}&t=${o.token}`;
function keyEmail(o: any, key: string) {
  return `<div style="font-family:Arial,sans-serif;max-width:520px">
  <h2 style="color:#E10600">Thank you for buying MIRRA Premium</h2>
  <p>Hi ${esc(o.name)}, your payment for <b>${esc(mirraPlan(o.plan)?.name ?? o.plan)}</b> is confirmed.</p>
  <p>Your licence key:</p>
  <p style="font:700 20px monospace;background:#111;color:#fff;padding:14px 18px;border-radius:8px;letter-spacing:1px">${key}</p>
  <p>Open MIRRA → <b>Licence</b> → paste the key → <b>Activate</b>.</p>
  <p>Download MIRRA: <a href="${siteUrl()}/mirra">${siteUrl()}/mirra</a><br>Your order: <a href="${orderLink(o)}">${orderLink(o)}</a></p>
  <p style="color:#777;font-size:12px">ESYSTEMLK · Developed in Sri Lanka</p></div>`;
}

// ---------- PayHere ----------
function payhereConfig() {
  return {
    merchantId: env("PAYHERE_MERCHANT_ID"),
    secret: env("PAYHERE_MERCHANT_SECRET"),
    sandbox: env("PAYHERE_SANDBOX", "true") !== "false",
  };
}
export function payhereCheckout(o: any) {
  const ph = payhereConfig();
  if (!ph.merchantId || !ph.secret) return null;
  const amount = Number(o.amount).toFixed(2);
  const [first, ...rest] = String(o.name).split(/\s+/);
  return {
    action: ph.sandbox ? "https://sandbox.payhere.lk/pay/checkout" : "https://www.payhere.lk/pay/checkout",
    fields: {
      merchant_id: ph.merchantId,
      return_url: orderLink(o),
      cancel_url: orderLink(o),
      notify_url: `${siteUrl()}/api/mirra/payhere/notify`,
      order_id: o.id,
      items: mirraPlan(o.plan)?.name ?? "MIRRA Premium",
      currency: o.currency,
      amount,
      first_name: first || "Customer",
      last_name: rest.join(" ") || "-",
      email: o.email,
      phone: o.phone || "0000000000",
      address: "N/A",
      city: "Colombo",
      country: "Sri Lanka",
      hash: md5U(ph.merchantId + o.id + amount + o.currency + md5U(ph.secret)),
    },
  };
}
async function payhereNotify(b: any) {
  const ph = payhereConfig();
  const expected = md5U(str(b.merchant_id) + str(b.order_id) + str(b.payhere_amount) + str(b.payhere_currency) + str(b.status_code) + md5U(ph.secret));
  if (!ph.secret || !safeEq(expected, str(b.md5sig).toUpperCase()) || str(b.merchant_id) !== ph.merchantId) {
    return new Response("bad signature", { status: 400 });
  }
  const [order] = await q("SELECT * FROM mirra_orders WHERE id=$1", [str(b.order_id)]);
  if (!order) return new Response("unknown order", { status: 404 });
  const paidOk = str(b.status_code) === "2" && Number(b.payhere_amount) === Number(order.amount) && str(b.payhere_currency) === order.currency;
  if (paidOk) await fulfil(order.id, `payhere:${str(b.payment_id)}`);
  else if (order.status === "awaiting_payment") {
    await q("UPDATE mirra_orders SET admin_note=$2, updated_at=now() WHERE id=$1", [order.id, `PayHere status ${str(b.status_code)}`]);
  }
  return new Response("ok");
}

// ---------- admin session ----------
function adminSecret() {
  const s = env("MIRRA_ADMIN_SECRET") || env("MIRRA_SIGNING_KEY");
  if (!s) throw new HttpError(503, "Admin is not set up.");
  return crypto.createHash("sha256").update("mirra-admin|" + s).digest();
}
function adminCookie(req: Request) {
  const exp = Date.now() + 12 * 3600e3;
  const mac = crypto.createHmac("sha256", adminSecret()).update(String(exp)).digest("base64url");
  const secure = new URL(req.url).protocol === "https:" ? "; Secure" : "";
  return `mirra_admin=${exp}.${mac}; Path=/api/mirra; HttpOnly; SameSite=Strict; Max-Age=43200${secure}`;
}
function isAdmin(req: Request) {
  const m = /(?:^|;\s*)mirra_admin=(\d+)\.([\w-]+)/.exec(req.headers.get("cookie") || "");
  if (!m || Number(m[1]) < Date.now()) return false;
  const mac = crypto.createHmac("sha256", adminSecret()).update(m[1]).digest("base64url");
  return safeEq(mac, m[2]);
}

// ---------- public order view ----------
function publicOrder(o: any) {
  const plan = mirraPlan(o.plan);
  const bank = {
    bankName: env("BANK_NAME", "Bank name not set"),
    accountName: env("BANK_ACCOUNT_NAME", "ESYSTEMLK"),
    accountNumber: env("BANK_ACCOUNT_NUMBER", "Not set"),
    branch: env("BANK_BRANCH", ""),
  };
  return {
    id: o.id, plan: o.plan, planName: plan?.name ?? o.plan, amount: o.amount, currency: o.currency,
    name: o.name, email: o.email, method: o.method, status: o.status,
    hasSlip: !!o.has_slip, note: o.status === "rejected" ? o.admin_note : null,
    key: o.status === "paid" ? o.license_key : null,
    createdAt: iso(o.created_at),
    bank: o.status === "paid" ? null : bank,
    payhere: o.status === "awaiting_payment" ? payhereCheckout(o) : null,
  };
}
async function findOrder(id: string, token: string) {
  const [o] = await q("SELECT *, slip IS NOT NULL AS has_slip FROM mirra_orders WHERE id=$1", [str(id, 20)]);
  if (!o || !safeEq(o.token, str(token, 64))) throw new HttpError(404, "Order not found. Check the link in your email.");
  return o;
}

// ---------- router ----------
type Handler = (req: Request, url: URL) => Promise<Response>;

const routes: Record<string, Handler> = {
  // Public
  "GET plans": async () => json({ plans: MIRRA_PLANS, currency: MIRRA_CURRENCY, latest: latest() }),
  "GET latest": async () => json(latest()),
  "GET download": async () => Response.redirect(downloadUrl(), 302),

  "POST order": async (req) => {
    const b = await body(req);
    const plan = mirraPlan(str(b.plan));
    const name = str(b.name, 80), email = str(b.email, 120).toLowerCase(), phone = str(b.phone, 20);
    const method = b.method === "payhere" ? "payhere" : "bank";
    if (!plan) throw new HttpError(400, "Choose a plan.");
    if (name.length < 2) throw new HttpError(400, "Enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, "Enter a valid email address.");
    if (method === "payhere" && !payhereConfig().merchantId) throw new HttpError(503, "Card payments are not available yet. Please choose bank transfer.");
    const id = newOrderId(), token = crypto.randomBytes(18).toString("base64url");
    await q("INSERT INTO mirra_orders (id, token, plan, amount, currency, name, email, phone, method, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'awaiting_payment')",
      [id, token, plan.id, plan.price, MIRRA_CURRENCY, name, email, phone || null, method]);
    const o = await findOrder(id, token);
    return json({ id, token, url: `/mirra/order?id=${id}&t=${token}`, order: publicOrder(o) }, 201);
  },

  "GET order": async (_req, url) => json(publicOrder(await findOrder(url.searchParams.get("id") || "", url.searchParams.get("t") || ""))),

  "POST order/slip": async (req) => {
    const b = await body(req);
    const o = await findOrder(b.id, b.t);
    if (o.status === "paid") throw new HttpError(409, "This order is already paid.");
    const type = str(b.type, 40);
    if (!SLIP_TYPES.includes(type)) throw new HttpError(400, "Upload a photo (JPG, PNG, WEBP) or a PDF of the slip.");
    const data = Buffer.from(str(b.data, 6_000_000), "base64");
    if (!data.length) throw new HttpError(400, "The file is empty.");
    if (data.length > MAX_SLIP) throw new HttpError(413, "The slip must be smaller than 3 MB.");
    await q("UPDATE mirra_orders SET slip=$2, slip_type=$3, slip_name=$4, method='bank', status='pending_review', admin_note=NULL, updated_at=now() WHERE id=$1",
      [o.id, data, type, str(b.name, 120) || "slip"]);
    const adminEmail = env("ADMIN_EMAIL");
    if (adminEmail) await sendMail(adminEmail, `MIRRA bank slip to check — ${o.id}`, `<p>${esc(o.name)} (${esc(o.email)}) uploaded a slip for ${esc(mirraPlan(o.plan)?.name ?? o.plan)} — Rs ${o.amount}.</p><p><a href="${siteUrl()}/mirra/admin">Open the admin panel</a></p>`).catch(() => {});
    return json(publicOrder(await findOrder(o.id, o.token)));
  },

  "POST payhere/notify": async (req) => payhereNotify(await body(req)),

  // The PC app
  "POST activate": async (req) => {
    const b = await body(req);
    const key = str(b.key, 40).toUpperCase(), device = str(b.device, 64).toLowerCase();
    if (!KEY_RE.test(key)) throw new HttpError(400, "That doesn't look like a MIRRA key.");
    if (!DEVICE_RE.test(device)) throw new HttpError(400, "Bad device id.");
    if (b.product && b.product !== "MIRR") throw new HttpError(400, "This key is for another product.");
    const [k] = await q("SELECT * FROM mirra_keys WHERE key=$1", [key]);
    if (!k) throw new HttpError(404, "Key not found. Check it was typed correctly.");
    if (k.status !== "active") throw new HttpError(403, "This key has been disabled. Contact ESYSTEMLK support.");
    if (k.expires_at && new Date(k.expires_at).getTime() < Date.now()) throw new HttpError(403, "This key has expired. Buy a new key to keep Premium.");
    const [have] = await q("SELECT 1 FROM mirra_activations WHERE key=$1 AND device=$2", [key, device]);
    if (have) {
      await q("UPDATE mirra_activations SET last_at=now() WHERE key=$1 AND device=$2", [key, device]);
    } else {
      const [{ n }] = await q("SELECT count(*)::int AS n FROM mirra_activations WHERE key=$1", [key]);
      if (n >= k.max_devices) throw new HttpError(409, `This key is already active on ${n} PC${n > 1 ? "s" : ""}. Deactivate it there first (Licence → Deactivate), or contact support.`);
      await q("INSERT INTO mirra_activations (key, device) VALUES ($1,$2) ON CONFLICT DO NOTHING", [key, device]);
    }
    if (!k.activated_at) {
      const [u] = await q(
        "UPDATE mirra_keys SET activated_at=now(), expires_at=CASE WHEN duration_days IS NULL THEN NULL ELSE now() + make_interval(days => duration_days) END WHERE key=$1 AND activated_at IS NULL RETURNING expires_at",
        [key],
      );
      if (u) k.expires_at = u.expires_at;
      else k.expires_at = (await q("SELECT expires_at FROM mirra_keys WHERE key=$1", [key]))[0].expires_at;
    }
    const licence = signLicence({
      product: "MIRR", plan: mirraPlan(k.plan)?.name ?? k.plan, key, device,
      issuedAt: new Date().toISOString(), expiresAt: iso(k.expires_at),
    });
    return json({ licence });
  },

  "POST deactivate": async (req) => {
    const b = await body(req);
    await q("DELETE FROM mirra_activations WHERE key=$1 AND device=$2", [str(b.key, 40).toUpperCase(), str(b.device, 64).toLowerCase()]);
    return json({ ok: true });
  },

  // App start-up check: lets a disabled key or a reset device take effect.
  "POST check": async (req) => {
    const b = await body(req);
    const key = str(b.key, 40).toUpperCase(), device = str(b.device, 64).toLowerCase();
    const [k] = await q("SELECT status, expires_at FROM mirra_keys WHERE key=$1", [key]);
    if (!k) return json({ valid: false, reason: "Key not found." });
    if (k.status !== "active") return json({ valid: false, reason: "This key has been disabled." });
    const [a] = await q("SELECT 1 FROM mirra_activations WHERE key=$1 AND device=$2", [key, device]);
    if (!a) return json({ valid: false, reason: "This PC was removed from the key. Activate again." });
    await q("UPDATE mirra_activations SET last_at=now() WHERE key=$1 AND device=$2", [key, device]);
    return json({ valid: true, latest: latest() });
  },

  // Admin
  "POST admin/login": async (req) => {
    const b = await body(req);
    const pass = env("MIRRA_ADMIN_PASSWORD");
    if (!pass) throw new HttpError(503, "Set MIRRA_ADMIN_PASSWORD on the server first.");
    if (!safeEq(str(b.password, 200), pass)) {
      await new Promise((r) => setTimeout(r, 700));
      throw new HttpError(401, "Wrong password.");
    }
    return json({ ok: true }, 200, { "set-cookie": adminCookie(req) });
  },
  "POST admin/logout": async () => json({ ok: true }, 200, { "set-cookie": "mirra_admin=; Path=/api/mirra; HttpOnly; SameSite=Strict; Max-Age=0" }),
  "GET admin/me": async () => json({ ok: true }),

  "GET admin/stats": async () => {
    const [s] = await q(`SELECT
      (SELECT count(*)::int FROM mirra_orders WHERE status='pending_review') AS pending,
      (SELECT count(*)::int FROM mirra_orders WHERE status='paid') AS paid,
      (SELECT coalesce(sum(amount),0)::int FROM mirra_orders WHERE status='paid') AS revenue,
      (SELECT coalesce(sum(amount),0)::int FROM mirra_orders WHERE status='paid' AND updated_at > now() - interval '30 days') AS revenue30,
      (SELECT count(*)::int FROM mirra_keys WHERE status='active') AS keys,
      (SELECT count(*)::int FROM mirra_activations) AS activations,
      (SELECT count(*)::int FROM mirra_activations WHERE last_at > now() - interval '7 days') AS active7`);
    return json(s);
  },

  "GET admin/orders": async (_req, url) => {
    const status = url.searchParams.get("status") || "";
    const search = str(url.searchParams.get("q"), 80);
    const rows = await q(
      `SELECT id, plan, amount, currency, name, email, phone, method, status, slip_type, slip_name, slip IS NOT NULL AS has_slip,
              payment_ref, admin_note, license_key, created_at, updated_at
       FROM mirra_orders
       WHERE ($1 = '' OR status = $1) AND ($2 = '' OR id ILIKE '%'||$2||'%' OR email ILIKE '%'||$2||'%' OR name ILIKE '%'||$2||'%')
       ORDER BY (status='pending_review') DESC, created_at DESC LIMIT 200`,
      [status, search],
    );
    return json(rows.map((r) => ({ ...r, created_at: iso(r.created_at), updated_at: iso(r.updated_at) })));
  },

  "GET admin/slip": async (_req, url) => {
    const [o] = await q("SELECT slip, slip_type FROM mirra_orders WHERE id=$1", [str(url.searchParams.get("id"), 20)]);
    if (!o?.slip) throw new HttpError(404, "No slip uploaded.");
    return new Response(o.slip, {
      headers: {
        "content-type": SLIP_TYPES.includes(o.slip_type) ? o.slip_type : "application/octet-stream",
        "content-disposition": "inline", "x-content-type-options": "nosniff",
        "content-security-policy": "sandbox", "cache-control": "private, no-store",
      },
    });
  },

  "POST admin/orders/approve": async (req) => {
    const b = await body(req);
    const key = await fulfil(str(b.id, 20), "bank:approved");
    return json({ ok: true, key });
  },

  "POST admin/orders/reject": async (req) => {
    const b = await body(req);
    const note = str(b.note, 300) || "We couldn't confirm this payment.";
    const [o] = await q("UPDATE mirra_orders SET status='rejected', admin_note=$2, updated_at=now() WHERE id=$1 AND status<>'paid' RETURNING *", [str(b.id, 20), note]);
    if (!o) throw new HttpError(409, "Order not found or already paid.");
    await sendMail(o.email, `MIRRA order ${o.id} — payment not confirmed`, `<p>Hi ${esc(o.name)}, we couldn't confirm your bank transfer: ${esc(note)}</p><p>You can upload a new slip here: <a href="${orderLink(o)}">${orderLink(o)}</a></p>`).catch(() => {});
    return json({ ok: true });
  },

  "POST admin/keys/generate": async (req) => {
    const b = await body(req);
    const count = Math.max(1, Math.min(100, Number(b.count) || 1));
    const days = b.days === "" || b.days == null ? undefined : b.days === "lifetime" ? null : Math.max(1, Math.min(3650, Number(b.days)));
    const keys = await createKeys(str(b.plan), count, { note: str(b.note, 200) || null as any, devices: b.devices, days });
    return json({ keys });
  },

  "GET admin/keys": async (_req, url) => {
    const search = str(url.searchParams.get("q"), 80);
    const rows = await q(
      `SELECT k.*, (SELECT count(*)::int FROM mirra_activations a WHERE a.key=k.key) AS used,
              (SELECT max(last_at) FROM mirra_activations a WHERE a.key=k.key) AS last_seen, o.email
       FROM mirra_keys k LEFT JOIN mirra_orders o ON o.id = k.order_id
       WHERE $1 = '' OR k.key ILIKE '%'||$1||'%' OR k.note ILIKE '%'||$1||'%' OR o.email ILIKE '%'||$1||'%'
       ORDER BY k.created_at DESC LIMIT 300`,
      [search],
    );
    return json(rows.map((r) => ({ ...r, created_at: iso(r.created_at), activated_at: iso(r.activated_at), expires_at: iso(r.expires_at), last_seen: iso(r.last_seen) })));
  },

  "GET admin/keys.csv": async () => {
    const rows = await q("SELECT k.key, k.plan, k.status, k.max_devices, k.note, k.created_at, k.activated_at, k.expires_at, o.email FROM mirra_keys k LEFT JOIN mirra_orders o ON o.id=k.order_id ORDER BY k.created_at DESC");
    const cell = (v: any) => `"${String(v instanceof Date ? v.toISOString() : v ?? "").replace(/"/g, '""')}"`;
    const csv = ["key,plan,status,devices,note,created,activated,expires,email", ...rows.map((r) => [r.key, r.plan, r.status, r.max_devices, r.note, r.created_at, r.activated_at, r.expires_at, r.email].map(cell).join(","))].join("\n");
    return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="mirra-keys.csv"', "cache-control": "no-store" } });
  },

  "POST admin/keys/revoke": async (req) => keyStatus(req, "revoked"),
  "POST admin/keys/restore": async (req) => keyStatus(req, "active"),
  "POST admin/keys/reset": async (req) => {
    const b = await body(req);
    await q("DELETE FROM mirra_activations WHERE key=$1", [str(b.key, 40)]);
    return json({ ok: true });
  },
};

async function keyStatus(req: Request, status: string) {
  const b = await body(req);
  const r = await q("UPDATE mirra_keys SET status=$2 WHERE key=$1 RETURNING key", [str(b.key, 40), status]);
  if (!r.length) throw new HttpError(404, "Key not found.");
  return json({ ok: true });
}

function latest() {
  return { version: MIRRA_VERSION, url: `${siteUrl()}/api/mirra/download`, notes: "Smoother Wi-Fi mirroring, online activation and a new loading screen." };
}

export async function handleMirraApi(req: Request, path: string): Promise<Response> {
  const url = new URL(req.url);
  const route = routes[`${req.method} ${path.replace(/^\/+|\/+$/g, "")}`];
  try {
    if (!route) throw new HttpError(404, "Not found.");
    if (path.startsWith("admin/") && path !== "admin/login") {
      if (!isAdmin(req)) throw new HttpError(401, "Please log in.");
      // Admin writes must be JSON (with SameSite=Strict cookies this blocks cross-site form posts).
      if (req.method === "POST" && !(req.headers.get("content-type") || "").includes("application/json")) throw new HttpError(415, "JSON required.");
    }
    return await route(req, url);
  } catch (e: any) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    console.error("[mirra]", e);
    return json({ error: "Server error. Please try again." }, 500);
  }
}
