import Link from "next/link";

import { buttonClass, inputClass } from "@/components/ui/button-styles";
import { TableBody, TableCell, TableHead, TableHeaderCell, TableShell } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { PaginationBar } from "@/components/ui/pagination-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/status-badge";
import { createPaginationMeta, parsePagination } from "@/lib/pagination";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { formatCnpj, formatDateTimeShort, formatDisplayName, formatPhone } from "@/lib/utils/format";

type ClientesPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    pageSize?: string;
  }>;
};

function cleanSearch(value?: string) {
  return value?.trim().replace(/[%,()]/g, "") ?? "";
}

function optionalText(value: string | null | undefined) {
  return value?.trim() ? value : "-";
}

export default async function ClientesPage({ searchParams }: ClientesPageProps) {
  const params = await searchParams;
  const search = cleanSearch(params.q);
  const urlParams = new URLSearchParams();
  if (params.page) urlParams.set("page", params.page);
  if (params.pageSize) urlParams.set("pageSize", params.pageSize);
  const pagination = parsePagination(urlParams);
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from("clientes")
    .select("id, nome_razao_social, cnpj, email, telefone, whatsapp, whatsapp_notifications_enabled, responsavel, created_at, updated_at", {
      count: "exact",
    })
    .order("nome_razao_social", { ascending: true })
    .range(pagination.from, pagination.to);

  if (search) {
    const digits = search.replace(/\D/g, "");
    query =
      digits.length === 14
        ? query.eq("cnpj", digits)
        : query.or(`nome_razao_social.ilike.%${search}%,cnpj.ilike.%${digits || search}%`);
  }

  const { data: clientes, count } = await query;
  const paginationMeta = createPaginationMeta(count, pagination.page, pagination.pageSize);
  const hasSearch = Boolean(search);

  return (
    <section>
      <SectionHeader
        title="Clientes"
        description="Consulte os clientes vinculados aos certificados e seus dados de contato."
      />
      <FilterBar columns="md:grid-cols-[minmax(320px,1fr)_auto_auto]">
        <input
          type="search"
          name="q"
          defaultValue={search}
          placeholder="Buscar por razão social ou CNPJ"
          className={inputClass}
          aria-label="Buscar clientes"
        />
        <button type="submit" className={buttonClass("secondary", "h-10")}>
          Aplicar filtros
        </button>
        {hasSearch ? (
          <Link href="/clientes" className={buttonClass("ghost", "h-10")}>
            Limpar filtros
          </Link>
        ) : null}
      </FilterBar>

      {!clientes?.length ? (
        <EmptyState
          title={hasSearch ? "Nenhum resultado encontrado" : "Nenhum cliente encontrado"}
          description={
            hasSearch
              ? "Revise o termo pesquisado ou limpe os filtros."
              : "Os clientes são cadastrados manualmente ou durante o envio de certificados."
          }
        />
      ) : (
        <div className="grid gap-3">
          <div className="grid gap-3 md:hidden">
            {clientes.map((cliente) => (
              <article
                key={cliente.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5"
              >
                <h2 className="text-sm font-semibold leading-5 text-slate-950">{formatDisplayName(cliente.nome_razao_social)}</h2>
                <p className="mt-1 text-xs text-slate-500">{formatCnpj(cliente.cnpj)}</p>

                <dl className="mt-3 grid gap-2 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Contato</dt>
                    <dd className="mt-1 break-words text-slate-800">{optionalText(cliente.email)}</dd>
                    <dd className="mt-1 text-slate-800">{formatPhone(cliente.whatsapp ?? cliente.telefone)}</dd>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Avisos</dt>
                      <dd className="mt-1">
                        <Badge tone={cliente.whatsapp_notifications_enabled === false ? "slate" : "green"}>
                          {cliente.whatsapp_notifications_enabled === false ? "Desativados" : "Permitidos"}
                        </Badge>
                      </dd>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3">
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Responsável</dt>
                      <dd className="mt-1 text-slate-800">{optionalText(cliente.responsavel)}</dd>
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Atualizado em</dt>
                    <dd className="mt-1 text-slate-800">{formatDateTimeShort(cliente.updated_at)}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden md:block">
            <TableShell>
              <TableHead>
                <tr>
                  <TableHeaderCell>Cliente</TableHeaderCell>
                  <TableHeaderCell>Contato</TableHeaderCell>
                  <TableHeaderCell>Avisos</TableHeaderCell>
                  <TableHeaderCell>Responsável</TableHeaderCell>
                  <TableHeaderCell>Atualização</TableHeaderCell>
                </tr>
              </TableHead>
              <TableBody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="transition duration-150 hover:bg-slate-50">
                    <TableCell className="max-w-[420px]">
                      <p className="font-semibold text-slate-950">{formatDisplayName(cliente.nome_razao_social)}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatCnpj(cliente.cnpj)}</p>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      <p className="break-words">{optionalText(cliente.email)}</p>
                      <p className="mt-1 text-xs text-slate-500">{formatPhone(cliente.whatsapp ?? cliente.telefone)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge tone={cliente.whatsapp_notifications_enabled === false ? "slate" : "green"}>
                        {cliente.whatsapp_notifications_enabled === false ? "Desativados" : "Permitidos"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">{optionalText(cliente.responsavel)}</TableCell>
                    <TableCell className="text-slate-700">{formatDateTimeShort(cliente.updated_at)}</TableCell>
                  </tr>
                ))}
              </TableBody>
            </TableShell>
          </div>
          <PaginationBar
            basePath="/clientes"
            searchParams={{ q: search || undefined }}
            page={paginationMeta.page}
            pageSize={paginationMeta.pageSize}
            total={paginationMeta.total}
            totalPages={paginationMeta.totalPages}
            itemLabel="clientes"
          />
        </div>
      )}
    </section>
  );
}
