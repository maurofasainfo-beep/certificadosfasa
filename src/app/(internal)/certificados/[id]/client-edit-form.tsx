"use client";

import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { buttonClass, inputClass, textAreaClass } from "@/components/ui/button-styles";

type ClientEditFormProps = {
  initialClient: {
    nome_razao_social: string;
    cnpj: string;
    email: string | null;
    telefone: string | null;
    whatsapp: string | null;
    whatsapp_notifications_enabled?: boolean | null;
    responsavel: string | null;
    observacoes: string | null;
  };
};

type ApiPayload = {
  error?: {
    message?: string;
  };
};

export function ClientEditForm({ initialClient }: ClientEditFormProps) {
  const router = useRouter();
  const [clientData, setClientData] = useState({
    nome_razao_social: initialClient.nome_razao_social,
    email: initialClient.email ?? "",
    telefone: initialClient.telefone ?? "",
    whatsapp: initialClient.whatsapp ?? "",
    whatsapp_notifications_enabled: initialClient.whatsapp_notifications_enabled ?? true,
    responsavel: initialClient.responsavel ?? "",
    observacoes: initialClient.observacoes ?? "",
  });
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function patchClientData(patch: Partial<typeof clientData>) {
    setClientData((current) => ({ ...current, ...patch }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/clientes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cnpj: initialClient.cnpj,
        ...clientData,
      }),
    });
    const payload = (await response.json().catch(() => null)) as ApiPayload | null;

    if (!response.ok) {
      setError(payload?.error?.message ?? "Não foi possível atualizar o cliente.");
      setPending(false);
      return;
    }

    setMessage("Cliente atualizado.");
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-950/5 sm:p-5">
      <div>
        <h3 className="text-base font-semibold text-slate-950">Cliente vinculado</h3>
        <p className="mt-1 text-sm text-slate-600">
          Edite os dados do cliente por aqui. O CNPJ permanece vinculado ao certificado.
        </p>
      </div>

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
          CNPJ
          <input
            readOnly
            value={initialClient.cnpj}
            className={`${inputClass} bg-slate-100 text-slate-600`}
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

      {error ? <p className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? (
        <p className="rounded-2xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{message}</p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className={buttonClass("primary")}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar cliente
        </button>
      </div>
    </form>
  );
}
