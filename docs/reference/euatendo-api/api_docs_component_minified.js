function $at(){const e=xee,{hasProAccess:t,hasGoAccess:r,hasCloudAccess:n,hasZuckProAccess:s}=doe(),{companyId:i}=Vn(),[o,l]=y.useState(!1);y.useEffect(()=>{(async()=>{if(!i)return;const{data:m}=await ce.from("company_server_permissions").select("is_allowed").eq("company_id",i).eq("server_type","comtele").maybeSingle();l((m==null?void 0:m.is_allowed)??!1)})()},[i]);const c=t||r,u=3+(r?1:0)+(t?2:0)+(c?1:0)+(n?1:0)+(s?1:0)+(o?1:0),d=u<=4?"grid-cols-4":u<=5?"grid-cols-5":u<=6?"grid-cols-6":u<=7?"grid-cols-7":u<=8?"grid-cols-8":"grid-cols-9";return a.jsx(dr,{children:a.jsxs("div",{className:"max-w-4xl",children:[a.jsxs("div",{className:"mb-8",children:[a.jsx("h1",{className:"text-3xl font-bold text-foreground",children:"Documentação da API"}),a.jsx("p",{className:"text-muted-foreground mt-2",children:"Integre suas aplicações com a API pública do euatendo"})]}),a.jsxs(Je,{className:"mb-8",children:[a.jsxs(Ct,{children:[a.jsx(Et,{children:"Autenticação"}),a.jsx(ir,{children:"Todas as requisições devem incluir o header de autorização com seu token da API"})]}),a.jsxs(ct,{children:[a.jsx(to,{code:`// Headers obrigatórios
{
  "Authorization": "Bearer SEU_TOKEN_API",
  "Content-Type": "application/json"
}`}),a.jsxs("p",{className:"text-sm text-muted-foreground mt-4",children:["Obtenha seu token de API na página de"," ",a.jsx("a",{href:"/dashboard/api/settings",className:"text-primary hover:underline",children:"Configurações da API"}),"."]}),a.jsxs("p",{className:"text-sm text-muted-foreground mt-3 border-t pt-3",children:[a.jsx("strong",{children:"Identificador da instância:"})," use o campo ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"uuid"})," no body (valor = ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"id"})," retornado por ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"GET /list-instances"}),"). O nome ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"instanceId"})," continua aceito como alias legado."]})]})]}),a.jsxs(Je,{className:"mb-8",children:[a.jsx(Ct,{children:a.jsx(Et,{children:"URL Base"})}),a.jsxs(ct,{children:[a.jsx(to,{code:e}),a.jsxs("p",{className:"text-sm text-muted-foreground mt-3",children:["A API pública sempre responde em ",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs",children:"https://apicluster.euatendo.app"}),", seguindo o mesmo padrão de rotas das Functions do Supabase, por exemplo:",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs ml-1",children:"/send-text-message"}),",",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs ml-1",children:"/send-chat-presence"}),",",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs ml-1",children:"/create-instance"}),",",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs ml-1",children:"/proxy-managed-cities"}),",",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs ml-1",children:"/check-instance-status"}),", entre outras. Rotas legadas também em ",a.jsx("code",{className:"bg-muted px-1.5 py-0.5 rounded text-xs",children:"/functions/v1/…"})," (mesmo comportamento)."]})]})]}),a.jsxs(Je,{className:"mb-8",children:[a.jsxs(Ct,{children:[a.jsx(Et,{children:"Rate Limits"}),a.jsx(ir,{children:"Limites de requisições por minuto para evitar abusos"})]}),a.jsxs(ct,{className:"space-y-4",children:[a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b",children:[a.jsx("th",{className:"text-left py-2 font-medium",children:"Endpoint"}),a.jsx("th",{className:"text-left py-2 font-medium",children:"Limite"}),a.jsx("th",{className:"text-left py-2 font-medium",children:"Janela"})]})}),a.jsxs("tbody",{children:[a.jsxs("tr",{className:"border-b",children:[a.jsx("td",{className:"py-2",children:a.jsx("code",{className:"text-xs bg-muted px-1.5 py-0.5 rounded",children:"/list-instances"})}),a.jsx("td",{className:"py-2",children:"60 requisições"}),a.jsx("td",{className:"py-2",children:"1 minuto"})]}),a.jsxs("tr",{className:"border-b",children:[a.jsx("td",{className:"py-2",children:a.jsx("code",{className:"text-xs bg-muted px-1.5 py-0.5 rounded",children:"/check-instance-status"})}),a.jsx("td",{className:"py-2",children:"120 requisições"}),a.jsx("td",{className:"py-2",children:"1 minuto"})]})]})]})}),a.jsxs("div",{className:"bg-muted/50 p-4 rounded-lg space-y-3",children:[a.jsx("h4",{className:"text-sm font-medium",children:"Resposta quando limite excedido (HTTP 429)"}),a.jsx(to,{code:`{
  "error": "Rate limit exceeded",
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "currentCount": 60,
  "maxRequests": 60,
  "resetAt": "2026-01-27T10:05:00Z",
  "retryAfter": 30
}`})]}),a.jsxs("div",{className:"bg-muted/50 p-4 rounded-lg",children:[a.jsx("h4",{className:"text-sm font-medium mb-2",children:"Headers de Rate Limit"}),a.jsxs("ul",{className:"text-sm text-muted-foreground space-y-1",children:[a.jsxs("li",{children:["• ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"X-RateLimit-Limit"}),": Limite máximo de requisições"]}),a.jsxs("li",{children:["• ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"X-RateLimit-Remaining"}),": Requisições restantes na janela"]}),a.jsxs("li",{children:["• ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"X-RateLimit-Reset"}),": Data/hora de reset da janela (ISO 8601)"]}),a.jsxs("li",{children:["• ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"Retry-After"}),": Segundos até liberar (apenas no 429)"]})]})]})]})]}),a.jsxs(a0,{defaultValue:"instances",className:"space-y-6",children:[a.jsxs(Pg,{className:`grid ${d} w-full`,children:[a.jsx(ya,{value:"instances",children:"Instâncias"}),a.jsx(ya,{value:"messages",children:"Mensagens"}),a.jsx(ya,{value:"contacts",children:"Contatos"}),r&&a.jsx(ya,{value:"webhooks",children:"Webhooks"}),a.jsx(ya,{value:"templates",children:"Templates"}),t&&a.jsx(ya,{value:"pix",children:"PIX"}),t&&a.jsx(ya,{value:"payments",children:"Pagamentos"}),c&&a.jsx(ya,{value:"presence",children:"Presença"}),s&&a.jsxs(ya,{value:"buttons",className:"flex items-center gap-1.5",children:[a.jsx(i1,{className:"w-3.5 h-3.5 text-orange-500"}),"Botões"]}),o&&a.jsxs(ya,{value:"sms",className:"flex items-center gap-1.5",children:[a.jsx(en,{className:"w-3.5 h-3.5 text-green-500"}),"SMS"]})]}),a.jsx(vs,{value:"instances",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsx(Yn,{method:"GET",path:"/list-instances",description:"Lista todas as instâncias da empresa com seus dados principais.",curlExample:`curl --request GET \\
  --url ${e}/list-instances \\
  --header 'Authorization: Bearer SEU_TOKEN_API'`,responseBody:`{
  "success": true,
  "instances": [
    {
      "id": "uuid-da-instancia",
      "name": "minha-instancia",
      "phoneNumber": "5511999999999",
      "profileName": "Nome WhatsApp",
      "status": "connected",
      "serverType": "euAtendoPRO",
      "createdAt": "2025-01-27T10:00:00Z"
    }
  ],
  "count": 1
}`,notes:["Retorna todas as instâncias da empresa autenticada","O status pode ser: pending, qr_code, connected, disconnected","serverType usa nomes comerciais: euAtendoPRO, euAtendoGO, ZuckPRO, CloudAPI, euAtendoPAPI"]}),a.jsx(Yn,{method:"POST",path:"/create-instance",description:"Cria uma nova instância. Opcionalmente permite escolher o tipo de servidor.",curlExample:`# Alocação automática (padrão)
curl --request POST \\
  --url ${e}/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia"
}'

# Escolhendo euAtendoPRO
curl --request POST \\
  --url ${e}/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia",
  "serverType": "euAtendoPRO"
}'

# Escolhendo euAtendoGO
curl --request POST \\
  --url ${e}/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia",
  "serverType": "euAtendoGO"
}'

# Escolhendo ZuckPRO (suporte a botões interativos)
curl --request POST \\
  --url ${e}/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia",
  "serverType": "ZuckPRO"
}'`,requestBody:`{
  "name": "nome-da-instancia",
  "serverType": "euAtendoPRO" // opcional: "euAtendoPRO", "euAtendoGO", "ZuckPRO" ou omitir para automático
}`,responseBody:`{
  "success": true,
  "instanceId": "uuid-da-instancia",
  "instanceKey": "chave-unica-da-instancia",
  "serverType": "pro", // ou "go", "zuckpro"
  "serverResponse": {
    "token": "token-da-instancia",
    "instance": {
      "id": "id-interno"
    }
  }
}`,notes:["O name é obrigatório e será o nome de identificação da instância",'serverType é opcional: "euAtendoPRO", "euAtendoGO" ou "ZuckPRO"',"ZuckPRO suporta botões interativos exclusivos (cta_url, cta_call, cta_copy, pix)","Se serverType não for informado, o sistema escolhe automaticamente via balanceamento de carga","O tipo de servidor disponível depende do plano contratado","O instanceId retornado deve ser usado nas demais operações"]}),t&&a.jsxs(Je,{className:"mb-6 border-primary/20",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Proxy regional gerenciado (WhatsPRO)"}),a.jsx(ir,{children:"Rede de proxy interna por cidade/estado — opcional ao conectar instâncias WhatsPRO. Não é o mesmo que proxy manual por URL."})]}),a.jsxs(ct,{className:"space-y-4 text-sm text-muted-foreground",children:[a.jsxs("ol",{className:"list-decimal list-inside space-y-2",children:[a.jsxs("li",{children:[a.jsx("strong",{className:"text-foreground",children:"Criar instância"})," —"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"POST /create-instance"})," com"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"serverType: euAtendoPRO"})]}),a.jsxs("li",{children:[a.jsx("strong",{className:"text-foreground",children:"Listar cidades"})," —"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"POST /proxy-managed-cities"})," com UF (ex.: ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"state: sp"}),"); a lista de estados brasileiros é fixa no seu app (27 UFs)"]}),a.jsxs("li",{children:[a.jsx("strong",{className:"text-foreground",children:"Conectar"})," —"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"POST /connect-instance"})," com"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"proxyManaged"})," (use o campo"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"value"})," da cidade) +"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"phone"})," opcional"]})]}),a.jsxs("div",{className:"bg-muted/50 p-4 rounded-lg space-y-2",children:[a.jsxs("p",{children:[a.jsx("strong",{className:"text-foreground",children:"Pré-requisitos:"})," instância alocada em servidor WhatsPRO com proxy regional habilitado pelo administrador da plataforma (",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"/admin/servers"})," — não configurável via API). Instância euAtendo GO e demais tipos não suportam este recurso."]}),a.jsxs("p",{children:[a.jsx("strong",{className:"text-foreground",children:"Reconexão:"})," após connect bem-sucedido com"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"proxyManaged"}),", a escolha fica salva na instância e pode ser reutilizada sem reenviar no body."]}),a.jsxs("p",{children:[a.jsx("strong",{className:"text-foreground",children:"Deploy:"})," após atualizar o API Cluster, confira"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"GET /health"})," com"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"version"})," = 2.0.4 e"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"features.proxyRegional"})," = true."]}),a.jsxs("p",{children:[a.jsx("strong",{className:"text-foreground",children:"Identificador:"})," prefira"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"uuid"})," (valor ="," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"id"})," de"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"/list-instances"}),");"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"instanceId"})," continua como alias legado."]})]})]})]}),t&&a.jsx(Yn,{method:"POST",path:"/proxy-managed-cities",description:"Lista cidades disponíveis no proxy regional gerenciado WhatsPRO para uma instância. Chame após create-instance e antes de connect-instance quando quiser usar proxy.",curlExample:`curl --request POST \\
  --url ${e}/proxy-managed-cities \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-da-instancia",
  "country": "br",
  "state": "sp"
}'`,requestBody:`{
  "uuid": "uuid-da-instancia",       // ou instanceId (alias legado)
  "country": "br",                   // opcional, padrão br
  "state": "sp"                      // UF em minúsculas (obrigatório para filtrar cidades)
}`,responseBody:`{
  "success": true,
  "cities": [
    {
      "name": "Campinas",
      "value": "campinas",
      "state": "sp",
      "country": "br"
    }
  ]
}

// Erro — servidor sem proxy regional ou tipo != WhatsPRO
{
  "success": false,
  "error": "Proxy regional não habilitado neste servidor"
}

// Erro — instância ainda não criada no WhatsPRO
{
  "success": false,
  "error": "Instância ainda não foi criada no servidor WhatsPRO"
}`,notes:["Disponível apenas para instâncias WhatsPRO em servidores com proxy regional habilitado","A instância deve existir no WhatsPRO (create-instance concluído) antes de listar cidades","Use o campo value (não name) em proxyManaged.city no connect-instance","Respostas são cacheadas no cluster por ~1 hora por país/servidor","HTTP 502 se a WhatsPRO falhar ao listar cidades upstream"]}),a.jsx(Yn,{method:"POST",path:"/connect-instance",description:"Conecta uma instância ao WhatsApp. Retorna QR Code ou código de pareamento. Se já estiver conectada, retorna sucesso imediatamente. Instâncias WhatsPRO podem enviar proxyManaged opcional (ver seção acima).",curlExample:`# Conexão padrão (QR Code ou pareamento)
curl --request POST \\
  --url ${e}/connect-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-da-instancia",
  "phone": "5511999999999"
}'

# Conexão WhatsPRO com proxy regional (QR Code)
curl --request POST \\
  --url ${e}/connect-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-da-instancia",
  "proxyManaged": {
    "country": "br",
    "state": "sp",
    "city": "campinas"
  }
}'

# Conexão WhatsPRO com proxy regional + pareamento por número
curl --request POST \\
  --url ${e}/connect-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-da-instancia",
  "proxyManaged": {
    "country": "br",
    "state": "sp",
    "city": "campinas"
  },
  "phone": "5511999999999"
}'`,requestBody:`{
  "uuid": "uuid-da-instancia",       // ou instanceId (alias legado)
  "phone": "5511999999999",         // opcional — pareamento por código
  "proxyManaged": {                  // opcional — somente WhatsPRO + servidor com proxy regional
    "country": "br",
    "state": "sp",
    "city": "campinas"               // value retornado por /proxy-managed-cities
  }
}`,responseBody:`// Resposta com QR Code
{
  "success": true,
  "qrcode": "base64-do-qrcode",
  "pairingCode": null,
  "message": "QR code gerado",
  "serverType": "pro",
  "raw": { ... } // dados brutos do servidor
}

