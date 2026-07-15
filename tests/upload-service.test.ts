import { describe, expect, it } from "vitest";

import { MAX_PFX_SIZE_BYTES } from "@/lib/validations/certificados";
import { CertificateUploadError, isPfxUploadFile, registerCertificateUpload } from "@/lib/certificados/upload-service";

const clientData = {
  nome_razao_social: "Cliente Teste",
};

function input(buffer: Buffer, fileName = "certificado.pfx") {
  return {
    admin: {} as never,
    userId: "00000000-0000-0000-0000-000000000001",
    ip: null,
    fileName,
    buffer,
    password: "senha",
    clientData,
  };
}

describe("upload PFX", () => {
  it("aceita somente arquivo .pfx nao vazio com assinatura ASN.1", () => {
    expect(isPfxUploadFile("certificado.pfx", Buffer.from([0x30, 0x82]))).toBe(true);
    expect(isPfxUploadFile("certificado.txt", Buffer.from([0x30, 0x82]))).toBe(false);
    expect(isPfxUploadFile("certificado.pfx", Buffer.from([0x31, 0x82]))).toBe(false);
    expect(isPfxUploadFile("certificado.pfx", Buffer.alloc(0))).toBe(false);
  });

  it("falha antes de banco/storage quando arquivo esta vazio", async () => {
    await expect(registerCertificateUpload(input(Buffer.alloc(0)))).rejects.toMatchObject({
      status: 400,
      code: "arquivo_vazio",
    } satisfies Partial<CertificateUploadError>);
  });

  it("falha antes de banco/storage quando arquivo excede limite", async () => {
    await expect(registerCertificateUpload(input(Buffer.alloc(MAX_PFX_SIZE_BYTES + 1)))).rejects.toMatchObject({
      status: 413,
      code: "arquivo_muito_grande",
    } satisfies Partial<CertificateUploadError>);
  });

  it("falha com mensagem generica para arquivo que nao parece PFX", async () => {
    await expect(registerCertificateUpload(input(Buffer.from("not a pfx")))).rejects.toMatchObject({
      status: 400,
      code: "pfx_invalido",
      message: "Senha incorreta ou certificado inválido.",
    } satisfies Partial<CertificateUploadError>);
  });
});
