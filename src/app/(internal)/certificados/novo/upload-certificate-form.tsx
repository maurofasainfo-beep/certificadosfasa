"use client";

import { Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { buttonClass, inputClass, selectClass, textAreaClass } from "@/components/ui/button-styles";

type ClientOption = {
  id: string;
  nome_razao_social: string;
  cnpj: string;
  email: string | null;
  telefone: string | null;
  whatsapp: string | null;
  whatsapp_notifications_enabled?: boolean | null;
  responsavel: string | null;
  observacoes: string | null;
};

type UploadCertificateFormProps = {
  clients: ClientOption[];
  initialClientId?: string;
};

function getClientFormData(client?: ClientOption) {
  return {
    nome_razao_social: client?.nome_razao_social ?? "",
    cnpj_manual: client?.cnpj ?? "",
    email: client?.email ?? "",
    telefone: client?.telefone ?? "",
    whatsapp: client?.whatsapp ?? "",
    whatsapp_notifications_enabled: client?.whatsapp_notifications_enabled ?? true,
    responsavel: client?.responsavel ?? "",
    observacoes: client?.observacoes ?? "",
  };
}

export function UploadCertificateForm({ clients, initialClientId = "" }: UploadCertificateFormProps) {
  const router = useRouter();
  const initialClient = clients.find((client) => client.id === initialClientId);
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [manualClientId, setManualClientId] = useState(initialClient?.id ?? "");
  const [clientData, setClientData] = useState(getClientFormData(initialClient));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function patchClientData(patch: Partial<typeof clientData>) {
    setClientData((current) => ({ ...current, ...patch }));
  }

  function handleManualClientChange(clientId: string) {
    setManualClientId(clientId);
    const selectedClient = clients.find((client) => client.id === clientId);

    if (!selectedClient) {
      setClientData(getClientFormData());
      return;
    }

    setClientData(getClientFormData(selectedClient));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("Selecione um arquivo .pfx.");
      return;
    }

    const body = new FormData();
    body.set("arquivo", file);
    body.set("senha", password);
    body.set("cliente_id_manual", manualClientId);
    body.set("cnpj_manual", clientData.cnpj_manual);
    body.set("nome_razao_social", clientData.nome_razao_social);
    body.set("email", clientData.email);
    body.set("telefone", clientData.telefone);
    body.set("whatsapp", clientData.whatsapp);
    body.set("whatsapp_notifications_enabled", String(clientData.whatsapp_notifications_enabled));
    body.set("responsavel", clientData.responsavel);
    body.set("observacoes", clientData.observacoes);

    setPending(true);

    try {
      const response = await fetch("/api/certificados/upload", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as {
        certificado?: { id: string };
        error?: { message: string };
      };

      if (!response.ok || !payload.certificado) {
        setError(payload.error?.message ?? "Não foi possível enviar o certificado.");
        setPending(false);
        return;
      }

      router.replace(`/certificados/${payload.certificado.id}`);
      router.refresh();
    } catch {
      setError("Falha de comunicação com o servidor.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 sm:p-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        Cadastre o cliente e o certificado nesta tela. Depois, as informações do cliente devem ser editadas no detalhe
        do certificado.
      </div>

      <div className="grid gap-2">
        <label htmlFor="arquivo" className="text-sm font-medium text-slate-800">
          Arquivo PFX
        </label>
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition duration-200 hover:border-blue-300 hover:bg-blue-50/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-950">{file?.name ?? "Selecione um certificado .pfx"}</p>
              <p className="mt-1 text-xs text-slate-500">O arquivo será validado no backend antes de ser armazenado.</p>
            </div>
            <input
              id="arquivo"
              name="arquivo"
              type="file"
              accept=".pfx"
              required
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block max-w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none transition file:mr-4 file:h-10 file:border-0 file:bg-blue-600 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="senha" className="text-sm font-medium text-slate-800">
          Senha do certificado
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={selectClass}
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="cliente_id_manual" className="text-sm font-medium text-slate-800">
          Carregar cliente existente
        </label>
        <select
          id="cliente_id_manual"
          name="cliente_id_manual"
          value={manualClientId}
          onChange={(event) => handleManualClientChange(event.target.value)}
          className={inputClass}
        >
          <option value="">Cadastrar/atualizar pelo CNPJ extraído do PFX</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nome_razao_social} - {client.cnpj}
            </option>
          ))}
        </select>
        <p className="text-sm text-slate-600">
          Use esta opção para renovar um certificado de cliente já cadastrado ou para PFX sem CNPJ identificável.
        </p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-sm font-semibold text-slate-950">Dados do cliente</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Nome/razão social
            <input
              required
              value={clientData.nome_razao_social}
              onChange={(event) => patchClientData({ nome_razao_social: event.target.value })}
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            CNPJ manual
            <input
              value={clientData.cnpj_manual}
              onChange={(event) => patchClientData({ cnpj_manual: event.target.value })}
              placeholder="Use se o PFX não identificar CNPJ"
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            WhatsApp
            <input
              value={clientData.whatsapp}
              onChange={(event) => patchClientData({ whatsapp: event.target.value })}
              placeholder="(11) 99999-9999"
              className={inputClass}
            />
            <span className="text-xs font-normal text-slate-500">
              Opcional. Quando preenchido, pode receber avisos automáticos conforme as configurações.
            </span>
          </label>
          <label className="md:col-span-2 inline-flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800">
            <input
              type="checkbox"
              checked={!clientData.whatsapp_notifications_enabled}
              onChange={(event) => patchClientData({ whatsapp_notifications_enabled: !event.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span>
              Não enviar notificações WhatsApp para este cliente
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Os avisos internos para a equipe continuam funcionando normalmente.
              </span>
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Responsável
            <input
              value={clientData.responsavel}
              onChange={(event) => patchClientData({ responsavel: event.target.value })}
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            E-mail
            <input
              type="email"
              value={clientData.email}
              onChange={(event) => patchClientData({ email: event.target.value })}
              className={inputClass}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-slate-800">
            Telefone alternativo
            <input
              value={clientData.telefone}
              onChange={(event) => patchClientData({ telefone: event.target.value })}
              className={inputClass}
            />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-medium text-slate-800">
          Observações
          <textarea
            rows={3}
            value={clientData.observacoes}
            onChange={(event) => patchClientData({ observacoes: event.target.value })}
            className={textAreaClass}
          />
        </label>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary", "h-10")}
        >
          {pending ? (
            <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          ) : (
            <UploadCloud aria-hidden="true" className="h-4 w-4" />
          )}
          Enviar certificado
        </button>
      </div>
    </form>
  );
}
