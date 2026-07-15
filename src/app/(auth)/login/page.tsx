import { redirect } from "next/navigation";

import { FasaLogo } from "@/components/brand/fasa-logo";
import { hasSupabasePublicEnv } from "@/lib/supabase/env";
import { isInvalidRefreshTokenError, sessionCleanupRedirectPath } from "@/lib/supabase/auth-errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (hasSupabasePublicEnv()) {
    const supabase = await createServerSupabaseClient();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        redirect("/dashboard");
      }
    } catch (error) {
      if (isInvalidRefreshTokenError(error)) {
        redirect(sessionCleanupRedirectPath());
      }

      throw error;
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-950/10">
        <div className="mb-7">
          <FasaLogo className="mb-5 h-12 w-12" priority />
          <p className="text-sm font-semibold text-blue-700">Fasa Informática</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal text-slate-950">Acesso interno</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Entre para acompanhar vencimentos, certificados e avisos da equipe.
          </p>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}
