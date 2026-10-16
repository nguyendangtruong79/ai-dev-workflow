#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function usage() {
  console.log(`Usage: ai-dev-workflow <cursor|claude> [target-dir] [--force]

  cursor   copy Cursor rules, skills, agents, and commands
  claude   copy Claude Code rules, skills, agents, and commands
  --force  overwrite files that already exist

Examples:
  npx @nguyendangtruong79/ai-dev-workflow claude
  npx @nguyendangtruong79/ai-dev-workflow cursor ../other-app --force
`);
}

const args = process.argv.slice(2);
let tool = "";
let target = process.cwd();
let force = false;

for (const arg of args) {
  if (arg === "cursor" || arg === "claude") {
    tool = arg;
  } else if (arg === "--force") {
    force = true;
  } else if (arg === "-h" || arg === "--help") {
    usage();
    process.exit(0);
  } else if (arg.startsWith("-")) {
    console.error(`Unknown option: ${arg}`);
    usage();
    process.exit(1);
  } else {
    target = arg;
  }
}

if (!tool) {
  usage();
  process.exit(1);
}

target = path.resolve(target);
if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
  console.error(`Target directory not found: ${target}`);
  process.exit(1);
}
if (target === root) {
  console.error("Target must be your project, not this package.");
  process.exit(1);
}

const src = path.join(root, tool === "cursor" ? "cursor" : "claude-code");
const cfg = tool === "cursor" ? ".cursor" : ".claude";

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

let copied = 0;
let skipped = 0;
for (const dir of [cfg, "context"]) {
  for (const file of walk(path.join(src, dir))) {
    const rel = path.relative(src, file);
    const dest = path.join(target, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (fs.existsSync(dest) && !force) {
      console.log(`skip (exists): ${rel}`);
      skipped += 1;
    } else {
      fs.copyFileSync(file, dest);
      copied += 1;
    }
  }
}

for (const dir of ["context/project", "context/features", "context/bugs"]) {
  fs.mkdirSync(path.join(target, dir), { recursive: true });
}

const app = tool === "cursor" ? "Cursor" : "Claude Code";
console.log(`
Installed AI dev workflow for ${tool} into ${target}
  copied: ${copied}, skipped: ${skipped}

Next steps:
  1. Open the project in ${app}
  2. Run /onboard to generate context/project/
  3. Run /feature <your requirement> or /bugfix <bug description>
  4. Commit ${cfg}/ and context/ so your team shares the workflow
`);
