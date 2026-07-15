import { describe, expect, it } from "vitest";

import { CERTIFICATE_STATUS_LABEL } from "@/lib/certificados/status-labels";
import { formatCertificateTitle, formatDisplayName, formatRelativeExpiration } from "@/lib/utils/format";

describe("UX formatting helpers", () => {
  it("normaliza nomes importados sem alterar o dado persistido", () => {
    expect(formatDisplayName("123456789 Cliente_Teste senha 123456 (2)")).toBe("Cliente Teste");
    expect(formatDisplayName("Empresa Exemplo")).toBe("Empresa Exemplo");
    expect(formatDisplayName(null)).toBe("-");
  });

  it("remove CNPJ redundante do título do certificado", () => {
    expect(formatCertificateTitle("Cliente Exemplo - 11222333000181", "11222333000181")).toBe("Cliente Exemplo");
    expect(formatCertificateTitle("Cliente Exemplo - 11.222.333/0001-81", "11222333000181")).toBe("Cliente Exemplo");
  });

  it("descreve vencimento em linguagem operacional", () => {
    expect(formatRelativeExpiration(-3)).toBe("Vencido há 3 dias");
    expect(formatRelativeExpiration(0)).toBe("Vence hoje");
    expect(formatRelativeExpiration(1)).toBe("Vence amanhã");
    expect(formatRelativeExpiration(7)).toBe("Vence em 7 dias");
  });

  it("mantém labels de status em português correto", () => {
    expect(CERTIFICATE_STATUS_LABEL).toMatchObject({
      ativo: "Válido",
      vencendo: "Vence em breve",
      vencido: "Vencido",
      invalido: "Inválido",
    });
  });
});
