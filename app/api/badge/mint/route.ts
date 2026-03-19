import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createBadgeToken, summarizeEvidence } from "../../../_lib/badge";

type MintBody = {
  alias?: string;
  claim?: string;
  evidence?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as MintBody | null;

  if (!body) {
    return NextResponse.json({ error: "Missing request body." }, { status: 400 });
  }

  const alias = body.alias?.trim();
  const claim = body.claim?.trim();
  const evidence = body.evidence?.trim() ?? "";

  if (!alias || !claim) {
    return NextResponse.json(
      { error: "Alias and claim are required." },
      { status: 400 },
    );
  }

  const insight = summarizeEvidence(evidence);
  const token = createBadgeToken({
    v: 1,
    id: crypto.randomUUID(),
    alias: alias.slice(0, 48),
    claim: claim.slice(0, 180),
    evidence: `score:${insight.score};matches:${insight.matches.join(",") || "none"}`,
    issuedAt: new Date().toISOString(),
  });

  return NextResponse.json({ token });
}