// Resposta com código de pareamento (phone informado)
{
  "success": true,
  "qrcode": null,
  "pairingCode": "ABC1-2345",
  "message": "Código de pareamento gerado",
  "serverType": "pro",
  "raw": { ... }
}

// Resposta quando já conectado
{
  "success": true,
  "qrcode": null,
  "pairingCode": null,
  "message": "WhatsApp já está conectado",
  "serverType": "pro",
  "raw": { ... }
}`,notes:['Se a instância já estiver conectada, retorna success: true com a mensagem "WhatsApp já está conectado"',"Se o phone for informado, retorna um código de pareamento (pairingCode) ao invés do QR Code","O QR Code retorna em base64 e deve ser exibido para o usuário escanear com o WhatsApp",'O status da instância é atualizado automaticamente: "connected" se já conectado, "qr_code" se aguardando leitura','serverType indica o tipo de servidor: "pro" (euAtendo PRO / WhatsPRO) ou "go" (euAtendo GO)',"proxyManaged é opcional; omitir mantém o connect normal em qualquer tipo de servidor","proxyManaged só é aplicado em instâncias WhatsPRO alocadas em servidor com proxy regional habilitado","Após connect bem-sucedido com proxyManaged, a escolha é persistida — reconexões podem omitir proxyManaged no body","Alias legado com mesmo comportamento: POST /connect-uazapi-instance","euAtendo GO não suporta proxy regional — use connect sem proxyManaged"]}),a.jsx(Yn,{method:"POST",path:"/check-instance-status",description:"Verifica o status atual de uma instância e atualiza os dados do perfil conectado.",curlExample:`curl --request POST \\
  --url ${e}/check-instance-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia"
}`,responseBody:`{
  "success": true,
  "connected": true,
  "status": "connected",
  "profileName": "Nome do Perfil",
  "profilePicUrl": "https://...",
  "phoneNumber": "5511999999999",
  "serverType": "euAtendoPRO",
  "cached": false
}`,notes:["Rate limit: 120 req/min por empresa + 4 req/min por instância","Respostas são cacheadas por 30 segundos para evitar sobrecarga",'O campo "cached" indica se o resultado veio do cache',"serverType usa nomes comerciais: euAtendoPRO, euAtendoGO, ZuckPRO, CloudAPI, euAtendoPAPI"]}),a.jsx(Yn,{method:"POST",path:"/delete-instance",description:"Deleta uma instância e remove do banco de dados.",curlExample:`curl --request POST \\
  --url ${e}/delete-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia"
}`,responseBody:`{
  "success": true,
  "message": "Instância deletada com sucesso"
}`,notes:["Esta ação é irreversível","A instância será desconectada do WhatsApp e removida do sistema"]})]})}),a.jsx(vs,{value:"messages",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsx(Yn,{method:"POST",path:"/send-text-message",description:"Envia uma mensagem de texto simples.",curlExample:`curl --request POST \\
  --url ${e}/send-text-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "text": "Olá, esta é uma mensagem de teste!"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "text": "Olá, esta é uma mensagem de teste!"
}`,responseBody:`{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}`,notes:["O número deve incluir o código do país (55 para Brasil)","A instância deve estar conectada (status: connected)",'Para exibir "digitando…" antes do envio, use POST /send-chat-presence (aba Presença) com presence: composing']}),a.jsx(Yn,{method:"POST",path:"/send-media-message",description:"Envia uma mensagem com mídia (imagem, vídeo, áudio ou documento). Suporta URL, Base64 ou upload de arquivo.",curlExample:`# Opção 1: JSON com URL
curl --request POST \\
  --url ${e}/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "type": "image",
  "file": "https://url-do-arquivo.com/imagem.jpg",
  "text": "Legenda opcional"
}'

