# REANALISE COMPLETA - API euatendo Cluster

Reanalise gerada em: 2026-07-14T19:46:40.254Z

## O que foi reanalisado

- Aba aberta no Chrome: `https://cluster.euatendo.app/dashboard/api`.
- HTML inicial, bundle JavaScript da SPA e CSS foram preservados localmente.
- Foi isolado o componente interno da documentacao (`api_docs_component_minified.js`) e extraidos novamente endpoints, abas, blocos de codigo complementares, eventos e campos.
- Com a autorizacao para copiar, foram copiados/estruturados os blocos de documentacao e exemplos visiveis no codigo da pagina; nenhum token real foi incluido.

## Resultado da reanalise

- Endpoints extraidos: **26**.
- Secoes encontradas no bundle: `Instâncias`, `Mensagens`, `Contatos`, `Webhooks`, `PIX`, `Presença`, `Pagamentos`, `Templates`, `Botões`, `SMS`.
- Abas visiveis na conta/tela capturada: `Instancias`, `Mensagens`, `Contatos`, `Webhooks`, `Templates`.
- Abas condicionais encontradas no bundle: `PIX`, `Pagamentos`, `Presenca`, `Botoes`, `SMS`.
- Blocos de codigo complementares fora dos cartoes de endpoint: **12**.
- Arquivos novos desta reanalise: `REANALISE_COMPLETA_API_EUATENDO.md`, `campos_por_endpoint.csv`, `codeblocks_complementares.json`, `api_docs_component_minified.js`.

## Mapa de permissoes por aba

| Aba | Condicao inferida no codigo | Observacao |
|---|---|---|
| Instancias | sempre | Gestao e conexao de instancias. |
| Mensagens | sempre | Texto, midia, status e verificacao de WhatsApp. |
| Contatos | sempre | Lista contatos e envia vCard quando disponivel. |
| Webhooks | `hasGoAccess` | Configuracao/consulta de webhook e eventos. |
| Templates | sempre | Cloud API/Meta, mas os endpoints exigem instancia Cloud API. |
| PIX | `hasProAccess` | Botao PIX e botao copiar para euAtendo PRO. |
| Pagamentos | `hasProAccess` | Solicitacao de pagamento nativa WhatsApp. |
| Presenca | `hasProAccess || hasGoAccess` | Indicador de digitando/gravando; presenca global so WhatsPRO. |
| Botoes | `hasZuckProAccess` | Botoes interativos exclusivos ZuckPRO. |
| SMS | permissoo `comtele` em `company_server_permissions` | SmsPRO. |

## Campos por endpoint

| Secao | Metodo | Rota | Campos no request | Campos na response |
|---|---|---|---|---|
| Instâncias | GET | `/list-instances` | - | success, instances, id, name, phoneNumber, profileName, status, serverType, createdAt, count |
| Instâncias | POST | `/create-instance` | name, serverType | success, instanceId, instanceKey, serverType, serverResponse, token, instance, id |
| Instâncias | POST | `/proxy-managed-cities` | uuid, country, state | success, cities, name, value, state, country, error |
| Instâncias | POST | `/connect-instance` | uuid, phone, proxyManaged, country, state, city | success, qrcode, pairingCode, message, serverType, raw |
| Instâncias | POST | `/check-instance-status` | instanceId | success, connected, status, profileName, profilePicUrl, phoneNumber, serverType, cached |
| Instâncias | POST | `/delete-instance` | instanceId | success, message |
| Mensagens | POST | `/send-text-message` | instanceId, number, text | success, message |
| Mensagens | POST | `/send-media-message` | instanceId, number, type, file, text, base64, mimeType, fileName | success, messageId, status, chatId |
| Mensagens | POST | `/get-message-status` | instanceId, messageId | success, serverType, message, id, fromMe, remoteJid, status, timestamp, type, content, raw, text, chatJid, senderJid |
| Mensagens | POST | `/check-number-whatsapp` | instanceId, numbers | success, serverType, results, number, exists, jid, raw |
| Contatos | POST | `/get-instance-contacts` | instanceId | success, contacts, id, name, pushName, profilePicUrl |
| Contatos | POST | `/send-contact` | instanceId, number, fullName, phoneNumber, organization, email, url | success, messageId, status, chatId, raw, chatid, content, displayName, vcard, messageType |
| Webhooks | POST | `/set-instance-webhook` | instanceId | success, config, url, events, active |
| Webhooks | POST | `/set-instance-webhook` | instanceId, webhookUrl, events, active | success, config, url, events, active |
| PIX | POST | `/send-pix-button` | instanceId, number, pixType, pixKey, pixName, amount, description | success, message |
| PIX | POST | `/send-copy-button` | instanceId, number, text, buttonText, copyContent, imageButton, footerText | success, messageId, status, chatId |
| Presença | POST | `/send-chat-presence` | uuid, number, chatId, presence | success, presence, chatId, phone, error, errorCode |
| Presença | POST | `/set-instance-presence` | uuid, presence | success, presence, error, errorCode |
| Pagamentos | POST | `/send-request-payment` | instanceId, number, amount, title, text, footer, itemName, invoiceNumber, pixKey, pixType, pixName, paymentLink, fileUrl, fileName, boletoCode | success, messageId, status, chatId |
| Templates | POST | `/sync-whatsapp-templates` | instanceId | success, message, totalFetched, syncedCount |
| Templates | POST | `/send-template-message` | instanceId, number, templateName, languageCode, components, type, parameters, text, image, link, video, document, filename, sub_type, index | success, messageId, template, name, language, raw, messaging_product, contacts, input, wa_id, messages, id |
| Templates | POST | `/send-text-message` | instanceId, number, text | success, messageId, status, chatId |
| Templates | POST | `/send-media-message` | instanceId, number, type, file, text, fileName | success, messageId, status |
| Botões | POST | `/send-buttons-message` | instanceId, number, title, text, footer, image, url, buttons, buttonId, buttonText, displayText, type | success, messageId, status, chatId |
| SMS | POST | `/sms-send-message` | instance_id, receivers, content | success, requestUniqueId, creditsUsed |
| SMS | POST | `/sms-sync-status` | instance_id | success, synced, message |

