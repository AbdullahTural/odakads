/**
 * Next.js static export ciktisini (out/) ASP.NET wwwroot'a kopyalar.
 * Kullanim: npm run copy:wwwroot  (once npm run build:static)
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(repoRoot, "out");
const wwwroot = join(repoRoot, "backend", "src", "API", "wwwroot");
const wwwrootWebConfig = join(repoRoot, "scripts", "wwwroot.web.config");

if (!existsSync(outDir)) {
  console.error(
    "[copy:wwwroot] Hata: out/ bulunamadi. Once 'npm run build:static' calistirin.",
  );
  process.exit(1);
}

if (!existsSync(wwwroot)) {
  mkdirSync(wwwroot, { recursive: true });
}

for (const entry of readdirSync(wwwroot)) {
  if (entry === ".gitkeep") continue;
  rmSync(join(wwwroot, entry), { recursive: true, force: true });
}

function copyTree(source, target) {
  if (process.platform === "win32") {
    const result = spawnSync(
      `robocopy "${source}" "${target}" /E /NFL /NDL /NJH /NJS /NC /NS`,
      { stdio: "inherit", shell: true },
    );
    const code = result.status ?? 1;
    // robocopy: 0-7 basari, >=8 hata
    if (code >= 8) {
      console.error(`[copy:wwwroot] robocopy hata kodu: ${code}`);
      process.exit(code);
    }
    return;
  }

  for (const entry of readdirSync(source)) {
    cpSync(join(source, entry), join(target, entry), {
      recursive: true,
      force: true,
    });
  }
}

copyTree(outDir, wwwroot);

if (existsSync(wwwrootWebConfig)) {
  cpSync(wwwrootWebConfig, join(wwwroot, "web.config"));
  console.log("[copy:wwwroot] web.config → wwwroot/web.config");
}

console.log(`[copy:wwwroot] Tamam: out/ -> backend/src/API/wwwroot/`);
