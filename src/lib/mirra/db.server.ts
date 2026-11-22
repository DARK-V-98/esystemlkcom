// MIRRA store database (Postgres). Production uses DATABASE_URL (e.g. Neon from the
// Vercel Marketplace). Tests inject an in-process Postgres with setMirraDb().
import pg from "pg";

export type MirraDb = {
  query: (text: string, params?: unknown[]) => Promise<{ rows: any[] }>;
  exec: (text: string) => Promise<unknown>;
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS mirra_orders (
  id          TEXT PRIMARY KEY,
  token       TEXT NOT NULL,
  plan        TEXT NOT NULL,
  amount      INTEGER NOT NULL,
  currency    TEXT NOT NULL,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  method      TEXT NOT NULL,
  status      TEXT NOT NULL,
  slip        BYTEA,
  slip_type   TEXT,
  slip_name   TEXT,
  payment_ref TEXT,
  admin_note  TEXT,
  license_key TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mirra_orders_status_idx ON mirra_orders (status, created_at DESC);
CREATE TABLE IF NOT EXISTS mirra_keys (
  key           TEXT PRIMARY KEY,
  plan          TEXT NOT NULL,
  max_devices   INTEGER NOT NULL DEFAULT 1,
  duration_days INTEGER,
  status        TEXT NOT NULL DEFAULT 'active',
  order_id      TEXT,
  note          TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  activated_at  TIMESTAMPTZ,
  expires_at    TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS mirra_activations (
  key      TEXT NOT NULL REFERENCES mirra_keys(key) ON DELETE CASCADE,
  device   TEXT NOT NULL,
  first_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (key, device)
);
`;

let ready: Promise<MirraDb> | null = null;

async function init(db: MirraDb) {
  await db.exec(SCHEMA);
  return db;
}

export function setMirraDb(db: MirraDb) {
  ready = init(db);
}

// Local development only: an in-process Postgres saved in .mirra-dev-db/ (never used on Vercel,
// and the import name is a variable so the production bundle doesn't include it).
async function devDb(): Promise<MirraDb> {
  const name = "@electric-sql/pglite";
  const { PGlite } = await import(/* @vite-ignore */ name);
  const pg = new PGlite(".mirra-dev-db");
  return { query: (t, p) => pg.query(t, p as any[]), exec: (t) => pg.exec(t) };
}

function getDb(): Promise<MirraDb> {
  if (!ready) {
    const url = process.env.DATABASE_URL;
    if (!url && !process.env.VERCEL && process.env.NODE_ENV !== "production") {
      ready = devDb().then(init);
      return ready;
    }
    if (!url) throw new Error("DATABASE_URL is not set");
    const pool = new pg.Pool({
      connectionString: url,
      max: 3,
      ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: false },
    });
    const db: MirraDb = { query: (t, p) => pool.query(t, p as any[]), exec: (t) => pool.query(t) };
    ready = init(db).catch((e) => {
      ready = null;
      throw e;
    });
  }
  return ready;
}

export async function q<T = any>(text: string, params: unknown[] = []): Promise<T[]> {
  return (await (await getDb()).query(text, params)).rows as T[];
}