# Opção 2: JSON com Base64
curl --request POST \\
  --url ${e}/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "type": "document",
  "base64": "JVBERi0xLjQKJeLjz9M...",
  "mimeType": "application/pdf",
  "fileName": "contrato.pdf"
}'

# Opção 3: FormData com arquivo local
curl --request POST \\
  --url ${e}/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --form 'instanceId=uuid-da-instancia' \\
  --form 'number=5511999999999' \\
  --form 'type=image' \\
  --form 'file=@/caminho/para/imagem.jpg' \\
  --form 'text=Legenda opcional'`,requestBody:`// Opção 1: JSON com URL
{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "type": "image",
  "file": "https://url-do-arquivo.com/imagem.jpg",
  "text": "Legenda opcional"
}

// Opção 2: JSON com Base64 (NOVO!)
{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "type": "document",
  "base64": "JVBERi0xLjQKJeLjz9M...",
  "mimeType": "application/pdf",
  "fileName": "contrato.pdf",
  "text": "Segue o documento"
}

// Opção 3: FormData com arquivo local
// Content-Type: multipart/form-data
// - instanceId: "uuid-da-instancia"
// - number: "5511999999999"
// - type: "image"
// - file: (arquivo binário)
// - text: "Legenda opcional"`,responseBody:`{
  "success": true,
  "messageId": "id-da-mensagem",
  "status": "sent",
  "chatId": "chat-id"
}`,notes:["Tipos suportados: image, video, audio, document, myaudio, ptt, ptv, sticker","Opção 1 (URL): file deve ser uma URL pública acessível","Opção 2 (Base64): base64 é o conteúdo do arquivo em base64, mimeType define o tipo (ex: application/pdf)","Opção 3 (FormData): arquivo é enviado para storage automaticamente","fileName é opcional mas recomendado para documentos (define nome no WhatsApp)","Limite de 50MB para upload de arquivos","text/caption só é suportado para imagens e vídeos"]}),a.jsx(Yn,{method:"POST",path:"/get-message-status",description:"Obtém o status ou histórico de mensagens. Funciona de forma diferente para cada tipo de servidor.",curlExample:`# euAtendo PRO - busca status por ID da mensagem
curl --request POST \\
  --url ${e}/get-message-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "messageId": "3EB0E8102609EC734DCA5D"
}'

# euAtendo GO - busca histórico por JID do contato
curl --request POST \\
  --url ${e}/get-message-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "messageId": "559982385000@s.whatsapp.net"
}'`,requestBody:`// euAtendo PRO - busca status por ID da mensagem
{
  "instanceId": "uuid-da-instancia",
  "messageId": "3EB0E8102609EC734DCA5D"
}

// euAtendo GO - busca histórico por JID do contato
{
  "instanceId": "uuid-da-instancia",
  "messageId": "559982385000@s.whatsapp.net"
}`,responseBody:`// Resposta euAtendo PRO
{
  "success": true,
  "serverType": "pro",
  "message": {
    "id": "3EB0E8102609EC734DCA5D",
    "fromMe": true,
    "remoteJid": "5511999999999@s.whatsapp.net",
    "status": "READ",
    "timestamp": 1704067200,
    "type": "text",
    "content": "Olá, esta é uma mensagem de teste!"
  },
  "raw": { ... }
}

