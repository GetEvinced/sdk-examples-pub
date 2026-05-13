import { readFileSync } from "node:fs";

const REQUIRED = ["signature", "url", "selector", "ruleId", "severity"];

export function loadIssues(filePath) {
  const raw = readFileSync(filePath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`loadIssues: ${filePath} is not valid JSON: ${e.message}`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`loadIssues: top-level value in ${filePath} is not an array`);
  }
  for (const [i, issue] of parsed.entries()) {
    for (const field of REQUIRED) {
      if (issue[field] === undefined || issue[field] === null || issue[field] === "") {
        throw new Error(`loadIssues: issue[${i}] missing required field "${field}"`);
      }
    }
  }
  return parsed;
}
