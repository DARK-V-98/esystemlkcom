# MIRRA on esystemlk.com — store, key engine and downloads

This document describes the new **MIRRA** section of esystemlk.com: what each page does, how customers buy keys (PayHere card payments or bank transfer), how the key engine issues and checks keys, how the MIRRA PC app talks to the website, and what must be set up before going live.

The code is on the `mirra-store` branch of this repository.

---

## 1. What's added to the website

| URL | Who | Purpose |
| --- | --- | --- |
| `/mirra` | Everyone | Product page: features, Free vs Premium, prices, download button, setup steps, FAQ |
| `/mirra/buy?plan=yearly` | Customers | Checkout: choose plan → name, email, phone → pay by card (PayHere) or bank transfer |
| `/mirra/order?id=…&t=…` | Customers | Private order page: pay, upload bank slip, see status, **get the key** |
| `/mirra/admin` | Owner only | Key engine: approve bank slips, create keys, search/disable/reset keys, sales stats, CSV export |
| `/api/mirra/*` | App + pages | The licence server API (section 5) |
| `/store` | Everyone | MIRRA is added to the Store and is now the featured product |
| Navbar | Everyone | New "MIRRA" link |

Files:

```
src/data/mirra.ts                 plans, prices, feature lists (shared by pages and server)
src/lib/mirra/engine.server.ts    key engine + API (server only)
src/lib/mirra/db.server.ts        Postgres tables
src/routes/api/mirra/$.ts         mounts the API at /api/mirra/*
src/routes/mirra/index.tsx        product page
src/routes/mirra/buy.tsx          checkout
src/routes/mirra/order.tsx        order / key page
src/routes/mirra/admin.tsx        admin panel
src/components/mirra/MirraUi.tsx  shared MIRRA UI pieces
public/mirra/icon.png             MIRRA logo
scripts/mirra-engine.test.ts      39 automated checks (npm run test:mirra)
```

---

## 2. Plans and prices

Edit `src/data/mirra.ts`. The server charges exactly these prices.

| Plan | Price | Length | PCs per key |
| --- | --- | --- | --- |
| Premium Monthly | Rs 1,500 | 30 days | 1 |
| Premium Yearly (featured) | Rs 9,900 | 365 days | 1 |
| Premium Lifetime | Rs 19,900 | Never expires | 2 |

- Days start counting when the key is **first activated**, not when it is bought, so customers don't lose time.
- **Free plan** (no key): 720p, 30 fps, 4 Mbps, small watermark. **Premium**: 1080p/2K/4K, up to 144 fps, 80 Mbps, no watermark, stream output window, recording, key mapping.

---

## 3. How customers buy

### A. Card / online (PayHere) — automatic
1. Customer picks a plan on `/mirra/buy`, enters name + email, chooses **Card / online**.
2. The website creates the order and sends the customer to PayHere's checkout (signed with your merchant secret).
3. PayHere calls `POST /api/mirra/payhere/notify` in the background. The server checks PayHere's `md5sig`, the amount and the currency, then marks the order **Paid** and creates a key.
4. PayHere returns the customer to their order page, which shows the key within seconds. The key is also emailed.

