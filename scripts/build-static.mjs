/**
 * Production static export — .env.local'daki dev degerlerini ezmez.
 * Tek-host deploy: NEXT_PUBLIC_API_BASE_URL bos → istekler relatif /api/... yoluna gider.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

process.env.NODE_ENV = "production";
process.env.NEXT_PUBLIC_API_BASE_URL = "";
process.env.NEXT_PUBLIC_USE_MOCK = "false";
if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
  process.env.NEXT_PUBLIC_SITE_URL = "https://odakadsreklam.com";
}

function run(label, command, args) {
  console.log(`[build:static] ${label}...`);
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("SEO fetch", "npm", ["run", "fetch:seo"]);
run("next build", "npx", ["next", "build"]);

console.log("[build:static] Tamam.");
console.log(
  "  NEXT_PUBLIC_API_BASE_URL=(bos)  NEXT_PUBLIC_USE_MOCK=false  → relatif /api",
);
