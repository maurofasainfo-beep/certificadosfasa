import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { createPublicDownloadToken, hashPublicDownloadToken } from "@/lib/download/token";
import { hashDownloadPassword, verifyDownloadPassword } from "@/lib/download/password";

describe("download publico", () => {
  it("gera token publico de alta entropia e salva apenas hash deterministico", () => {
    const token = createPublicDownloadToken();
    const hash = hashPublicDownloadToken(token);

    expect(token.length).toBeGreaterThanOrEqual(40);
    expect(hash).toHaveLength(64);
    expect(hash).toBe(hashPublicDownloadToken(token));
    expect(hash).not.toContain(token);
  });

  it("valida senha por scrypt e rejeita senha incorreta", async () => {
    const hash = await hashDownloadPassword("senha-correta-123");

    await expect(verifyDownloadPassword("senha-correta-123", hash)).resolves.toBe(true);
    await expect(verifyDownloadPassword("senha-errada-123", hash)).resolves.toBe(false);
    await expect(verifyDownloadPassword("senha-correta-123", "hash-invalido")).resolves.toBe(false);
  });

  it("rejeita corpo invalido antes de consultar service role", async () => {
    const { POST } = await import("@/app/api/download/[token]/validar/route");
    const request = new NextRequest("http://localhost/api/download/token/validar", {
      method: "POST",
      body: JSON.stringify({ senha_liberacao: "curta" }),
      headers: {
        "content-type": "application/json",
      },
    });

    const response = await POST(request, { params: Promise.resolve({ token: "token" }) });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe("senha_invalida");
  });
});
