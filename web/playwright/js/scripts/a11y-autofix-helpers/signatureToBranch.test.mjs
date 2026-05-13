import test from "node:test";
import assert from "node:assert/strict";
import { signatureToBranch } from "./signatureToBranch.mjs";

test("prepends the configured prefix", () => {
  assert.equal(signatureToBranch("abc123", "a11y/fix-"), "a11y/fix-abc123");
});

test("lowercases and slugifies non-git-safe chars in signature", () => {
  assert.equal(
    signatureToBranch("Rule/Color Contrast::Button[1]", "a11y/fix-"),
    "a11y/fix-rule-color-contrast-button-1"
  );
});

test("collapses repeated separators and trims trailing dashes", () => {
  assert.equal(signatureToBranch("a__b--c--", "a11y/fix-"), "a11y/fix-a-b-c");
});

test("throws on empty signature", () => {
  assert.throws(() => signatureToBranch("", "a11y/fix-"), /signature/);
});

test("throws on missing prefix", () => {
  assert.throws(() => signatureToBranch("abc", ""), /prefix/);
});
