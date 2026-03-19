import crypto from "node:crypto";

export type BadgePayload = {
  v: 1;
  id: string;
  alias: string;
  claim: string;
  evidence: string;
  issuedAt: string;
};

const SIGNING_SECRET = "niko_kadi_ke_26";

function toBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string) {
  return crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(encodedPayload)
    .digest("base64url");
}

export function createBadgeToken(payload: BadgePayload) {
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyBadgeToken(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return { valid: false as const };
  }

  const expected = signPayload(encodedPayload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return { valid: false as const };
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as BadgePayload;

    if (payload.v !== 1 || !payload.id || !payload.alias || !payload.claim) {
      return { valid: false as const };
    }

    return { valid: true as const, payload };
  } catch {
    return { valid: false as const };
  }
}

export function summarizeEvidence(text: string) {
  const normalized = text.toLowerCase();
  const keywords = ["iebc", "verify", "voter", "registered", "kadi", "ballot"];
  const matches = keywords.filter((word) => normalized.includes(word));

  return {
    matches,
    score: matches.length,
  };
}