// Resposta euAtendo GO
{
  "success": true,
  "serverType": "go",
  "message": {
    "id": "4FB1D878E37B2C6G8D94",
    "timestamp": "2023-12-01T15:30:00Z",
    "type": "text",
    "text": "Hello, how are you?",
    "chatJid": "559982385000@s.whatsapp.net",
    "senderJid": "559991046950@s.whatsapp.net"
  },
  "raw": { ... }
}`,notes:["euAtendo PRO: messageId é o ID da mensagem retornado ao enviar","euAtendo GO: messageId é o JID do contato (ex: 559982385000@s.whatsapp.net)",'O campo serverType indica o tipo de servidor: "pro" ou "go"',"O campo raw contém a resposta completa do servidor para debugging","euAtendo PRO: Status possíveis: PENDING, SENT, DELIVERED, READ, PLAYED, ERROR","euAtendo GO: Retorna histórico de mensagens do contato (últimas 100)"]}),a.jsx(Yn,{method:"POST",path:"/check-number-whatsapp",description:"Verifica se um ou mais números de telefone possuem WhatsApp válido.",curlExample:`curl --request POST \\
  --url ${e}/check-number-whatsapp \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "numbers": [
    "5511999998888",
    "5521988887777"
  ]
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "numbers": [
    "5511999998888",
    "5521988887777",
    "5531977776666"
  ]
}`,responseBody:`{
  "success": true,
  "serverType": "pro",
  "results": [
    {
      "number": "5511999998888",
      "exists": true,
      "jid": "5511999998888@s.whatsapp.net"
    },
    {
      "number": "5521988887777",
      "exists": true,
      "jid": "5521988887777@s.whatsapp.net"
    },
    {
      "number": "5531977776666",
      "exists": false
    }
  ],
  "raw": { ... }
}`,notes:["Permite verificar múltiplos números em uma única requisição","Cada número deve ter entre 10-15 dígitos (apenas números)","O campo exists indica se o número possui WhatsApp ativo","O campo jid é retornado apenas quando exists é true",'O campo serverType indica o tipo de servidor: "pro" ou "go"',"O campo raw contém a resposta completa do servidor para debugging"]})]})}),a.jsx(vs,{value:"contacts",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsx(Yn,{method:"POST",path:"/get-instance-contacts",description:"Retorna a lista de contatos salvos na instância do WhatsApp.",curlExample:`curl --request POST \\
  --url ${e}/get-instance-contacts \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia"
}`,responseBody:`{
  "success": true,
  "contacts": [
    {
      "id": "5511999999999@s.whatsapp.net",
      "name": "Nome do Contato",
      "pushName": "Nome de Exibição",
      "profilePicUrl": "https://..."
    }
  ]
}`,notes:["Retorna apenas contatos sincronizados com o WhatsApp","O id do contato está no formato JID do WhatsApp"]}),t&&a.jsx(Yn,{method:"POST",path:"/send-contact",description:"Envia um contato (vCard) para um número de WhatsApp. Disponível apenas para euAtendo PRO.",curlExample:`curl --request POST \\
  --url ${e}/send-contact \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "fullName": "João Silva",
  "phoneNumber": "5511888888888,5521777777777",
  "organization": "Empresa XYZ",
  "email": "joao@empresa.com",
  "url": "https://empresa.com/joao"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "fullName": "João Silva",
  "phoneNumber": "5511888888888,5521777777777",
  "organization": "Empresa XYZ",
  "email": "joao@empresa.com",
  "url": "https://empresa.com/joao"
}`,responseBody:`{
  "success": true,
  "messageId": "3EB092C7213F95C060E140",
  "status": "Pending",
  "chatId": "5511999999999@s.whatsapp.net",
  "raw": {
    "chatid": "5511999999999@s.whatsapp.net",
    "content": {
      "displayName": "João Silva",
      "vcard": "BEGIN:VCARD\\nVERSION:3.0\\n..."
    },
    "messageType": "ContactMessage",
    ...
  }
}`,notes:["number é o destinatário que receberá o contato (com código do país)","fullName é o nome completo do contato a ser enviado (obrigatório)","phoneNumber são os telefones do contato, separados por vírgula para múltiplos (obrigatório)","organization, email e url são campos opcionais do vCard","Disponível apenas para instâncias euAtendo PRO","A instância deve estar conectada (status: connected)","Conta no limite diário de mensagens"]})]})}),r&&a.jsx(vs,{value:"webhooks",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsxs("div",{className:"mb-6 p-4 bg-muted/50 rounded-lg border border-border",children:[a.jsx("h3",{className:"font-semibold mb-2",children:"Sobre Webhooks"}),a.jsx("p",{className:"text-sm text-muted-foreground",children:"Webhooks permitem que você receba notificações em tempo real sobre eventos que ocorrem na sua instância do WhatsApp. Endpoint público disponível no API Cluster para instâncias compatíveis (euAtendoGO, WhatsPRO, euAtendoPAPI e ZuckPRO)."})]}),a.jsx(Yn,{method:"POST",path:"/set-instance-webhook",description:"Obtém a configuração atual do webhook da instância. Envie apenas o instanceId para consultar.",curlExample:`curl --request POST \\
  --url ${e}/set-instance-webhook \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia"
}`,responseBody:`{
  "success": true,
  "config": {
    "url": "https://seu-servidor.com/webhook",
    "events": ["Message", "Receipt"],
    "active": true
  }
}`,notes:["Este endpoint funciona em dois modos: GET (consulta) e SET (configuração)","Para consultar, envie apenas o instanceId","Disponível para instâncias compatíveis: euAtendoGO, WhatsPRO, euAtendoPAPI e ZuckPRO"]}),a.jsx(Yn,{method:"POST",path:"/set-instance-webhook",description:"Configura o webhook para receber eventos da instância do WhatsApp.",curlExample:`curl --request POST \\
  --url ${e}/set-instance-webhook \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "webhookUrl": "https://seu-servidor.com/webhook",
  "events": ["Message", "Receipt", "Connected"],
  "active": true
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "webhookUrl": "https://seu-servidor.com/webhook",
  "events": ["Message", "Receipt", "Connected"],
  "active": true
}`,responseBody:`{
  "success": true,
  "config": {
    "url": "https://seu-servidor.com/webhook",
    "events": ["Message", "Receipt", "Connected"],
    "active": true
  }
}`,notes:["webhookUrl deve ser uma URL HTTPS válida","active: true para ativar, false para desativar",'Use ["All"] no events para receber todos os eventos',"Para remover webhook, envie webhookUrl vazio, events vazio e active: false"]}),a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Eventos Disponíveis"}),a.jsx(ir,{children:"Lista completa de eventos que podem ser configurados no webhook"})]}),a.jsx(ct,{children:a.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Mensagens"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["Message","Receipt","UndecryptableMessage","MediaRetry"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Conexão"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["Connected","Disconnected","LoggedOut","ConnectFailure","KeepAliveRestored","KeepAliveTimeout","StreamError","StreamReplaced","ClientOutdated","TemporaryBan"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"QR/Pareamento"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["QR","PairSuccess","PairError","QRScannedWithoutMultidevice"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Grupos"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["GroupInfo","JoinedGroup"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Chamadas"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["CallOffer","CallAccept","CallTerminate","CallOfferNotice","CallRelayLatency"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Presença"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["Presence","ChatPresence"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Perfil"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["Picture","PushNameSetting","UserAbout","PrivacySettings"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Newsletter"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["NewsletterJoin","NewsletterLeave","NewsletterMuteChange","NewsletterLiveUpdate"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Bloqueio"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["BlocklistChange","Blocklist"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Sincronização"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["AppState","AppStateSyncComplete","HistorySync","OfflineSyncCompleted","OfflineSyncPreview"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]}),a.jsxs("div",{children:[a.jsx("h4",{className:"font-medium text-sm mb-2",children:"Outros"}),a.jsx("div",{className:"flex flex-wrap gap-1",children:["IdentityChange","FBMessage","All"].map(h=>a.jsx(_e,{variant:"secondary",className:"text-xs",children:h},h))})]})]})})]}),a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Exemplo de Payload Recebido"}),a.jsx(ir,{children:"Estrutura do payload que seu webhook receberá via POST"})]}),a.jsx(ct,{children:a.jsx(to,{code:`{
  "event": "Message",
  "data": {
    "id": "3EB0E0622502E3464DDEA3",
    "from": "5511999999999@s.whatsapp.net",
    "to": "5521888888888@s.whatsapp.net",
    "timestamp": 1766429868,
    "type": "text",
    "body": "Olá, tudo bem?",
    "isGroup": false,
    "pushName": "João Silva"
  }
}`})})]})]})}),t&&a.jsx(vs,{value:"pix",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsx(Yn,{method:"POST",path:"/send-pix-button",description:"Envia uma mensagem com botão de pagamento PIX.",curlExample:`curl --request POST \\
  --url ${e}/send-pix-button \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "pixType": "EVP",
  "pixKey": "123e4567-e89b-12d3-a456-426614174000",
  "pixName": "Nome do Recebedor",
  "amount": 150.50,
  "description": "Pagamento do pedido #123"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "pixType": "EVP", // CPF, CNPJ, PHONE, EMAIL, EVP
  "pixKey": "123e4567-e89b-12d3-a456-426614174000",
  "pixName": "Nome do Recebedor",
  "amount": 150.50, // opcional
  "description": "Pagamento do pedido #123" // opcional
}`,responseBody:`{
  "success": true,
  "message": "Mensagem PIX enviada com sucesso"
}`,notes:["pixType aceita: CPF, CNPJ, PHONE, EMAIL, EVP (case insensitive)","EVP é a chave aleatória do PIX","amount e description são opcionais"]}),a.jsx(Yn,{method:"POST",path:"/send-copy-button",description:"Envia uma mensagem com botão de copiar texto. Útil para enviar códigos PIX, cupons, senhas temporárias, etc. Suporta imagem opcional via URL ou upload de arquivo.",curlExample:`# Envio com URL de imagem externa
curl --request POST \\
  --url ${e}/send-copy-button \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "text": "Aqui está seu código PIX:",
  "buttonText": "Copiar Código PIX",
  "copyContent": "00020126580014BR.GOV.BCB.PIX...",
  "imageButton": "https://exemplo.com/imagem.jpg",
  "footerText": "Clique para copiar"
}'

