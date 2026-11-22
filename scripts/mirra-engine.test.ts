// End-to-end test of the MIRRA licence engine against an in-memory Postgres (PGlite).
//   node scripts/run-mirra-test.mjs   (bundles this file with esbuild, then runs it)
import crypto from "node:crypto";
import fs from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { setMirraDb } from "../src/lib/mirra/db.server";
import { handleMirraApi } from "../src/lib/mirra/engine.server";

const PRIV = process.env.MIRRA_TEST_PRIVATE_KEY_FILE!;
const PUB = process.env.MIRRA_TEST_PUBLIC_KEY_FILE!;
Object.assign(process.env, {
  MIRRA_SIGNING_KEY: fs.readFileSync(PRIV, "utf8"),
  MIRRA_ADMIN_PASSWORD: "test-admin-pass",
  PAYHERE_MERCHANT_ID: "1211149",
  PAYHERE_MERCHANT_SECRET: "test-secret",
  BANK_NAME: "Test Bank", BANK_ACCOUNT_NUMBER: "123456789",
  SITE_URL: "https://www.esystemlk.com",
});

let pass = 0, fail = 0;
const ok = (cond: unknown, name: string, extra?: unknown) => {
  if (cond) { pass++; console.log("  ✔", name); } else { fail++; console.log("  ✘", name, extra ?? ""); }
};
let cookie = "";
async function call(method: string, path: string, data?: any, form = false) {
  const headers: Record<string, string> = {};
  if (cookie) headers.cookie = cookie;
  let bodyStr: string | undefined;
  if (data !== undefined) {
    headers["content-type"] = form ? "application/x-www-form-urlencoded" : "application/json";
    bodyStr = form ? new URLSearchParams(data).toString() : JSON.stringify(data);
  }
  const res = await handleMirraApi(new Request(`https://www.esystemlk.com/api/mirra/${path}`, { method, headers, body: bodyStr }), path.split("?")[0]);
  const sc = res.headers.get("set-cookie");
  if (sc) cookie = sc.split(";")[0];
  const type = res.headers.get("content-type") || "";
  return { status: res.status, body: type.includes("json") ? await res.json() : await res.text(), res };
}
const verify = (lic: any) => crypto.verify(null, Buffer.from(JSON.stringify(lic.payload)), crypto.createPublicKey(fs.readFileSync(PUB)), Buffer.from(lic.sig, "base64"));
const md5U = (s: string) => crypto.createHash("md5").update(s).digest("hex").toUpperCase();
const devA = "a".repeat(32), devB = "b".repeat(32), devC = "c".repeat(32);

