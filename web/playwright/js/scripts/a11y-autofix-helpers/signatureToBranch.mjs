export function signatureToBranch(signature, prefix) {
  if (!signature) throw new Error("signatureToBranch: signature is required");
  if (!prefix) throw new Error("signatureToBranch: prefix is required");
  const slug = String(signature)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${prefix}${slug}`;
}