# Envio com upload de arquivo (multipart/form-data)
curl --request POST \\
  --url ${e}/send-copy-button \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --form 'instanceId=uuid-da-instancia' \\
  --form 'number=5511999999999' \\
  --form 'text=Aqui está seu código PIX:' \\
  --form 'buttonText=Copiar Código PIX' \\
  --form 'copyContent=00020126580014BR.GOV.BCB.PIX...' \\
  --form 'footerText=Clique para copiar' \\
  --form 'image=@/caminho/para/imagem.jpg'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "text": "Aqui está seu código PIX:",
  "buttonText": "Copiar Código PIX",
  "copyContent": "00020126580014BR.GOV.BCB.PIX...",
  "imageButton": "https://exemplo.com/imagem.jpg", // opcional
  "footerText": "Clique para copiar" // opcional
}

// Ou via multipart/form-data para upload de arquivo:
// - instanceId, number, text, buttonText, copyContent: campos de texto
// - footerText: campo de texto opcional
// - image: arquivo de imagem (JPG, PNG, WEBP, GIF)`,responseBody:`{
  "success": true,
  "messageId": "id-da-mensagem",
  "status": "sent",
  "chatId": "5511999999999@s.whatsapp.net"
}`,notes:["Disponível apenas para instâncias euAtendo PRO","copyContent é o texto que será copiado ao clicar no botão","Limite de 4096 caracteres para copyContent","imageButton: URL externa da imagem (opcional)","image: campo para upload de arquivo via multipart/form-data (alternativo ao imageButton)","Limite de 5MB para upload de imagem. Formatos: JPG, PNG, WEBP, GIF","Arquivos enviados são armazenados automaticamente no servidor",'A mensagem pode aparecer como "Não é possível exibir no WhatsApp Web"',"A instância deve estar conectada (status: connected)"]})]})}),c&&a.jsx(vs,{value:"presence",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Presença no chat e online"}),a.jsx(ir,{children:'Envio de indicadores ("digitando…", "gravando áudio…") e, no WhatsPRO, status online/offline da conta. Recepção de presença do contato via webhook (aba Webhooks).'})]}),a.jsxs(ct,{className:"space-y-4",children:[a.jsxs("div",{className:"flex flex-wrap gap-2",children:[t&&a.jsx(_e,{variant:"secondary",children:"WhatsPRO — send-chat-presence + set-instance-presence"}),r&&a.jsx(_e,{variant:"secondary",children:"euAtendo GO — send-chat-presence"}),s&&a.jsx(_e,{variant:"secondary",children:"ZuckPRO — send-chat-presence"})]}),a.jsxs("p",{className:"text-sm text-muted-foreground",children:["Após deploy do API Cluster, confira ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"GET /health"})," com",a.jsx("code",{className:"text-xs bg-muted px-1 rounded ml-1",children:"version"})," ≥ 2.0.4 e",a.jsx("code",{className:"text-xs bg-muted px-1 rounded ml-1",children:"features.proxyRegional"})," = true (presença:"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"sendChatPresenceGo"}),")."]})]})]}),a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Mapeamento por tipo de instância"}),a.jsx(ir,{children:"O body da API pública é unificado; o cluster traduz para o servidor WhatsPRO ou GO."})]}),a.jsx(ct,{children:a.jsx("div",{className:"overflow-x-auto",children:a.jsxs("table",{className:"w-full text-sm",children:[a.jsx("thead",{children:a.jsxs("tr",{className:"border-b",children:[a.jsx("th",{className:"text-left py-2 font-medium",children:"Campo API (body)"}),a.jsx("th",{className:"text-left py-2 font-medium",children:"WhatsPRO"}),a.jsx("th",{className:"text-left py-2 font-medium",children:"euAtendo GO / ZuckPRO"})]})}),a.jsxs("tbody",{className:"text-muted-foreground",children:[a.jsxs("tr",{className:"border-b",children:[a.jsx("td",{className:"py-2",children:a.jsx("code",{className:"text-xs",children:"composing"})}),a.jsx("td",{className:"py-2",children:"number + presence (upstream: number, presence, delay?)"}),a.jsx("td",{className:"py-2",children:"Phone + State: composing"})]}),a.jsxs("tr",{className:"border-b",children:[a.jsx("td",{className:"py-2",children:a.jsx("code",{className:"text-xs",children:"recording"})}),a.jsx("td",{className:"py-2",children:"presence: recording"}),a.jsx("td",{className:"py-2",children:"Phone + State: composing + Media: audio"})]}),a.jsxs("tr",{className:"border-b",children:[a.jsx("td",{className:"py-2",children:a.jsx("code",{className:"text-xs",children:"paused"})}),a.jsx("td",{className:"py-2",children:"presence: paused"}),a.jsx("td",{className:"py-2",children:"Phone + State: paused"})]}),a.jsxs("tr",{className:"border-b",children:[a.jsx("td",{className:"py-2",children:"Destino"}),a.jsxs("td",{className:"py-2",children:[a.jsx("code",{className:"text-xs",children:"number"})," ou ",a.jsx("code",{className:"text-xs",children:"chatId"})," (JID)"]}),a.jsxs("td",{className:"py-2",children:[a.jsx("code",{className:"text-xs",children:"number"})," ou ",a.jsx("code",{className:"text-xs",children:"chatId"})," → Phone"]})]}),a.jsxs("tr",{children:[a.jsx("td",{className:"py-2",children:"Upstream"}),a.jsx("td",{className:"py-2",children:"POST /message/presence (number, presence, delay?)"}),a.jsx("td",{className:"py-2",children:"POST /chat/presence"})]})]})]})})})]}),a.jsx(Yn,{method:"POST",path:"/send-chat-presence",description:"Envia presença no chat (digitando, gravando áudio ou parar o indicador). Disponível para instâncias WhatsPRO, euAtendo GO e ZuckPRO. Não consome limite diário/mensal de mensagens.",curlExample:r&&!t?`curl --request POST \\
  --url ${e}/send-chat-presence \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-instancia-go",
  "number": "5511999999999",
  "presence": "composing"
}'`:`curl --request POST \\
  --url ${e}/send-chat-presence \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",
  "number": "5511999999999",
  "presence": "composing"
}'`,requestBody:`{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",  // obrigatório (alias: instanceId)
  "number": "5511999999999",          // obrigatório se chatId omitido
  "chatId": "5511999999999@s.whatsapp.net",  // opcional (alternativa a number)
  "presence": "composing"  // composing | recording | paused
}`,responseBody:`// WhatsPRO (resposta inclui chatId)
{
  "success": true,
  "presence": "composing",
  "chatId": "5511999999999@s.whatsapp.net"
}

// euAtendo GO / ZuckPRO (resposta inclui phone)
{
  "success": true,
  "presence": "composing",
  "phone": "5511999999999"
}