### B. Bank transfer — approved by you
1. Customer chooses **Bank transfer** → sees your bank details and an order reference (e.g. `MRXT8RD9MG`).
2. They transfer the money and upload a photo/screenshot/PDF of the slip (max 3 MB) on the order page.
3. The order appears in **Admin → Orders → Slips to check** (you're emailed if `ADMIN_EMAIL` is set).
4. You open the slip, check it against your bank account, and click **Approve** → a key is created, shown on the customer's order page and emailed to them. Or click **Reject** with a reason → the customer sees the reason and can upload a new slip.

### Order statuses
`Waiting for payment` → (`Checking your slip`) → `Paid` · or `Payment not confirmed` (rejected; customer can re-upload).

---

## 4. The key engine (admin panel, `/mirra/admin`)

Log in with `MIRRA_ADMIN_PASSWORD` (session lasts 12 hours).

- **Stats:** slips to check, paid orders, total revenue, last 30 days, active keys, PCs used in the last 7 days.
- **Orders:** filter (Slips to check / Not paid yet / Paid / Rejected / All), search by order, name or email, view slip, Approve, Reject.
- **Keys:** search by key, note or customer email; see PCs used, expiry and last seen; **Copy**, **Remove all PCs** (lets the customer move to a new PC), **Disable** (MIRRA goes back to Free on that key's PCs the next time the app starts online), **Enable**; **Export CSV**.
- **Create keys:** make 1–100 keys for any plan for cash sales, resellers, giveaways or replacements, with optional PCs-per-key, custom days and a note.

### Key format
`MIRR-XXXX-XXXX-XXXX-XXXX` using `A–Z` and `2–9` (no 0/O/1/I to avoid typos). That's 32¹⁶ possibilities, so keys can't be guessed.

---

## 5. App ↔ website contract

The MIRRA app (v1.2.0) talks to `https://www.esystemlk.com/api/mirra`.

| Call | Body | Answer |
| --- | --- | --- |
| `POST /activate` | `{ key, device, product: "MIRR" }` | `{ licence }`, or `{ error }` with 400 / 403 / 404 / 409 |
| `POST /deactivate` | `{ key, device }` | `{ ok: true }` — frees that PC's slot |
| `POST /check` | `{ key, device }` | `{ valid, reason?, latest? }` — app checks on start; disabled keys fall back to Free |
| `GET /latest` | — | `{ version, url, notes }` — the app shows "Update available" |
| `GET /download` | — | Redirects to the installer |

- `device` is a 32-character ID of the PC that the app works out by itself.
- The **licence** is `{ payload, sig }`. `payload = { product, plan, key, device, issuedAt, expiresAt }` and `sig` is an **Ed25519** signature made with `MIRRA_SIGNING_KEY`. The app only contains the public key, so licences can't be forged. It verifies offline, which means Premium keeps working without internet until `expiresAt`.
- Activation errors are shown to the user as-is, for example: "This key is already active on 1 PC. Deactivate it there first…".

---

## 6. Setup before going live

### 6.1 Database (Postgres)
In Vercel → project **esystemlkcom** → Storage / Marketplace → add **Neon Postgres** (free tier is enough) and connect it to the project. This sets `DATABASE_URL`. The tables (`mirra_orders`, `mirra_keys`, `mirra_activations`) are created automatically on first use.

### 6.2 Environment variables (Vercel → Settings → Environment Variables, Production)

| Name | Required | Value |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Set by Neon |
| `MIRRA_SIGNING_KEY` | Yes | Full contents of `E:\tools\mirra\tools\keys\private.pem`. **Secret, never share or commit it.** It must match the public key inside the app. |
| `MIRRA_ADMIN_PASSWORD` | Yes | A long password for `/mirra/admin` |
| `MIRRA_ADMIN_SECRET` | Recommended | Any long random text (signs admin sessions) |
| `SITE_URL` | Yes | `https://www.esystemlk.com` |
| `BANK_NAME`, `BANK_ACCOUNT_NAME`, `BANK_ACCOUNT_NUMBER`, `BANK_BRANCH` | Yes | Shown to bank-transfer customers |
| `PAYHERE_MERCHANT_ID`, `PAYHERE_MERCHANT_SECRET` | For card payments | From PayHere → Settings → Domains & Credentials (secret for `www.esystemlk.com`) |
| `PAYHERE_SANDBOX` | For card payments | `true` while testing, then `false` |
| `MIRRA_DOWNLOAD_URL` | Yes | Direct link to `MIRRA-Setup-1.2.0.exe` (see 6.4) |
| `RESEND_API_KEY`, `MAIL_FROM` | Recommended | Emails keys to customers (resend.com, verify esystemlk.com; e.g. `MIRRA <keys@esystemlk.com>`) |
| `ADMIN_EMAIL` | Optional | Where "new slip to check" alerts go |

If card payment isn't set up yet, customers see "Card payments are not available yet. Please choose bank transfer." Bank transfer works on its own.

### 6.3 PayHere
1. In PayHere add the domain `www.esystemlk.com` and wait for approval. The Terms, Privacy and Refund pages already exist.
2. Copy the **Merchant ID** and the **Merchant Secret for that domain** into the variables above.
3. The notify URL is sent automatically with each payment (`/api/mirra/payhere/notify`), so you don't enter it in PayHere.
4. Test with `PAYHERE_SANDBOX=true` using PayHere's sandbox test cards, then switch to `false`.

### 6.4 Hosting the installer
The installer (~100 MB) is too big to keep in the website repository. Put it on **GitHub Releases** (repo → Releases → New release → tag `mirra-v1.2.0` → attach `MIRRA-Setup-1.2.0.exe`). If `MIRRA_DOWNLOAD_URL` is not set, the website points to exactly that release file. Every download button uses `/api/mirra/download`, so later versions only need the variable changed.

### 6.5 Releasing a new MIRRA version later
1. Build the new installer, upload it, and update `MIRRA_DOWNLOAD_URL`.
2. Change `MIRRA_VERSION` in `src/data/mirra.ts` and deploy. Apps on older versions then show "Update available".

---

## 7. Security notes
- Prices are decided on the server, so changing a price in the browser has no effect.
- PayHere notifications are only accepted with a valid `md5sig`, the right merchant ID and the exact amount and currency. Repeated notifications never create a second key.
- Order pages need the secret token in the link, so customers can't see each other's orders.
- Bank slips are limited to PNG, JPG, WEBP or PDF up to 3 MB, stored in the database, and only visible to the admin. They're served with a sandbox policy.
- The admin session is an HttpOnly, SameSite=Strict signed cookie limited to `/api/mirra`. Admin actions require JSON requests, which blocks cross-site form attacks. Failed logins are slowed down.
- The private signing key exists only in Vercel and on the build PC (`tools/keys/`, which git ignores).

## 8. Launch checklist
- [ ] Neon Postgres connected (`DATABASE_URL`)
- [ ] `MIRRA_SIGNING_KEY`, `MIRRA_ADMIN_PASSWORD`, `MIRRA_ADMIN_SECRET`, `SITE_URL`, bank variables set
- [ ] Installer uploaded, `MIRRA_DOWNLOAD_URL` set
- [ ] Resend set up (or plan to send keys by hand at first)
- [ ] PayHere domain approved, credentials set, sandbox test passed, `PAYHERE_SANDBOX=false`
- [ ] Merge `mirra-store` → `main` (Vercel deploys)
- [ ] Test on the live site: buy by bank transfer → approve in admin → activate in the app
