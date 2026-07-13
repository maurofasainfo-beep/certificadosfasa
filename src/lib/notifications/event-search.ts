import "server-only";

import type { createSupabaseAdminClient } from "@/lib/supabase/admin";

type AdminClient = ReturnType<typeof createSupabaseAdminClient>;

function cleanSearchValue(value: string) {
  return value.trim().replace(/[%,()]/g, "");
}

function buildTextSearchFilter(search: string) {
  const digits = search.replace(/\D/g, "");
  const text = cleanSearchValue(search);
  const phoneOrText = digits || text;

  return [
    `mensagem_renderizada.ilike.%${text}%`,
    `telefone_destino.ilike.%${phoneOrText}%`,
  ];
}

function buildInFilter(column: string, values: string[]) {
  const uniqueValues = Array.from(new Set(values)).filter(Boolean);

  if (uniqueValues.length === 0) {
    return null;
  }

  return `${column}.in.(${uniqueValues.join(",")})`;
}

export async function buildNotificationEventSearchFilter(admin: AdminClient, rawSearch: string) {
  const search = cleanSearchValue(rawSearch);

  if (!search) {
    return null;
  }

  const digits = search.replace(/\D/g, "");
  const [clientesResult, certificadosResult] = await Promise.all([
    digits.length === 14
      ? admin.from("clientes").select("id").eq("cnpj", digits).limit(100)
      : admin
          .from("clientes")
          .select("id")
          .or(`nome_razao_social.ilike.%${search}%,cnpj.ilike.%${digits || search}%`)
          .limit(100),
    digits.length === 14
      ? admin.from("certificados").select("id").eq("cnpj", digits).limit(100)
      : admin
          .from("certificados")
          .select("id")
          .or(`nome_titular.ilike.%${search}%,cnpj.ilike.%${digits || search}%`)
          .limit(100),
  ]);

  const filters = [
    ...buildTextSearchFilter(search),
    buildInFilter("cliente_id", (clientesResult.data ?? []).map((cliente) => cliente.id)),
    buildInFilter("certificado_id", (certificadosResult.data ?? []).map((certificado) => certificado.id)),
  ].filter((filter): filter is string => Boolean(filter));

  return filters.join(",");
}