// Erro — tipo de servidor não suportado (Cloud API, PAPI, etc.)
{
  "success": false,
  "error": "Presença no chat disponível apenas para instâncias WhatsPRO (euAtendo PRO) ou euAtendo GO",
  "errorCode": "PRESENCE_UNSUPPORTED_SERVER"
}`,notes:["Campo uuid = id da instância em /list-instances; instanceId aceito como alias","Instância deve estar connected","Grupos: use number ou chatId no formato id@g.us","Fluxo recomendado: composing → POST /send-text-message (ou mídia) → paused","O indicador expira no WhatsApp; reenvie composing em respostas longas","Cloud API e PAPI: errorCode PRESENCE_UNSUPPORTED_SERVER",r?"GO upstream: POST /chat/presence com { Phone, State } — Media só em recording":"",t?"WhatsPRO: upstream POST /message/presence (number, presence, delay opcional)":"","delay (ms) opcional no body repassado ao uazapiGO"].filter(Boolean)}),a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Receber presença do contato (webhook)"}),a.jsx(ir,{children:"O envio usa os endpoints acima; para saber quando o contato está digitando, configure o webhook na aba Webhooks."})]}),a.jsxs(ct,{className:"text-sm text-muted-foreground space-y-2",children:[a.jsxs("p",{children:[a.jsx("strong",{children:"WhatsPRO:"})," inclua o evento ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"presence"})," em"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"/set-instance-webhook"}),"."]}),a.jsxs("p",{children:[a.jsx("strong",{children:"euAtendo GO:"})," inclua ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"ChatPresence"})," ou"," ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"Presence"})," na lista de eventos do webhook."]})]})]}),t&&a.jsx(Yn,{method:"POST",path:"/set-instance-presence",description:"Define se a conta WhatsPRO aparece online (available) ou offline (unavailable) no WhatsApp. Exclusivo euAtendo PRO — a API GO não possui endpoint equivalente.",curlExample:`curl --request POST \\
  --url ${e}/set-instance-presence \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",
  "presence": "available"
}'`,requestBody:`{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",  // alias: instanceId
  "presence": "available"  // available | unavailable
}`,responseBody:`{
  "success": true,
  "presence": "available"
}

// Instância euAtendo GO
{
  "success": false,
  "error": "Disponível apenas para instâncias WhatsPRO (euAtendo PRO)",
  "errorCode": "PRESENCE_WHATSAPP_PRO_ONLY"
}`,notes:["Campo uuid obrigatório; instanceId aceito como alias legado","Somente server_type uazapi (WhatsPRO)","Upstream: POST /instance/presence","Não confundir com send-chat-presence (indicador no chat com um contato)"]}),!t&&r&&a.jsx(Je,{className:"mb-6 border-dashed",children:a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-base",children:"Presença global (online/offline)"}),a.jsxs(ir,{children:["Disponível apenas com instâncias ",a.jsx("strong",{children:"WhatsPRO"})," (euAtendo PRO), via"," ",a.jsx("code",{className:"text-xs",children:"POST /set-instance-presence"}),". Instâncias GO não expõem este recurso na API WuzAPI."]})]})})]})}),t&&a.jsx(vs,{value:"payments",children:a.jsx(ua,{className:"h-[600px] pr-4",children:a.jsx(Yn,{method:"POST",path:"/send-request-payment",description:"Envia uma solicitação de pagamento com o botão nativo 'Revisar e Pagar' do WhatsApp. Suporta PIX, boleto, link de pagamento e anexo de documento.",curlExample:`curl --request POST \\
  --url ${e}/send-request-payment \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "amount": 199.90,
  "title": "Detalhes do pedido",
  "text": "Pedido #123 pronto para pagamento",
  "footer": "Loja Exemplo",
  "itemName": "Assinatura Plano Ouro",
  "invoiceNumber": "PED-123",
  "pixKey": "123e4567-e89b-12d3-a456-426614174000",
  "pixType": "EVP",
  "pixName": "Nome do Recebedor"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "amount": 199.90,
  "title": "Detalhes do pedido",
  "text": "Pedido #123 pronto para pagamento",
  "footer": "Loja Exemplo",
  "itemName": "Assinatura Plano Ouro",
  "invoiceNumber": "PED-123",
  "pixKey": "123e4567-e89b-12d3-a456-426614174000",
  "pixType": "EVP",
  "pixName": "Nome do Recebedor",
  "paymentLink": "https://pagamentos.exemplo.com/checkout/abc",
  "fileUrl": "https://cdn.exemplo.com/boleto-123.pdf",
  "fileName": "boleto-123.pdf",
  "boletoCode": "34191.79001 01043.510047 91020.150008 5 91070026000"
}`,responseBody:`{
  "success": true,
  "messageId": "id-da-mensagem",
  "status": "Pending",
  "chatId": "5511999999999@s.whatsapp.net"
}`,notes:["Campos obrigatórios: instanceId, number, amount","amount deve ser um número positivo (valor em BRL)","pixType aceita: CPF, CNPJ, PHONE, EMAIL, EVP (padrão EVP)","pixKey é a chave PIX do recebedor","paymentLink deve ser de domínios homologados pelo WhatsApp","fileUrl pode ser um boleto PDF ou documento de fatura","boletoCode é a linha digitável do boleto (habilita método boleto)","A instância deve estar conectada (status: connected)"]})})}),a.jsx(vs,{value:"templates",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsx(Je,{className:"mb-6 bg-primary/5 border-primary/20",children:a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"WhatsApp Cloud API - Templates"}),a.jsx(ir,{children:"Endpoints exclusivos para instâncias Cloud API (Meta). Permitem sincronizar e enviar templates aprovados."})]})}),a.jsx(Yn,{method:"POST",path:"/sync-whatsapp-templates",description:"Sincroniza os templates de mensagem do Meta Business com o sistema. Execute antes de enviar templates para garantir que estão atualizados.",curlExample:`curl --request POST \\
  --url ${e}/sync-whatsapp-templates \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia-cloudapi"
}`,responseBody:`{
  "success": true,
  "message": "Synchronized 15 templates",
  "totalFetched": 15,
  "syncedCount": 15
}`,notes:["Apenas para instâncias do tipo Cloud API (Meta)","Busca todos os templates da conta WABA configurada","Atualiza status, componentes e categoria de cada template","Remove templates que não existem mais no Meta"]}),a.jsx(Yn,{method:"POST",path:"/send-template-message",description:"Envia uma mensagem de template aprovado. Suporta variáveis de header, body e botões dinâmicos.",curlExample:`# Template simples sem variáveis
curl --request POST \\
  --url ${e}/send-template-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "templateName": "hello_world",
  "languageCode": "pt_BR"
}'

# Template com variáveis no body
curl --request POST \\
  --url ${e}/send-template-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "templateName": "order_confirmation",
  "languageCode": "pt_BR",
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "João" },
        { "type": "text", "text": "12345" },
        { "type": "text", "text": "R$ 99,90" }
      ]
    }
  ]
}'

# Template com header de imagem e variáveis
curl --request POST \\
  --url ${e}/send-template-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "templateName": "promo_image",
  "languageCode": "pt_BR",
  "components": [
    {
      "type": "header",
      "parameters": [
        { "type": "image", "image": { "link": "https://exemplo.com/promo.jpg" } }
      ]
    },
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "20%" }
      ]
    }
  ]
}'