## Observacoes tecnicas importantes

- Autenticacao: `Authorization: Bearer SEU_TOKEN_API`; com JSON, usar tambem `Content-Type: application/json`.
- URL base publica: `https://apicluster.euatendo.app`.
- Identificador recomendado: `uuid` no body, usando o valor `id` retornado por `GET /list-instances`; `instanceId` permanece como alias legado nos exemplos.
- Status de instancia documentados: `pending`, `qr_code`, `connected`, `disconnected`.
- Tipos comerciais de servidor: `euAtendoPRO`, `euAtendoGO`, `ZuckPRO`, `CloudAPI`, `euAtendoPAPI`.
- Rate limit documentado: `/list-instances` 60 req/min e `/check-instance-status` 120 req/min.
- Headers de rate limit: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.

## Proxy regional gerenciado WhatsPRO

- Fluxo: criar instancia `POST /create-instance` com `serverType: euAtendoPRO`, listar cidades por `POST /proxy-managed-cities`, conectar por `POST /connect-instance` com `proxyManaged.city` usando o campo `value` da cidade.
- Pre-requisito: instancia alocada em servidor WhatsPRO com proxy regional habilitado pelo administrador em `/admin/servers`; nao e configuravel via API publica.
- Instancias euAtendo GO e demais tipos nao suportam esse recurso.
- Apos conexao bem-sucedida com `proxyManaged`, a escolha fica salva e pode ser reutilizada sem reenviar no body.
- A documentacao recomenda conferir `GET /health` com `version = 2.0.4` e `features.proxyRegional = true`.

## Webhooks

- `POST /set-instance-webhook` tem dois modos na documentacao: consultar enviando apenas `instanceId`, ou configurar enviando `webhookUrl`, `events` e `active`.
- `webhookUrl` deve ser HTTPS. Para remover: `webhookUrl` vazio, `events` vazio e `active: false`.
- Use `events: ["All"]` para receber todos os eventos.

- **Mensagens:** `Message`, `Receipt`, `UndecryptableMessage`, `MediaRetry`
- **Conexao:** `Connected`, `Disconnected`, `LoggedOut`, `ConnectFailure`, `KeepAliveRestored`, `KeepAliveTimeout`, `StreamError`, `StreamReplaced`, `ClientOutdated`, `TemporaryBan`
- **QR/Pareamento:** `QR`, `PairSuccess`, `PairError`, `QRScannedWithoutMultidevice`
- **Grupos:** `GroupInfo`, `JoinedGroup`
- **Chamadas:** `CallOffer`, `CallAccept`, `CallTerminate`, `CallOfferNotice`, `CallRelayLatency`
- **Presenca:** `Presence`, `ChatPresence`
- **Perfil:** `Picture`, `PushNameSetting`, `UserAbout`, `PrivacySettings`
- **Newsletter:** `NewsletterJoin`, `NewsletterLeave`, `NewsletterMuteChange`, `NewsletterLiveUpdate`
- **Bloqueio:** `BlocklistChange`, `Blocklist`
- **Sincronizacao:** `AppState`, `AppStateSyncComplete`, `HistorySync`, `OfflineSyncCompleted`, `OfflineSyncPreview`
- **Outros:** `IdentityChange`, `FBMessage`, `All`

Payload de exemplo copiado da documentacao:

```json
{
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
}
```

## Presenca

- `POST /send-chat-presence`: envia indicador de `composing`, `recording` ou `paused`; nao consome limite diario/mensal de mensagens.
- Suporte: WhatsPRO, euAtendo GO e ZuckPRO. Cloud API e PAPI retornam `PRESENCE_UNSUPPORTED_SERVER`.
- Fluxo recomendado: `composing` -> enviar mensagem/midia -> `paused`.
- Em grupos, usar `number` ou `chatId` no formato `id@g.us`.
- `POST /set-instance-presence`: presenca global online/offline, exclusiva WhatsPRO (`available`/`unavailable`).

