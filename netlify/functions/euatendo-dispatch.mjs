async function euAtendoDispatchCron() {
  const siteUrl = process.env.URL || process.env.DEPLOY_URL || process.env.NEXT_PUBLIC_SITE_URL;
  const cronSecret = process.env.CRON_SECRET;

  if (!siteUrl || !cronSecret) {
    console.error("Dispatcher euAtendo nao executado: URL do site ou CRON_SECRET ausente.");
    return new Response(null, { status: 204 });
  }

  const endpoint = new URL("/api/cron/euatendo-dispatch", siteUrl);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cronSecret}`,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.error("Dispatcher euAtendo falhou.", {
      status: response.status,
      body: body.slice(0, 500),
    });
    return new Response(null, { status: 500 });
  }

  return new Response(null, { status: 204 });
}

export default euAtendoDispatchCron;

export const config = {
  schedule: "* * * * *",
};
