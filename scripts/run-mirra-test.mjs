// Bundles the MIRRA engine test with esbuild (already installed with Vite) and runs it.
// Needs the Ed25519 key pair: MIRRA_TEST_PRIVATE_KEY_FILE and MIRRA_TEST_PUBLIC_KEY_FILE.
import { build } from "esbuild";
import { spawnSync } from "node:child_process";
import path from "node:path";

const out = path.join("node_modules", ".cache", "mirra-engine-test.mjs"); // inside the project so pg / pglite resolve
await build({
  entryPoints: ["scripts/mirra-engine.test.ts"],
  bundle: true, platform: "node", format: "esm", outfile: out,
  external: ["pg", "@electric-sql/pglite"],
  alias: { "@": "./src" },
  logLevel: "warning",
});
const r = spawnSync(process.execPath, [out], { stdio: "inherit", cwd: process.cwd(), env: process.env });
process.exit(r.status ?? 1);