# Template com botão de URL dinâmica
curl --request POST \\
  --url ${e}/send-template-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "templateName": "cobranca_vencida",
  "languageCode": "pt_BR",
  "components": [
    {
      "type": "header",
      "parameters": [
        { "type": "text", "text": "R$ 150,00" }
      ]
    },
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "Maria" },
        { "type": "text", "text": "R$ 150,00" },
        { "type": "text", "text": "está vencido desde 10/01" }
      ]
    },
    {
      "type": "button",
      "sub_type": "url",
      "index": 0,
      "parameters": [
        { "type": "text", "text": "abc123-fatura-id" }
      ]
    }
  ]
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "templateName": "nome_do_template",
  "languageCode": "pt_BR",
  "components": [
    {
      "type": "header",
      "parameters": [
        // Para texto: { "type": "text", "text": "valor" }
        // Para imagem: { "type": "image", "image": { "link": "https://..." } }
        // Para vídeo: { "type": "video", "video": { "link": "https://..." } }
        // Para documento: { "type": "document", "document": { "link": "https://...", "filename": "doc.pdf" } }
      ]
    },
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "variavel_1" },
        { "type": "text", "text": "variavel_2" }
      ]
    },
    {
      "type": "button",
      "sub_type": "url",
      "index": 0,  // índice do botão (0 para primeiro)
      "parameters": [
        { "type": "text", "text": "valor-dinamico-url" }
      ]
    }
  ]
}`,responseBody:`{
  "success": true,
  "messageId": "wamid.HBgMNTU5OTgyMzg1MDAwFQIAERgSNDN...",
  "template": {
    "name": "cobranca_vencida",
    "language": "pt_BR"
  },
  "raw": {
    "messaging_product": "whatsapp",
    "contacts": [{ "input": "5511999999999", "wa_id": "5511999999999" }],
    "messages": [{ "id": "wamid.HBgMNTU5OTgyMzg1MDAwFQIAERgSNDN..." }]
  }
}`,notes:["Apenas para instâncias do tipo Cloud API (Meta)","O template deve estar APROVADO no Meta Business","Execute /sync-whatsapp-templates primeiro para garantir templates atualizados","languageCode deve corresponder ao idioma do template (ex: pt_BR, en_US)","Variáveis são substituídas na ordem: {{1}}, {{2}}, {{3}}...",'Para botões dinâmicos, use type: "button" com sub_type: "url" e index do botão',"Header pode ser: TEXT (com variáveis), IMAGE, VIDEO ou DOCUMENT","O limite diário de mensagens da instância é aplicado"]}),a.jsx(Yn,{method:"POST",path:"/send-text-message",description:"Envia mensagem de texto simples via Cloud API. Funciona da mesma forma que para outras instâncias.",curlExample:`curl --request POST \\
  --url ${e}/send-text-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "text": "Olá! Esta é uma mensagem via Cloud API."
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "text": "Sua mensagem aqui"
}`,responseBody:`{
  "success": true,
  "messageId": "wamid.HBgMNTU5OTgyMzg1MDAwFQIAERgS...",
  "status": "sent",
  "chatId": "5511999999999"
}`,notes:["Funciona para instâncias Cloud API da mesma forma que PRO/GO","O número deve incluir código do país (55 para Brasil)","Limite de 4096 caracteres por mensagem"]}),a.jsx(Yn,{method:"POST",path:"/send-media-message",description:"Envia mídia (imagem, vídeo, áudio, documento) via Cloud API.",curlExample:`# Enviar imagem com legenda
curl --request POST \\
  --url ${e}/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "type": "image",
  "file": "https://exemplo.com/imagem.jpg",
  "text": "Confira nossa promoção!"
}'

# Enviar documento PDF
curl --request POST \\
  --url ${e}/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "type": "document",
  "file": "https://exemplo.com/contrato.pdf",
  "fileName": "Contrato.pdf"
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "type": "image",  // image, video, audio, document
  "file": "https://url-publica.com/arquivo.jpg",
  "text": "Legenda opcional",
  "fileName": "nome-arquivo.pdf"  // obrigatório para document
}`,responseBody:`{
  "success": true,
  "messageId": "wamid.HBgMNTU5OTgyMzg1MDAwFQIAERgS...",
  "status": "sent"
}`,notes:["Tipos suportados: image, video, audio, document","A URL deve ser pública e acessível pelo Meta","fileName é obrigatório para documentos","Legenda (text) só funciona para imagens e vídeos","Limite de 16MB para imagens, 64MB para vídeos/documentos"]})]})}),s&&a.jsx(vs,{value:"buttons",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsx(Je,{className:"mb-6 bg-orange-500/10 border-orange-500/30",children:a.jsxs(Ct,{children:[a.jsxs(Et,{className:"text-lg flex items-center gap-2",children:[a.jsx(i1,{className:"w-5 h-5 text-orange-500"}),"ZuckPRO - Botões Interativos"]}),a.jsx(ir,{children:"Endpoint exclusivo para instâncias ZuckPRO. Permite enviar mensagens com botões interativos, suportando múltiplos tipos de ação."})]})}),a.jsx(Yn,{method:"POST",path:"/send-buttons-message",description:"Envia uma mensagem interativa com botões para um contato ou grupo do WhatsApp. Suporta múltiplos tipos de botões e header com mídia.",curlExample:`# Exemplo com botões de resposta, URL e chamada
curl --request POST \\
  --url ${e}/send-buttons-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-zuckpro",
  "number": "5511999999999",
  "title": "Ofertas do Dia",
  "text": "Escolha uma ação abaixo:",
  "footer": "Equipe ZuckPRO",
  "buttons": [
    {
      "buttonId": "cta_copy_1",
      "buttonText": { "displayText": "Copiar Cupom" },
      "type": "cta_copy",
      "code": "CUPOM123"
    },
    {
      "buttonId": "cta_url_1",
      "buttonText": { "displayText": "Abrir Site" },
      "type": "cta_url",
      "url": "https://exemplo.com/oferta"
    },
    {
      "buttonId": "cta_call_1",
      "buttonText": { "displayText": "Falar com Vendas" },
      "type": "cta_call",
      "phone": "+5511988888888"
    }
  ]
}'

# Exemplo com botão PIX
curl --request POST \\
  --url ${e}/send-buttons-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-zuckpro",
  "number": "5511999999999",
  "title": "Pagamento PIX",
  "text": "Clique no botão para pagar via PIX",
  "footer": "Pagamento seguro e instantâneo",
  "buttons": [
    {
      "buttonId": "pix_btn_1",
      "buttonText": { "displayText": "Pagar com PIX" },
      "type": "pix",
      "pix_key": "11999999999",
      "merchant_name": "Minha Loja",
      "pix_type": "PHONE"
    }
  ]
}'