| Campo API | WhatsPRO | euAtendo GO / ZuckPRO |
|---|---|---|
| `composing` | `number + presence`, delay opcional | `Phone + State: composing` |
| `recording` | `presence: recording` | `Phone + State: composing + Media: audio` |
| `paused` | `presence: paused` | `Phone + State: paused` |
| Destino | `number` ou `chatId` JID | `number` ou `chatId` vira `Phone` |
| Upstream | `POST /message/presence` | `POST /chat/presence` |

## ZuckPRO - tipos de botoes

- Endpoint: `POST /send-buttons-message`.
- Exclusivo para instancias ZuckPRO.
- Maximo de 5 botoes por mensagem.
- Tipos identificados: `reply/quick_reply`, `url/cta_url`, `call/cta_call`, `copy/cta_copy`, `pix/payment_info`.

**Tipos de Botões > Cada tipo de botão requer campos específicos além de buttonId, buttonText e type > reply / quick_reply > Resposta rápida**

```json
{
  "buttonId": "resposta_1",
  "buttonText": { "displayText": "Sim, tenho interesse" },
  "type": "reply"
}
```

**Resposta rápida > Retorna o buttonId quando clicado > url / cta_url > Abre um link**

```json
{
  "buttonId": "link_1",
  "buttonText": { "displayText": "Visitar Site" },
  "type": "cta_url",
  "url": "https://exemplo.com"
}
```

**Abre um link > URL deve ser HTTPS > call / cta_call > Inicia chamada telefônica**

```json
{
  "buttonId": "ligar_1",
  "buttonText": { "displayText": "Ligar para Vendas" },
  "type": "cta_call",
  "phone": "+5511988888888"
}
```

**Inicia chamada telefônica > Telefone em formato E.164 (com +) > copy / cta_copy > Copia texto para clipboard**

```json
{
  "buttonId": "copiar_1",
  "buttonText": { "displayText": "Copiar Código" },
  "type": "cta_copy",
  "code": "DESCONTO50"
}
```

**Copia texto para clipboard > Ideal para cupons, códigos PIX, senhas > pix / payment_info > Botão de pagamento PIX**

```json
{
  "buttonId": "pix_1",
  "buttonText": { "displayText": "Pagar R$ 99,90" },
  "type": "pix",
  "pix_key": "email@empresa.com",
  "merchant_name": "Empresa LTDA",
  "pix_type": "EMAIL",
  "currency": "BRL",           // opcional
  "total_value": 9990,         // opcional, em centavos
  "total_offset": 100          // opcional
}
```

**pix_type aceita: CPF, CNPJ, PHONE, EMAIL, EVP > Header com Mídia > Adicione imagem, vídeo ou documento acima dos botões > 🖼️ Imagem**

```json
"image": {
  "url": "https://exemplo.com/banner.jpg"
}
```

**Header com Mídia > Adicione imagem, vídeo ou documento acima dos botões > 🖼️ Imagem > 🎥 Vídeo**

```json
"video": {
  "url": "https://exemplo.com/video.mp4"
}
```

**Adicione imagem, vídeo ou documento acima dos botões > 🖼️ Imagem > 🎥 Vídeo > 📄 Documento**

```json
"document": {
  "url": "https://exemplo.com/catalogo.pdf"
}
```

## SMS

- `POST /sms-send-message`: envia SMS para um ou mais destinatarios.
- Numero deve incluir pais + DDD + numero; no Brasil, comeca com `55`.
- Ate 160 caracteres consome 1 credito; acima disso, +1 credito a cada 153 caracteres adicionais.
- `receivers` aceita ate 100 numeros por requisicao.
- `requestUniqueId` e o protocolo de rastreamento.
- `POST /sms-sync-status`: consulta relatorio Comtele e atualiza status; cooldown de 30 segundos.
- Status SMS documentados: `sent`, `delivered`, `error`.
- Erros SMS: `429` limite diario/mensal atingido; `404` instancia SMS nao encontrada; `400` parametros invalidos.

## Codigos de erro gerais

| Codigo | Significado |
|---|---|
| 400 | Requisicao invalida; verificar parametros. |
| 401 | Nao autorizado; token invalido ou expirado. |
| 404 | Recurso nao encontrado; instancia nao existe. |
| 429 | Rate limit ou limite operacional atingido, conforme endpoint. |
| 500 | Erro interno do servidor. |

## Arquivos de evidencia

- `prints/00_estado_inicial.png`: estado inicial da aba.
- `prints/01_*` a `prints/05_*`: abas visiveis com topo e rolagem.
- `api_docs_component_minified.js`: componente isolado da documentacao.
- `codeblocks_complementares.json`: blocos copiados que nao pertencem diretamente aos 26 cards de endpoint.
- `campos_por_endpoint.csv`: inventario de campos.
