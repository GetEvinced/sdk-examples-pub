import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadIssues } from "./loadIssues.mjs";

const VALID_ISSUE = {
  signature: "abc123",
  url: "https://demo-fe-orpin.vercel.app/",
  selector: "button.cta",
  ruleId: "color-contrast",
  severity: "critical"
};

function fixture(payload) {
  const dir = mkdtempSync(join(tmpdir(), "load-"));
  const file = join(dir, "issues.json");
  writeFileSync(file, JSON.stringify(payload));
  return { dir, file };
}

test("loads a valid issues array", () => {
  const { dir, file } = fixture([VALID_ISSUE]);
  try {
    const issues = loadIssues(file);
    assert.equal(issues.length, 1);
    assert.equal(issues[0].signature, "abc123");
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("returns empty array for empty array input", () => {
  const { dir, file } = fixture([]);
  try {
    assert.deepEqual(loadIssues(file), []);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("throws when top level is not an array", () => {
  const { dir, file } = fixture({ not: "an array" });
  try {
    assert.throws(() => loadIssues(file), /array/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("throws when an issue is missing required fields", () => {
  const { dir, file } = fixture([{ url: "x", selector: "y" }]);
  try {
    assert.throws(() => loadIssues(file), /signature|ruleId|severity/);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});

test("throws when file does not exist", () => {
  assert.throws(() => loadIssues("/nonexistent.json"), /ENOENT|not found/i);
});