(async () => {
  const pg = new PGlite();
  setMirraDb({ query: (t, p) => pg.query(t, p as any[]), exec: (t) => pg.exec(t) });

  console.log("Public");
  const plans = await call("GET", "plans");
  ok(plans.status === 200 && plans.body.plans.length === 3, "plans listed");
  const dl = await call("GET", "download");
  ok(dl.status === 302 && /MIRRA-Setup-1\.2\.0\.exe/.test(dl.res.headers.get("location") || ""), "download redirects to installer");

  console.log("Bank transfer order");
  const bad = await call("POST", "order", { plan: "yearly", name: "A", email: "x" });
  ok(bad.status === 400, "rejects bad input");
  const ord = await call("POST", "order", { plan: "yearly", name: "Nimal Perera", email: "nimal@example.com", phone: "0771234567", method: "bank" });
  ok(ord.status === 201 && ord.body.order.amount === 9900 && ord.body.order.bank.accountNumber === "123456789", "order created with bank details", ord.body);
  const { id, token } = ord.body;
  ok((await call("GET", `order?id=${id}&t=wrong`)).status === 404, "wrong order token refused");
  const slipBad = await call("POST", "order/slip", { id, t: token, type: "text/html", data: Buffer.from("<b>x").toString("base64") });
  ok(slipBad.status === 400, "slip of wrong type refused");
  const png = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");
  const slip = await call("POST", "order/slip", { id, t: token, type: "image/png", name: "slip.png", data: png.toString("base64") });
  ok(slip.status === 200 && slip.body.status === "pending_review", "slip uploaded → pending review");

  console.log("Admin");
  ok((await call("GET", "admin/orders")).status === 401, "admin needs login");
  ok((await call("POST", "admin/login", { password: "nope" })).status === 401, "wrong password refused");
  ok((await call("POST", "admin/login", { password: "test-admin-pass" })).status === 200 && cookie.startsWith("mirra_admin="), "admin login sets session");
  const list = await call("GET", "admin/orders?status=pending_review");
  ok(list.body.length === 1 && list.body[0].id === id && list.body[0].has_slip, "pending order listed");
  const slipView = await call("GET", `admin/slip?id=${id}`);
  ok(slipView.status === 200 && slipView.res.headers.get("content-type") === "image/png", "slip viewable");
  const formPost = await call("POST", "admin/orders/approve", { id }, true);
  ok(formPost.status === 415, "admin form posts (CSRF) refused");
  const appr = await call("POST", "admin/orders/approve", { id });
  ok(appr.status === 200 && /^MIRR-/.test(appr.body.key), "approve issues key", appr.body);
  const appr2 = await call("POST", "admin/orders/approve", { id });
  ok(appr2.body.key === appr.body.key, "approving twice keeps the same key");
  const view = await call("GET", `order?id=${id}&t=${token}`);
  ok(view.body.status === "paid" && view.body.key === appr.body.key, "customer sees key on order page");
  const key = appr.body.key;

  console.log("Activation");
  const adminCookie = cookie; cookie = "";
  const act = await call("POST", "activate", { key, device: devA, product: "MIRR" });
  ok(act.status === 200 && verify(act.body.licence), "activation returns a licence the app can verify", act.body);
  const exp = Date.parse(act.body.licence.payload.expiresAt);
  ok(Math.abs(exp - (Date.now() + 365 * 864e5)) < 120e3, "yearly licence expires in 365 days");
  ok(act.body.licence.payload.device === devA && act.body.licence.payload.plan === "Premium Yearly", "licence bound to the PC");
  ok((await call("POST", "activate", { key, device: devA })).status === 200, "re-activating same PC works");
  const second = await call("POST", "activate", { key, device: devB });
  ok(second.status === 409, "second PC refused on 1-device key", second.body);
  ok((await call("POST", "check", { key, device: devA })).body.valid === true, "check: valid");
  await call("POST", "deactivate", { key, device: devA });
  ok((await call("POST", "activate", { key, device: devB })).status === 200, "after deactivate, another PC can activate");
  ok((await call("POST", "activate", { key: "MIRR-AAAA-AAAA-AAAA-AAAA", device: devA })).status === 404, "unknown key refused");

  console.log("Admin key tools");
  cookie = adminCookie;
  const gen = await call("POST", "admin/keys/generate", { plan: "lifetime", count: 3, note: "giveaway" });
  ok(gen.body.keys?.length === 3, "generate 3 lifetime keys");
  const lk = gen.body.keys[0];
  await call("POST", "admin/keys/revoke", { key });
  cookie = "";
  ok((await call("POST", "check", { key, device: devB })).body.valid === false, "revoked key fails check");
  ok((await call("POST", "activate", { key, device: devB })).status === 403, "revoked key can't activate");
  const l1 = await call("POST", "activate", { key: lk, device: devA });
  const l2 = await call("POST", "activate", { key: lk, device: devB });
  const l3 = await call("POST", "activate", { key: lk, device: devC });
  ok(l1.status === 200 && l2.status === 200 && l3.status === 409 && l1.body.licence.payload.expiresAt === null, "lifetime: 2 PCs, never expires");
  cookie = adminCookie;
  await call("POST", "admin/keys/reset", { key: lk });
  cookie = "";
  ok((await call("POST", "activate", { key: lk, device: devC })).status === 200, "reset devices frees the slots");
  cookie = adminCookie;
  const keys = await call("GET", "admin/keys?q=giveaway");
  ok(keys.body.length === 3, "search keys by note");
  const stats = await call("GET", "admin/stats");
  ok(stats.body.paid === 1 && stats.body.revenue === 9900, "stats count paid orders", stats.body);
  const csv = await call("GET", "admin/keys.csv");
  ok(typeof csv.body === "string" && csv.body.split("\n").length === 5, "CSV export");

  console.log("PayHere");
  cookie = "";
  const po = await call("POST", "order", { plan: "monthly", name: "Kamal Silva", email: "kamal@example.com", method: "payhere" });
  const ph = po.body.order.payhere;
  ok(ph && ph.action.includes("sandbox.payhere.lk") && ph.fields.amount === "1500.00", "PayHere checkout fields built");
  ok(ph.fields.hash === md5U("1211149" + po.body.id + "1500.00" + "LKR" + md5U("test-secret")), "PayHere hash correct");
  const notify = (status: string, amount: string, sig?: string) => {
    const f: any = { merchant_id: "1211149", order_id: po.body.id, payment_id: "320025071278", payhere_amount: amount, payhere_currency: "LKR", status_code: status };
    f.md5sig = sig ?? md5U(f.merchant_id + f.order_id + f.payhere_amount + f.payhere_currency + f.status_code + md5U("test-secret"));
    return call("POST", "payhere/notify", f, true);
  };
  ok((await notify("2", "1500.00", "BAD")).status === 400, "forged notify refused");
  await notify("2", "15.00");
  ok((await call("GET", `order?id=${po.body.id}&t=${po.body.token}`)).body.status === "awaiting_payment", "wrong amount doesn't pay the order");
  ok((await notify("2", "1500.00")).status === 200, "valid notify accepted");
  await notify("2", "1500.00");
  const paid = await call("GET", `order?id=${po.body.id}&t=${po.body.token}`);
  ok(paid.body.status === "paid" && /^MIRR-/.test(paid.body.key), "PayHere order paid with key");
  cookie = adminCookie;
  ok((await call("GET", "admin/keys")).body.filter((k: any) => k.order_id === po.body.id).length === 1, "duplicate notify made only one key");

  console.log(`\n${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