# Exemplo com imagem e botão
curl --request POST \\
  --url ${e}/send-buttons-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-zuckpro",
  "number": "5511999999999",
  "title": "Catálogo de Produtos",
  "text": "Confira nosso catálogo completo!",
  "footer": "Loja Exemplo",
  "image": {
    "url": "https://exemplo.com/catalogo.jpg"
  },
  "buttons": [
    {
      "buttonId": "reply_1",
      "buttonText": { "displayText": "Quero saber mais" },
      "type": "reply"
    }
  ]
}'`,requestBody:`{
  "instanceId": "uuid-da-instancia-zuckpro",
  "number": "5511999999999",
  "title": "Título da mensagem",          // opcional
  "text": "Corpo da mensagem",             // obrigatório quando não há mídia
  "footer": "Rodapé da mensagem",          // opcional
  "image": {                               // opcional - header com imagem
    "url": "https://url-da-imagem.jpg"
  },
  "buttons": [                             // obrigatório, 1-5 botões
    {
      "buttonId": "id_unico",
      "buttonText": { "displayText": "Texto do Botão" },
      "type": "reply",                     // tipo do botão (ver abaixo)
      // Campos adicionais dependem do tipo
    }
  ]
}`,responseBody:`{
  "success": true,
  "messageId": "3EB0E8102609EC734DCA5D",
  "status": "sent",
  "chatId": "5511999999999@s.whatsapp.net"
}`,notes:["Disponível APENAS para instâncias ZuckPRO","Máximo de 5 botões por mensagem","O número deve incluir código do país (55 para Brasil)","A instância deve estar conectada (status: connected)","Conta no limite diário de mensagens"]}),a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Tipos de Botões"}),a.jsx(ir,{children:"Cada tipo de botão requer campos específicos além de buttonId, buttonText e type"})]}),a.jsx(ct,{children:a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"border-b pb-3",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(_e,{variant:"secondary",children:"reply / quick_reply"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Resposta rápida"})]}),a.jsx(to,{code:`{
  "buttonId": "resposta_1",
  "buttonText": { "displayText": "Sim, tenho interesse" },
  "type": "reply"
}`}),a.jsx("p",{className:"text-xs text-muted-foreground mt-2",children:"Retorna o buttonId quando clicado"})]}),a.jsxs("div",{className:"border-b pb-3",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(_e,{variant:"secondary",children:"url / cta_url"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Abre um link"})]}),a.jsx(to,{code:`{
  "buttonId": "link_1",
  "buttonText": { "displayText": "Visitar Site" },
  "type": "cta_url",
  "url": "https://exemplo.com"
}`}),a.jsx("p",{className:"text-xs text-muted-foreground mt-2",children:"URL deve ser HTTPS"})]}),a.jsxs("div",{className:"border-b pb-3",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(_e,{variant:"secondary",children:"call / cta_call"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Inicia chamada telefônica"})]}),a.jsx(to,{code:`{
  "buttonId": "ligar_1",
  "buttonText": { "displayText": "Ligar para Vendas" },
  "type": "cta_call",
  "phone": "+5511988888888"
}`}),a.jsx("p",{className:"text-xs text-muted-foreground mt-2",children:"Telefone em formato E.164 (com +)"})]}),a.jsxs("div",{className:"border-b pb-3",children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(_e,{variant:"secondary",children:"copy / cta_copy"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Copia texto para clipboard"})]}),a.jsx(to,{code:`{
  "buttonId": "copiar_1",
  "buttonText": { "displayText": "Copiar Código" },
  "type": "cta_copy",
  "code": "DESCONTO50"
}`}),a.jsx("p",{className:"text-xs text-muted-foreground mt-2",children:"Ideal para cupons, códigos PIX, senhas"})]}),a.jsxs("div",{children:[a.jsxs("div",{className:"flex items-center gap-2 mb-2",children:[a.jsx(_e,{variant:"secondary",children:"pix / payment_info"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Botão de pagamento PIX"})]}),a.jsx(to,{code:`{
  "buttonId": "pix_1",
  "buttonText": { "displayText": "Pagar R$ 99,90" },
  "type": "pix",
  "pix_key": "email@empresa.com",
  "merchant_name": "Empresa LTDA",
  "pix_type": "EMAIL",
  "currency": "BRL",           // opcional
  "total_value": 9990,         // opcional, em centavos
  "total_offset": 100          // opcional
}`}),a.jsx("p",{className:"text-xs text-muted-foreground mt-2",children:"pix_type aceita: CPF, CNPJ, PHONE, EMAIL, EVP"})]})]})})]}),a.jsxs(Je,{className:"mb-6",children:[a.jsxs(Ct,{children:[a.jsx(Et,{className:"text-lg",children:"Header com Mídia"}),a.jsx(ir,{children:"Adicione imagem, vídeo ou documento acima dos botões"})]}),a.jsxs(ct,{children:[a.jsxs("div",{className:"space-y-4",children:[a.jsxs("div",{className:"border-b pb-3",children:[a.jsx("div",{className:"flex items-center gap-2 mb-2",children:a.jsx(_e,{variant:"outline",children:"🖼️ Imagem"})}),a.jsx(to,{code:`"image": {
  "url": "https://exemplo.com/banner.jpg"
}`})]}),a.jsxs("div",{className:"border-b pb-3",children:[a.jsx("div",{className:"flex items-center gap-2 mb-2",children:a.jsx(_e,{variant:"outline",children:"🎥 Vídeo"})}),a.jsx(to,{code:`"video": {
  "url": "https://exemplo.com/video.mp4"
}`})]}),a.jsxs("div",{children:[a.jsx("div",{className:"flex items-center gap-2 mb-2",children:a.jsx(_e,{variant:"outline",children:"📄 Documento"})}),a.jsx(to,{code:`"document": {
  "url": "https://exemplo.com/catalogo.pdf"
}`})]})]}),a.jsxs("p",{className:"text-xs text-muted-foreground mt-4",children:["Quando usar mídia, o conteúdo principal deve estar no campo ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"text"})," ou ",a.jsx("code",{className:"text-xs bg-muted px-1 rounded",children:"caption"}),"."]})]})]})]})}),o&&a.jsx(vs,{value:"sms",children:a.jsxs(ua,{className:"h-[600px] pr-4",children:[a.jsxs(Je,{className:"mb-6 border-green-500/20 bg-green-500/5",children:[a.jsxs(Ct,{children:[a.jsxs(Et,{className:"flex items-center gap-2",children:[a.jsx(en,{className:"w-5 h-5 text-green-500"}),"SmsPRO - Envio de SMS"]}),a.jsx(ir,{children:"Endpoints para envio de mensagens SMS via SmsPRO"})]}),a.jsx(ct,{children:a.jsx("p",{className:"text-sm text-muted-foreground",children:"O SmsPRO permite o envio de SMS em massa com controle de limites diários e mensais. Cada mensagem de até 160 caracteres consome 1 crédito."})})]}),a.jsx(Yn,{method:"POST",path:"/sms-send-message",description:"Envia uma mensagem SMS para um ou mais destinatários.",curlExample:`curl --request POST \\
  --url ${e}/sms-send-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instance_id": "uuid-da-instancia-sms",
  "receivers": ["5511999999999"],
  "content": "Sua mensagem SMS aqui"
}'`,requestBody:`{
  "instance_id": "uuid-da-instancia-sms",
  "receivers": ["5511999999999", "5511888888888"],
  "content": "Olá! Esta é uma mensagem de teste via SmsPRO."
}`,responseBody:`{
  "success": true,
  "requestUniqueId": "abc123-def456",
  "creditsUsed": 1
}`,notes:["O número deve incluir o código do país (55 para Brasil) + DDD + número","Mensagens de até 160 caracteres consomem 1 crédito","Acima de 160 caracteres: +1 crédito a cada 153 caracteres adicionais","O campo receivers aceita até 100 números por requisição","requestUniqueId é o protocolo para rastreamento da mensagem","Limites diários e mensais são controlados automaticamente pela instância"]}),a.jsx(Yn,{method:"POST",path:"/sms-sync-status",description:"Sincroniza o status de entrega das mensagens SMS enviadas.",curlExample:`curl --request POST \\
  --url ${e}/sms-sync-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instance_id": "uuid-da-instancia-sms"
}'`,requestBody:`{
  "instance_id": "uuid-da-instancia-sms"
}`,responseBody:`{
  "success": true,
  "synced": 15,
  "message": "Status atualizado para 15 mensagens"
}`,notes:["Consulta o relatório detalhado da Comtele e atualiza os status no banco","A API de relatórios tem cooldown de 30 segundos entre chamadas","Status possíveis: sent, delivered, error","Útil para verificar entregas após envio em massa"]}),a.jsxs(Je,{className:"mb-6",children:[a.jsx(Ct,{children:a.jsx(Et,{className:"text-base",children:"Códigos de Erro SMS"})}),a.jsx(ct,{children:a.jsxs("div",{className:"space-y-3",children:[a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-24 justify-center",children:"429"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Limite diário ou mensal de SMS atingido"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-24 justify-center",children:"404"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Instância SMS não encontrada"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-24 justify-center",children:"400"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Parâmetros inválidos (instance_id, receivers ou content ausente)"})]})]})})]})]})})]}),a.jsxs(Je,{className:"mt-8",children:[a.jsxs(Ct,{children:[a.jsx(Et,{children:"Códigos de Erro"}),a.jsx(ir,{children:"Possíveis códigos de erro retornados pela API"})]}),a.jsx(ct,{children:a.jsxs("div",{className:"space-y-3",children:[a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-16 justify-center",children:"400"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Requisição inválida - verifique os parâmetros"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-16 justify-center",children:"401"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Não autorizado - token inválido ou expirado"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-16 justify-center",children:"404"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Recurso não encontrado - instância não existe"})]}),a.jsxs("div",{className:"flex items-center gap-4",children:[a.jsx(_e,{variant:"outline",className:"w-16 justify-center",children:"500"}),a.jsx("span",{className:"text-sm text-muted-foreground",children:"Erro interno do servidor"})]})]})})]})]})})}