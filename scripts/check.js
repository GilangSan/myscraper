#!/usr/bin/env node
// Syntax-check every scraper under src/ (no dependencies required).
// Usage: node scripts/check.js  /  npm run check

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const ROOT = path.join(__dirname, "..", "src");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".js")) out.push(full);
  }
  return out;
}

const files = walk(ROOT).sort();
let failed = 0;

for (const file of files) {
  const rel = path.relative(path.join(__dirname, ".."), file);
  try {
    // Compile-only: catches syntax errors without executing require().
    new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
    console.log(`  ok   ${rel}`);
  } catch (err) {
    failed++;
    console.error(`  FAIL ${rel}\n       ${err.message}`);
  }
}

console.log(`\n${files.length - failed}/${files.length} files parse cleanly.`);
process.exit(failed ? 1 : 0);
