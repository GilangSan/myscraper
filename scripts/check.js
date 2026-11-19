#!/usr/bin/env node
// Syntax-check every scraper under src/ (no dependencies required).
// Handles both CommonJS and ESM files.
// Usage: node scripts/check.js  /  npm run check

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..", "src");

// Heuristic: a top-level import/export means the file must be parsed as ESM.
const ESM_RE = /^\s*(?:import\s.+?from\s|import\s*["']|export\s)/m;

function checkCommonJS(src, filename) {
  new vm.Script(src, { filename });
}

async function checkESM(src, filename) {
  // node:vm has no module parser; write to a temp file and check via node --check.
  const { execFileSync } = require("node:child_process");
  const os = require("node:os");
  const tmp = path.join(os.tmpdir(), `chk-${process.pid}-${Date.now()}.mjs`);
  fs.writeFileSync(tmp, src);
  try {
    execFileSync(process.execPath, ["--check", tmp], { stdio: "pipe" });
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".js") || entry.name.endsWith(".mjs")) out.push(full);
  }
  return out;
}

const files = walk(ROOT).sort();
let failed = 0;

(async () => {
  for (const file of files) {
    const rel = path.relative(path.join(__dirname, ".."), file);
    const src = fs.readFileSync(file, "utf8");
    try {
      // Compile-only: catches syntax errors without executing require().
      if (file.endsWith(".mjs") || ESM_RE.test(src)) await checkESM(src, file);
      else checkCommonJS(src, file);
      console.log(`  ok   ${rel}`);
    } catch (err) {
      failed++;
      console.error(`  FAIL ${rel}\n       ${err.message}`);
    }
  }

  console.log(`\n${files.length - failed}/${files.length} files parse cleanly.`);
  process.exit(failed ? 1 : 0);
})();
