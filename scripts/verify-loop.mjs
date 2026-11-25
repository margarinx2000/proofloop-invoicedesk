#!/usr/bin/env node
// verify-loop.mjs — the closed loop between the coding agent and Kane CLI.
//
//   agent writes code → this harness runs every Kane test in tests/
//   → Kane drives a real Chrome against the app and emits NDJSON
//   → this harness parses the NDJSON, writes an evidence pack to evidence/
//     and a human/agent-readable verdict to evidence/LATEST.md
//   → exit code 0 = verified, 1 = something failed (the agent reads
//     LATEST.md, fixes the code, and runs the loop again)
//
// Usage: npm run verify [-- --test invoice-total]
// Env:   KANE_BIN  path to the kane-cli binary (default: kane-cli on PATH,
//                  falling back to the workspace-local install)
//        PORT      app port (default 4173)

import { spawn } from "node:child_process";
import { mkdir, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = process.env.PORT || 4173;
const BASE = `http://localhost:${PORT}`;

const LOCAL_KANE = join(root, "..", "tools", "kane-cli", "node_modules", ".bin", "kane-cli");
const KANE_BIN = process.env.KANE_BIN || (existsSync(LOCAL_KANE) ? LOCAL_KANE : "kane-cli");

const onlyArg = process.argv.indexOf("--test");
const only = onlyArg >= 0 ? process.argv[onlyArg + 1] : null;

function run(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: root, ...opts });
    let out = "", err = "";
    child.stdout.on("data", (d) => { out += d; process.stdout.write(d); });
    child.stderr.on("data", (d) => { err += d; process.stderr.write(d); });
    child.on("close", (code) => resolve({ code, out, err }));
    child.on("error", (e) => resolve({ code: -1, out, err: String(e) }));
  });
}

async function healthy() {
  try {
    const r = await fetch(`${BASE}/health`);
    return r.ok;
  } catch { return false; }
}

async function ensureServer() {
  if (await healthy()) return null;
  const child = spawn("node", ["server.js"], { cwd: root, env: { ...process.env, PORT }, detached: true, stdio: "ignore" });
  child.unref();
  for (let i = 0; i < 30; i++) {
    if (await healthy()) return child;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("app server did not come up on " + BASE);
}

// Pull step-level verdicts out of Kane's NDJSON event stream. We stay
// deliberately schema-tolerant: any event carrying a step name plus a
// pass/fail-ish status counts; the raw stream is kept in the evidence pack.
function extractSteps(ndjson) {
  const steps = [];
  for (const line of ndjson.split("\n")) {
    const t = line.trim();
    if (!t.startsWith("{")) continue;
    let ev;
    try { ev = JSON.parse(t); } catch { continue; }
    const name = ev.step || ev.step_name || ev.name || ev.title;
    const status = String(ev.status || ev.result || ev.outcome || "").toLowerCase();
    if (name && /pass|fail|error|skip/.test(status)) steps.push({ name, status });
    if (ev.type && /step/.test(ev.type) && (ev.passed === true || ev.passed === false)) {
      steps.push({ name: name || ev.type, status: ev.passed ? "passed" : "failed" });
    }
  }
  return steps;
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const evDir = join(root, "evidence", stamp);
await mkdir(evDir, { recursive: true });
await ensureServer();

let testFiles = (await readdir(join(root, "tests"))).filter((f) => f.endsWith("_test.md")).sort();
if (only) testFiles = testFiles.filter((f) => f.includes(only));

const results = [];
for (const file of testFiles) {
  const name = basename(file, "_test.md");
  console.log(`\n=== Kane: ${file} ===`);
  const { code, out, err } = await run(KANE_BIN, ["testmd", "run", join("tests", file), "--agent"], { env: { ...process.env } });
  await writeFile(join(evDir, `${name}.ndjson`), out);
  if (err) await writeFile(join(evDir, `${name}.stderr.log`), err);
  results.push({ file, exit: code, steps: extractSteps(out) });
}

const allPass = results.every((r) => r.exit === 0);
const lines = [
  `# Verify loop — ${stamp}`,
  ``,
  `App: ${BASE} · Kane binary: ${KANE_BIN}`,
  `Overall: **${allPass ? "PASS — verified, safe to ship" : "FAIL — do not ship"}**`,
  ``,
];
for (const r of results) {
  lines.push(`## ${r.file} — exit ${r.exit} (${r.exit === 0 ? "PASS" : "FAIL"})`);
  if (r.steps.length) for (const s of r.steps) lines.push(`- ${s.status.toUpperCase()} — ${s.name}`);
  else lines.push(`- (step detail in the .ndjson evidence file)`);
  lines.push(``);
}
await writeFile(join(evDir, "LATEST.md"), lines.join("\n"));
await writeFile(join(root, "evidence", "LATEST.md"), lines.join("\n"));
console.log("\n" + lines.join("\n"));
process.exit(allPass ? 0 : 1);
