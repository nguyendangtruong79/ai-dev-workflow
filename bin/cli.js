#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

function usage() {
  console.log(`Usage: ai-dev-workflow <cursor|claude> [target-dir] [--force] [--dry-run]

  cursor    copy Cursor rules, skills, agents, and commands
  claude    copy Claude Code rules, skills, agents, and commands
  --force   overwrite pack files (backs up first); never overwrites context/project/*
  --dry-run show what would be copied without writing

Examples:
  npx --allow-git=all github:nguyendangtruong79/ai-dev-workflow#<commit> claude
  npx @nguyendangtruong79/ai-dev-workflow cursor --force
`);
}

const args = process.argv.slice(2);
let tool = "";
let target = process.cwd();
let force = false;
let dryRun = false;

for (const arg of args) {
  if (arg === "cursor" || arg === "claude") {
    tool = arg;
  } else if (arg === "--force") {
    force = true;
  } else if (arg === "--dry-run") {
    dryRun = true;
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
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.isFile()) files.push(full);
  }
  return files;
}

function sha256File(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function isProtectedContext(rel) {
  const norm = rel.split(path.sep).join("/");
  return (
    norm === "context/ACTIVE.json" ||
    norm.startsWith("context/project/") ||
    norm.startsWith("context/features/") ||
    norm.startsWith("context/bugs/")
  );
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupRoot = path.join(target, `.ai-dev-workflow-backup-${stamp}`);
let copied = 0;
let skipped = 0;
let backedUp = 0;
const fileHashes = {};

const candidates = [];
for (const dir of [cfg, "context"]) {
  for (const file of walk(path.join(src, dir))) {
    const rel = path.relative(src, file);
    candidates.push({ file, rel });
  }
}

if (force && !dryRun) {
  for (const { rel } of candidates) {
    if (isProtectedContext(rel)) continue;
    const dest = path.join(target, rel);
    if (fs.existsSync(dest)) {
      const bak = path.join(backupRoot, rel);
      fs.mkdirSync(path.dirname(bak), { recursive: true });
      fs.copyFileSync(dest, bak);
      backedUp += 1;
    }
  }
  if (backedUp > 0) {
    console.log(`backup: ${backupRoot} (${backedUp} files)`);
  }
}

for (const { file, rel } of candidates) {
  const dest = path.join(target, rel);
  const protectedCtx = isProtectedContext(rel);
  const exists = fs.existsSync(dest);

  if (protectedCtx && exists) {
    console.log(`skip (project context): ${rel}`);
    skipped += 1;
    continue;
  }

  if (exists && !force && !protectedCtx) {
    console.log(`skip (exists): ${rel}`);
    skipped += 1;
    continue;
  }

  if (dryRun) {
    console.log(`${exists ? "overwrite" : "copy"}: ${rel}`);
    copied += 1;
    continue;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
  if (rel.startsWith(cfg + path.sep) || rel.startsWith(cfg + "/")) {
    fileHashes[rel.split(path.sep).join("/")] = sha256File(dest);
  }
  copied += 1;
}

if (!dryRun) {
  for (const dir of ["context/project", "context/features", "context/bugs", "context/metrics"]) {
    fs.mkdirSync(path.join(target, dir), { recursive: true });
  }

  const versionPath = path.join(target, "context", "workflow-version.json");
  const version = {
    package: pkg.name,
    version: pkg.version,
    tool,
    installedAt: new Date().toISOString(),
    forceApplied: force,
    backup: backedUp > 0 ? path.basename(backupRoot) : null,
    pinHint: `npx --allow-git=all github:nguyendangtruong79/ai-dev-workflow#<git-sha> ${tool}`,
    files: fileHashes
  };
  fs.writeFileSync(versionPath, JSON.stringify(version, null, 2) + "\n");
}

const app = tool === "cursor" ? "Cursor" : "Claude Code";
console.log(`
Installed AI dev workflow for ${tool} into ${target}
  version: ${pkg.version}
  copied: ${copied}, skipped: ${skipped}${dryRun ? " (dry-run)" : ""}

Next steps:
  1. Open the project in ${app}
  2. Run /onboard to generate context/project/
  3. Run /feature <your requirement> or /bugfix <bug description>
  4. Commit ${cfg}/ and context/ so your team shares the workflow
  5. Prefer pinning installs: npx --allow-git=all github:nguyendangtruong79/ai-dev-workflow#<commit> ${tool}
`);
