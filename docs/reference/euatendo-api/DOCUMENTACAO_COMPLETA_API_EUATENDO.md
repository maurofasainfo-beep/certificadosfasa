# Documenta??o Completa da API euatendo Cluster

Fonte analisada: https://cluster.euatendo.app/dashboard/api

URL base da API p?blica: `https://apicluster.euatendo.app`

Extra?do em: 2026-07-14T19:37:18.845Z

## Escopo e evid?ncias

- A aba aberta no Chrome foi analisada e teve prints salvos em `prints/`.
- A p?gina carrega a documenta??o por SPA; foram salvos `pagina_api.html`, `index-CMYpy3gY.js` e `index-BFHuvWR4.css`.
- Foram extra?dos 26 blocos de endpoint do componente de documenta??o do bundle JavaScript.
- Abas vis?veis na sess?o atual: `Instâncias`, `Mensagens`, `Contatos`, `Webhooks`, `Templates`.
- O bundle tamb?m cont?m se??es condicionais por permiss?o/plano: `PIX`, `Pagamentos`, `Presença`, `Botões`, `SMS`. Elas foram inclu?das porque fazem parte da documenta??o da aplica??o, mesmo que n?o apare?am para toda conta.

## Autentica??o

Todas as requisi??es devem enviar o token da API no header `Authorization`. Para requisi??es com corpo JSON, enviar tamb?m `Content-Type: application/json`.

```json
{
  "Authorization": "Bearer SEU_TOKEN_API",
  "Content-Type": "application/json"
}
```
O token ? obtido na tela de Configura??es da API dentro do dashboard. N?o foi copiado nenhum token real para esta documenta??o.

## Identificador da inst?ncia

Use o campo `uuid` no body, com valor igual ao `id` retornado por `GET /list-instances`. O nome `instanceId` continua aceito como alias legado nos exemplos da documenta??o.

## URL Base

```text
https://apicluster.euatendo.app
```
A API p?blica segue o mesmo padr?o de rotas das Functions do Supabase, por exemplo `/send-text-message`, `/send-chat-presence`, `/create-instance`, `/proxy-managed-cities` e `/check-instance-status`. A documenta??o tamb?m cita rotas legadas em `/functions/v1/...` com o mesmo comportamento.

## Rate Limits

| Endpoint | Limite | Janela |
|---|---:|---|
| `/list-instances` | 60 requisi??es | 1 minuto |
| `/check-instance-status` | 120 requisi??es | 1 minuto |

Resposta quando o limite ? excedido (HTTP 429):

```json
{
  "error": "Rate limit exceeded",
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "currentCount": 60,
  "maxRequests": 60,
  "resetAt": "2026-01-27T10:05:00Z",
  "retryAfter": 30
}
```
Headers de rate limit retornados pela API:

- `X-RateLimit-Limit`: limite m?ximo de requisi??es.
- `X-RateLimit-Remaining`: requisi??es restantes na janela.
- `X-RateLimit-Reset`: data/hora de reset da janela em ISO 8601.
- `Retry-After`: segundos at? liberar, apenas em HTTP 429.

## ?ndice de Endpoints

| Se??o | M?todo | Rota | Descri??o |
|---|---|---|---|
| Instâncias | GET | `/list-instances` | Lista todas as instâncias da empresa com seus dados principais. |
| Instâncias | POST | `/create-instance` | Cria uma nova instância. Opcionalmente permite escolher o tipo de servidor. |
| Instâncias | POST | `/proxy-managed-cities` | Lista cidades disponíveis no proxy regional gerenciado WhatsPRO para uma instância. Chame após create-instance e antes de connect-instance quando quiser usar proxy. |
| Instâncias | POST | `/connect-instance` | Conecta uma instância ao WhatsApp. Retorna QR Code ou código de pareamento. Se já estiver conectada, retorna sucesso imediatamente. Instâncias WhatsPRO podem enviar proxyManaged opcional (ver seção acima). |
| Instâncias | POST | `/check-instance-status` | Verifica o status atual de uma instância e atualiza os dados do perfil conectado. |
| Instâncias | POST | `/delete-instance` | Deleta uma instância e remove do banco de dados. |
| Mensagens | POST | `/send-text-message` | Envia uma mensagem de texto simples. |
| Mensagens | POST | `/send-media-message` | Envia uma mensagem com mídia (imagem, vídeo, áudio ou documento). Suporta URL, Base64 ou upload de arquivo. |
| Mensagens | POST | `/get-message-status` | Obtém o status ou histórico de mensagens. Funciona de forma diferente para cada tipo de servidor. |
| Mensagens | POST | `/check-number-whatsapp` | Verifica se um ou mais números de telefone possuem WhatsApp válido. |
| Contatos | POST | `/get-instance-contacts` | Retorna a lista de contatos salvos na instância do WhatsApp. |
| Contatos | POST | `/send-contact` | Envia um contato (vCard) para um número de WhatsApp. Disponível apenas para euAtendo PRO. |
| Webhooks | POST | `/set-instance-webhook` | Obtém a configuração atual do webhook da instância. Envie apenas o instanceId para consultar. |
| Webhooks | POST | `/set-instance-webhook` | Configura o webhook para receber eventos da instância do WhatsApp. |
| PIX | POST | `/send-pix-button` | Envia uma mensagem com botão de pagamento PIX. |
| PIX | POST | `/send-copy-button` | Envia uma mensagem com botão de copiar texto. Útil para enviar códigos PIX, cupons, senhas temporárias, etc. Suporta imagem opcional via URL ou upload de arquivo. |
| Presença | POST | `/send-chat-presence` | Envia presença no chat (digitando, gravando áudio ou parar o indicador). Disponível para instâncias WhatsPRO, euAtendo GO e ZuckPRO. Não consome limite diário/mensal de mensagens. |
| Presença | POST | `/set-instance-presence` | Define se a conta WhatsPRO aparece online (available) ou offline (unavailable) no WhatsApp. Exclusivo euAtendo PRO — a API GO não possui endpoint equivalente. |
| Pagamentos | POST | `/send-request-payment` | Envia uma solicitação de pagamento com o botão nativo 'Revisar e Pagar' do WhatsApp. Suporta PIX, boleto, link de pagamento e anexo de documento. |
| Templates | POST | `/sync-whatsapp-templates` | Sincroniza os templates de mensagem do Meta Business com o sistema. Execute antes de enviar templates para garantir que estão atualizados. |
| Templates | POST | `/send-template-message` | Envia uma mensagem de template aprovado. Suporta variáveis de header, body e botões dinâmicos. |
| Templates | POST | `/send-text-message` | Envia mensagem de texto simples via Cloud API. Funciona da mesma forma que para outras instâncias. |
| Templates | POST | `/send-media-message` | Envia mídia (imagem, vídeo, áudio, documento) via Cloud API. |
| Botões | POST | `/send-buttons-message` | Envia uma mensagem interativa com botões para um contato ou grupo do WhatsApp. Suporta múltiplos tipos de botões e header com mídia. |
| SMS | POST | `/sms-send-message` | Envia uma mensagem SMS para um ou mais destinatários. |
| SMS | POST | `/sms-sync-status` | Sincroniza o status de entrega das mensagens SMS enviadas. |

## Endpoints Detalhados

### Instâncias

#### GET /list-instances

Lista todas as instâncias da empresa com seus dados principais.

**cURL**

```bash
curl --request GET \\
  --url https://apicluster.euatendo.app/list-instances \\
  --header 'Authorization: Bearer SEU_TOKEN_API'
```
**Response**

```json
{
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
}
```
**Observa??es**

- Retorna todas as instâncias da empresa autenticada
- O status pode ser: pending, qr_code, connected, disconnected
- serverType usa nomes comerciais: euAtendoPRO, euAtendoGO, ZuckPRO, CloudAPI, euAtendoPAPI

#### POST /create-instance

Cria uma nova instância. Opcionalmente permite escolher o tipo de servidor.

**cURL**

```bash
# Alocação automática (padrão)
curl --request POST \\
  --url https://apicluster.euatendo.app/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia"
}'

# Escolhendo euAtendoPRO
curl --request POST \\
  --url https://apicluster.euatendo.app/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia",
  "serverType": "euAtendoPRO"
}'

# Escolhendo euAtendoGO
curl --request POST \\
  --url https://apicluster.euatendo.app/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia",
  "serverType": "euAtendoGO"
}'

# Escolhendo ZuckPRO (suporte a botões interativos)
curl --request POST \\
  --url https://apicluster.euatendo.app/create-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "name": "minha-instancia",
  "serverType": "ZuckPRO"
}'
```
**Request Body**

```json
{
  "name": "nome-da-instancia",
  "serverType": "euAtendoPRO" // opcional: "euAtendoPRO", "euAtendoGO", "ZuckPRO" ou omitir para automático
}
```
**Response**

```json
{
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
}
```
**Observa??es**

- O name é obrigatório e será o nome de identificação da instância
- serverType é opcional: "euAtendoPRO", "euAtendoGO" ou "ZuckPRO"
- ZuckPRO suporta botões interativos exclusivos (cta_url, cta_call, cta_copy, pix)
- Se serverType não for informado, o sistema escolhe automaticamente via balanceamento de carga
- O tipo de servidor disponível depende do plano contratado
- O instanceId retornado deve ser usado nas demais operações

#### POST /proxy-managed-cities

Lista cidades disponíveis no proxy regional gerenciado WhatsPRO para uma instância. Chame após create-instance e antes de connect-instance quando quiser usar proxy.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/proxy-managed-cities \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-da-instancia",
  "country": "br",
  "state": "sp"
}'
```
**Request Body**

```json
{
  "uuid": "uuid-da-instancia",       // ou instanceId (alias legado)
  "country": "br",                   // opcional, padrão br
  "state": "sp"                      // UF em minúsculas (obrigatório para filtrar cidades)
}
```
**Response**

```json
{
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
}
```
**Observa??es**

- Disponível apenas para instâncias WhatsPRO em servidores com proxy regional habilitado
- A instância deve existir no WhatsPRO (create-instance concluído) antes de listar cidades
- Use o campo value (não name) em proxyManaged.city no connect-instance
- Respostas são cacheadas no cluster por ~1 hora por país/servidor
- HTTP 502 se a WhatsPRO falhar ao listar cidades upstream

#### POST /connect-instance

Conecta uma instância ao WhatsApp. Retorna QR Code ou código de pareamento. Se já estiver conectada, retorna sucesso imediatamente. Instâncias WhatsPRO podem enviar proxyManaged opcional (ver seção acima).

**cURL**

```bash
# Conexão padrão (QR Code ou pareamento)
curl --request POST \\
  --url https://apicluster.euatendo.app/connect-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "uuid-da-instancia",
  "phone": "5511999999999"
}'

# Conexão WhatsPRO com proxy regional (QR Code)
curl --request POST \\
  --url https://apicluster.euatendo.app/connect-instance \\
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
  --url https://apicluster.euatendo.app/connect-instance \\
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
}'
```
**Request Body**

```json
{
  "uuid": "uuid-da-instancia",       // ou instanceId (alias legado)
  "phone": "5511999999999",         // opcional — pareamento por código
  "proxyManaged": {                  // opcional — somente WhatsPRO + servidor com proxy regional
    "country": "br",
    "state": "sp",
    "city": "campinas"               // value retornado por /proxy-managed-cities
  }
}
```
**Response**

```json
// Resposta com QR Code
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
}
```
**Observa??es**

- Se a instância já estiver conectada, retorna success: true com a mensagem "WhatsApp já está conectado"
- Se o phone for informado, retorna um código de pareamento (pairingCode) ao invés do QR Code
- O QR Code retorna em base64 e deve ser exibido para o usuário escanear com o WhatsApp
- O status da instância é atualizado automaticamente: "connected" se já conectado, "qr_code" se aguardando leitura
- serverType indica o tipo de servidor: "pro" (euAtendo PRO / WhatsPRO) ou "go" (euAtendo GO)
- proxyManaged é opcional; omitir mantém o connect normal em qualquer tipo de servidor
- proxyManaged só é aplicado em instâncias WhatsPRO alocadas em servidor com proxy regional habilitado
- Após connect bem-sucedido com proxyManaged, a escolha é persistida — reconexões podem omitir proxyManaged no body
- Alias legado com mesmo comportamento: POST /connect-uazapi-instance
- euAtendo GO não suporta proxy regional — use connect sem proxyManaged

#### POST /check-instance-status

Verifica o status atual de uma instância e atualiza os dados do perfil conectado.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/check-instance-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia"
}
```
**Response**

```json
{
  "success": true,
  "connected": true,
  "status": "connected",
  "profileName": "Nome do Perfil",
  "profilePicUrl": "https://...",
  "phoneNumber": "5511999999999",
  "serverType": "euAtendoPRO",
  "cached": false
}
```
**Observa??es**

- Rate limit: 120 req/min por empresa + 4 req/min por instância
- Respostas são cacheadas por 30 segundos para evitar sobrecarga
- O campo "cached" indica se o resultado veio do cache
- serverType usa nomes comerciais: euAtendoPRO, euAtendoGO, ZuckPRO, CloudAPI, euAtendoPAPI

#### POST /delete-instance

Deleta uma instância e remove do banco de dados.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/delete-instance \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia"
}
```
**Response**

```json
{
  "success": true,
  "message": "Instância deletada com sucesso"
}
```
**Observa??es**

- Esta ação é irreversível
- A instância será desconectada do WhatsApp e removida do sistema

### Mensagens

#### POST /send-text-message

Envia uma mensagem de texto simples.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/send-text-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "text": "Olá, esta é uma mensagem de teste!"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "text": "Olá, esta é uma mensagem de teste!"
}
```
**Response**

```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso"
}
```
**Observa??es**

- O número deve incluir o código do país (55 para Brasil)
- A instância deve estar conectada (status: connected)
- Para exibir "digitando…" antes do envio, use POST /send-chat-presence (aba Presença) com presence: composing

#### POST /send-media-message

Envia uma mensagem com mídia (imagem, vídeo, áudio ou documento). Suporta URL, Base64 ou upload de arquivo.

**cURL**

```bash
# Opção 1: JSON com URL
curl --request POST \\
  --url https://apicluster.euatendo.app/send-media-message \\
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
  --url https://apicluster.euatendo.app/send-media-message \\
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
  --url https://apicluster.euatendo.app/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --form 'instanceId=uuid-da-instancia' \\
  --form 'number=5511999999999' \\
  --form 'type=image' \\
  --form 'file=@/caminho/para/imagem.jpg' \\
  --form 'text=Legenda opcional'
```
**Request Body**

```json
// Opção 1: JSON com URL
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
// - text: "Legenda opcional"
```
**Response**

```json
{
  "success": true,
  "messageId": "id-da-mensagem",
  "status": "sent",
  "chatId": "chat-id"
}
```
**Observa??es**

- Tipos suportados: image, video, audio, document, myaudio, ptt, ptv, sticker
- Opção 1 (URL): file deve ser uma URL pública acessível
- Opção 2 (Base64): base64 é o conteúdo do arquivo em base64, mimeType define o tipo (ex: application/pdf)
- Opção 3 (FormData): arquivo é enviado para storage automaticamente
- fileName é opcional mas recomendado para documentos (define nome no WhatsApp)
- Limite de 50MB para upload de arquivos
- text/caption só é suportado para imagens e vídeos

#### POST /get-message-status

Obtém o status ou histórico de mensagens. Funciona de forma diferente para cada tipo de servidor.

**cURL**

```bash
# euAtendo PRO - busca status por ID da mensagem
curl --request POST \\
  --url https://apicluster.euatendo.app/get-message-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "messageId": "3EB0E8102609EC734DCA5D"
}'

# euAtendo GO - busca histórico por JID do contato
curl --request POST \\
  --url https://apicluster.euatendo.app/get-message-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "messageId": "559982385000@s.whatsapp.net"
}'
```
**Request Body**

```json
// euAtendo PRO - busca status por ID da mensagem
{
  "instanceId": "uuid-da-instancia",
  "messageId": "3EB0E8102609EC734DCA5D"
}

// euAtendo GO - busca histórico por JID do contato
{
  "instanceId": "uuid-da-instancia",
  "messageId": "559982385000@s.whatsapp.net"
}
```
**Response**

```json
// Resposta euAtendo PRO
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
}
```
**Observa??es**

- euAtendo PRO: messageId é o ID da mensagem retornado ao enviar
- euAtendo GO: messageId é o JID do contato (ex: 559982385000@s.whatsapp.net)
- O campo serverType indica o tipo de servidor: "pro" ou "go"
- O campo raw contém a resposta completa do servidor para debugging
- euAtendo PRO: Status possíveis: PENDING, SENT, DELIVERED, READ, PLAYED, ERROR
- euAtendo GO: Retorna histórico de mensagens do contato (últimas 100)

#### POST /check-number-whatsapp

Verifica se um ou mais números de telefone possuem WhatsApp válido.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/check-number-whatsapp \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "numbers": [
    "5511999998888",
    "5521988887777"
  ]
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia",
  "numbers": [
    "5511999998888",
    "5521988887777",
    "5531977776666"
  ]
}
```
**Response**

```json
{
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
}
```
**Observa??es**

- Permite verificar múltiplos números em uma única requisição
- Cada número deve ter entre 10-15 dígitos (apenas números)
- O campo exists indica se o número possui WhatsApp ativo
- O campo jid é retornado apenas quando exists é true
- O campo serverType indica o tipo de servidor: "pro" ou "go"
- O campo raw contém a resposta completa do servidor para debugging

### Contatos

#### POST /get-instance-contacts

Retorna a lista de contatos salvos na instância do WhatsApp.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/get-instance-contacts \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia"
}
```
**Response**

```json
{
  "success": true,
  "contacts": [
    {
      "id": "5511999999999@s.whatsapp.net",
      "name": "Nome do Contato",
      "pushName": "Nome de Exibição",
      "profilePicUrl": "https://..."
    }
  ]
}
```
**Observa??es**

- Retorna apenas contatos sincronizados com o WhatsApp
- O id do contato está no formato JID do WhatsApp

#### POST /send-contact

Envia um contato (vCard) para um número de WhatsApp. Disponível apenas para euAtendo PRO.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/send-contact \\
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
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "fullName": "João Silva",
  "phoneNumber": "5511888888888,5521777777777",
  "organization": "Empresa XYZ",
  "email": "joao@empresa.com",
  "url": "https://empresa.com/joao"
}
```
**Response**

```json
{
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
}
```
**Observa??es**

- number é o destinatário que receberá o contato (com código do país)
- fullName é o nome completo do contato a ser enviado (obrigatório)
- phoneNumber são os telefones do contato, separados por vírgula para múltiplos (obrigatório)
- organization, email e url são campos opcionais do vCard
- Disponível apenas para instâncias euAtendo PRO
- A instância deve estar conectada (status: connected)
- Conta no limite diário de mensagens

### Webhooks

#### POST /set-instance-webhook

Obtém a configuração atual do webhook da instância. Envie apenas o instanceId para consultar.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/set-instance-webhook \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia"
}
```
**Response**

```json
{
  "success": true,
  "config": {
    "url": "https://seu-servidor.com/webhook",
    "events": ["Message", "Receipt"],
    "active": true
  }
}
```
**Observa??es**

- Este endpoint funciona em dois modos: GET (consulta) e SET (configuração)
- Para consultar, envie apenas o instanceId
- Disponível para instâncias compatíveis: euAtendoGO, WhatsPRO, euAtendoPAPI e ZuckPRO

#### POST /set-instance-webhook

Configura o webhook para receber eventos da instância do WhatsApp.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/set-instance-webhook \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia",
  "webhookUrl": "https://seu-servidor.com/webhook",
  "events": ["Message", "Receipt", "Connected"],
  "active": true
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia",
  "webhookUrl": "https://seu-servidor.com/webhook",
  "events": ["Message", "Receipt", "Connected"],
  "active": true
}
```
**Response**

```json
{
  "success": true,
  "config": {
    "url": "https://seu-servidor.com/webhook",
    "events": ["Message", "Receipt", "Connected"],
    "active": true
  }
}
```
**Observa??es**

- webhookUrl deve ser uma URL HTTPS válida
- active: true para ativar, false para desativar
- Use ["All"] no events para receber todos os eventos
- Para remover webhook, envie webhookUrl vazio, events vazio e active: false

### PIX

#### POST /send-pix-button

Envia uma mensagem com botão de pagamento PIX.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/send-pix-button \\
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
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia",
  "number": "5511999999999",
  "pixType": "EVP", // CPF, CNPJ, PHONE, EMAIL, EVP
  "pixKey": "123e4567-e89b-12d3-a456-426614174000",
  "pixName": "Nome do Recebedor",
  "amount": 150.50, // opcional
  "description": "Pagamento do pedido #123" // opcional
}
```
**Response**

```json
{
  "success": true,
  "message": "Mensagem PIX enviada com sucesso"
}
```
**Observa??es**

- pixType aceita: CPF, CNPJ, PHONE, EMAIL, EVP (case insensitive)
- EVP é a chave aleatória do PIX
- amount e description são opcionais

#### POST /send-copy-button

Envia uma mensagem com botão de copiar texto. Útil para enviar códigos PIX, cupons, senhas temporárias, etc. Suporta imagem opcional via URL ou upload de arquivo.

**cURL**

```bash
# Envio com URL de imagem externa
curl --request POST \\
  --url https://apicluster.euatendo.app/send-copy-button \\
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
  --url https://apicluster.euatendo.app/send-copy-button \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --form 'instanceId=uuid-da-instancia' \\
  --form 'number=5511999999999' \\
  --form 'text=Aqui está seu código PIX:' \\
  --form 'buttonText=Copiar Código PIX' \\
  --form 'copyContent=00020126580014BR.GOV.BCB.PIX...' \\
  --form 'footerText=Clique para copiar' \\
  --form 'image=@/caminho/para/imagem.jpg'
```
**Request Body**

```json
{
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
// - image: arquivo de imagem (JPG, PNG, WEBP, GIF)
```
**Response**

```json
{
  "success": true,
  "messageId": "id-da-mensagem",
  "status": "sent",
  "chatId": "5511999999999@s.whatsapp.net"
}
```
**Observa??es**

- Disponível apenas para instâncias euAtendo PRO
- copyContent é o texto que será copiado ao clicar no botão
- Limite de 4096 caracteres para copyContent
- imageButton: URL externa da imagem (opcional)
- image: campo para upload de arquivo via multipart/form-data (alternativo ao imageButton)
- Limite de 5MB para upload de imagem. Formatos: JPG, PNG, WEBP, GIF
- Arquivos enviados são armazenados automaticamente no servidor
- A mensagem pode aparecer como "Não é possível exibir no WhatsApp Web"
- A instância deve estar conectada (status: connected)

### Presença

#### POST /send-chat-presence

Envia presença no chat (digitando, gravando áudio ou parar o indicador). Disponível para instâncias WhatsPRO, euAtendo GO e ZuckPRO. Não consome limite diário/mensal de mensagens.

**cURL**

```bash
r&&!t?`curl --request POST \\
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
}'`
```
**Request Body**

```json
{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",  // obrigatório (alias: instanceId)
  "number": "5511999999999",          // obrigatório se chatId omitido
  "chatId": "5511999999999@s.whatsapp.net",  // opcional (alternativa a number)
  "presence": "composing"  // composing | recording | paused
}
```
**Response**

```json
// WhatsPRO (resposta inclui chatId)
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
}
```
**Observa??es**

- Campo uuid = id da instância em /list-instances; instanceId aceito como alias
- Instância deve estar connected
- Grupos: use number ou chatId no formato id@g.us
- Fluxo recomendado: composing → POST /send-text-message (ou mídia) → paused
- O indicador expira no WhatsApp; reenvie composing em respostas longas
- Cloud API e PAPI: errorCode PRESENCE_UNSUPPORTED_SERVER
- r?"GO upstream: POST /chat/presence com { Phone, State } — Media só em recording":""
- t?"WhatsPRO: upstream POST /message/presence (number, presence, delay opcional)":""
- delay (ms) opcional no body repassado ao uazapiGO"].filter(Boolea

#### POST /set-instance-presence

Define se a conta WhatsPRO aparece online (available) ou offline (unavailable) no WhatsApp. Exclusivo euAtendo PRO — a API GO não possui endpoint equivalente.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/set-instance-presence \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",
  "presence": "available"
}'
```
**Request Body**

```json
{
  "uuid": "fea7393c-61d3-4fa2-9b40-d2309f7d4e21",  // alias: instanceId
  "presence": "available"  // available | unavailable
}
```
**Response**

```json
{
  "success": true,
  "presence": "available"
}

// Instância euAtendo GO
{
  "success": false,
  "error": "Disponível apenas para instâncias WhatsPRO (euAtendo PRO)",
  "errorCode": "PRESENCE_WHATSAPP_PRO_ONLY"
}
```
**Observa??es**

- Campo uuid obrigatório; instanceId aceito como alias legado
- Somente server_type uazapi (WhatsPRO)
- Upstream: POST /instance/presence
- Não confundir com send-chat-presence (indicador no chat com um contato)

### Pagamentos

#### POST /send-request-payment

Envia uma solicitação de pagamento com o botão nativo 'Revisar e Pagar' do WhatsApp. Suporta PIX, boleto, link de pagamento e anexo de documento.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/send-request-payment \\
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
}'
```
**Request Body**

```json
{
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
}
```
**Response**

```json
{
  "success": true,
  "messageId": "id-da-mensagem",
  "status": "Pending",
  "chatId": "5511999999999@s.whatsapp.net"
}
```
**Observa??es**

- Campos obrigatórios: instanceId, number, amount
- amount deve ser um número positivo (valor em BRL)
- pixType aceita: CPF, CNPJ, PHONE, EMAIL, EVP (padrão EVP)
- pixKey é a chave PIX do recebedor
- paymentLink deve ser de domínios homologados pelo WhatsApp
- fileUrl pode ser um boleto PDF ou documento de fatura
- boletoCode é a linha digitável do boleto (habilita método boleto)
- A instância deve estar conectada (status: connected)

### Templates

#### POST /sync-whatsapp-templates

Sincroniza os templates de mensagem do Meta Business com o sistema. Execute antes de enviar templates para garantir que estão atualizados.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/sync-whatsapp-templates \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia-cloudapi"
}
```
**Response**

```json
{
  "success": true,
  "message": "Synchronized 15 templates",
  "totalFetched": 15,
  "syncedCount": 15
}
```
**Observa??es**

- Apenas para instâncias do tipo Cloud API (Meta)
- Busca todos os templates da conta WABA configurada
- Atualiza status, componentes e categoria de cada template
- Remove templates que não existem mais no Meta

#### POST /send-template-message

Envia uma mensagem de template aprovado. Suporta variáveis de header, body e botões dinâmicos.

**cURL**

```bash
# Template simples sem variáveis
curl --request POST \\
  --url https://apicluster.euatendo.app/send-template-message \\
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
  --url https://apicluster.euatendo.app/send-template-message \\
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
  --url https://apicluster.euatendo.app/send-template-message \\
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
  --url https://apicluster.euatendo.app/send-template-message \\
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
}'
```
**Request Body**

```json
{
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
}
```
**Response**

```json
{
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
}
```
**Observa??es**

- Apenas para instâncias do tipo Cloud API (Meta)
- O template deve estar APROVADO no Meta Business
- Execute /sync-whatsapp-templates primeiro para garantir templates atualizados
- languageCode deve corresponder ao idioma do template (ex: pt_BR, en_US)
- Variáveis são substituídas na ordem: {{1}}, {{2}}, {{3}}...
- Para botões dinâmicos, use type: "button" com sub_type: "url" e index do botão
- Header pode ser: TEXT (com variáveis), IMAGE, VIDEO ou DOCUMENT
- O limite diário de mensagens da instância é aplicado

#### POST /send-text-message

Envia mensagem de texto simples via Cloud API. Funciona da mesma forma que para outras instâncias.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/send-text-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "text": "Olá! Esta é uma mensagem via Cloud API."
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "text": "Sua mensagem aqui"
}
```
**Response**

```json
{
  "success": true,
  "messageId": "wamid.HBgMNTU5OTgyMzg1MDAwFQIAERgS...",
  "status": "sent",
  "chatId": "5511999999999"
}
```
**Observa??es**

- Funciona para instâncias Cloud API da mesma forma que PRO/GO
- O número deve incluir código do país (55 para Brasil)
- Limite de 4096 caracteres por mensagem

#### POST /send-media-message

Envia mídia (imagem, vídeo, áudio, documento) via Cloud API.

**cURL**

```bash
# Enviar imagem com legenda
curl --request POST \\
  --url https://apicluster.euatendo.app/send-media-message \\
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
  --url https://apicluster.euatendo.app/send-media-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "type": "document",
  "file": "https://exemplo.com/contrato.pdf",
  "fileName": "Contrato.pdf"
}'
```
**Request Body**

```json
{
  "instanceId": "uuid-da-instancia-cloudapi",
  "number": "5511999999999",
  "type": "image",  // image, video, audio, document
  "file": "https://url-publica.com/arquivo.jpg",
  "text": "Legenda opcional",
  "fileName": "nome-arquivo.pdf"  // obrigatório para document
}
```
**Response**

```json
{
  "success": true,
  "messageId": "wamid.HBgMNTU5OTgyMzg1MDAwFQIAERgS...",
  "status": "sent"
}
```
**Observa??es**

- Tipos suportados: image, video, audio, document
- A URL deve ser pública e acessível pelo Meta
- fileName é obrigatório para documentos
- Legenda (text) só funciona para imagens e vídeos
- Limite de 16MB para imagens, 64MB para vídeos/documentos

### Botões

#### POST /send-buttons-message

Envia uma mensagem interativa com botões para um contato ou grupo do WhatsApp. Suporta múltiplos tipos de botões e header com mídia.

**cURL**

```bash
# Exemplo com botões de resposta, URL e chamada
curl --request POST \\
  --url https://apicluster.euatendo.app/send-buttons-message \\
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
  --url https://apicluster.euatendo.app/send-buttons-message \\
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
  --url https://apicluster.euatendo.app/send-buttons-message \\
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
}'
```
**Request Body**

```json
{
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
}
```
**Response**

```json
{
  "success": true,
  "messageId": "3EB0E8102609EC734DCA5D",
  "status": "sent",
  "chatId": "5511999999999@s.whatsapp.net"
}
```
**Observa??es**

- Disponível APENAS para instâncias ZuckPRO
- Máximo de 5 botões por mensagem
- O número deve incluir código do país (55 para Brasil)
- A instância deve estar conectada (status: connected)
- Conta no limite diário de mensagens

### SMS

#### POST /sms-send-message

Envia uma mensagem SMS para um ou mais destinatários.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/sms-send-message \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instance_id": "uuid-da-instancia-sms",
  "receivers": ["5511999999999"],
  "content": "Sua mensagem SMS aqui"
}'
```
**Request Body**

```json
{
  "instance_id": "uuid-da-instancia-sms",
  "receivers": ["5511999999999", "5511888888888"],
  "content": "Olá! Esta é uma mensagem de teste via SmsPRO."
}
```
**Response**

```json
{
  "success": true,
  "requestUniqueId": "abc123-def456",
  "creditsUsed": 1
}
```
**Observa??es**

- O número deve incluir o código do país (55 para Brasil) + DDD + número
- Mensagens de até 160 caracteres consomem 1 crédito
- Acima de 160 caracteres: +1 crédito a cada 153 caracteres adicionais
- O campo receivers aceita até 100 números por requisição
- requestUniqueId é o protocolo para rastreamento da mensagem
- Limites diários e mensais são controlados automaticamente pela instância

#### POST /sms-sync-status

Sincroniza o status de entrega das mensagens SMS enviadas.

**cURL**

```bash
curl --request POST \\
  --url https://apicluster.euatendo.app/sms-sync-status \\
  --header 'Authorization: Bearer SEU_TOKEN_API' \\
  --header 'Content-Type: application/json' \\
  --data '{
  "instance_id": "uuid-da-instancia-sms"
}'
```
**Request Body**

```json
{
  "instance_id": "uuid-da-instancia-sms"
}
```
**Response**

```json
{
  "success": true,
  "synced": 15,
  "message": "Status atualizado para 15 mensagens"
}
```
**Observa??es**

- Consulta o relatório detalhado da Comtele e atualiza os status no banco
- A API de relatórios tem cooldown de 30 segundos entre chamadas
- Status possíveis: sent, delivered, error
- Útil para verificar entregas após envio em massa

## Webhooks - Eventos Dispon?veis

Eventos que podem ser configurados no webhook da inst?ncia. Use `All` para receber todos os eventos.

- **Mensagens:** `Message`, `Receipt`, `UndecryptableMessage`, `MediaRetry`
- **Conex?o:** `Connected`, `Disconnected`, `LoggedOut`, `ConnectFailure`, `KeepAliveRestored`, `KeepAliveTimeout`, `StreamError`, `StreamReplaced`, `ClientOutdated`, `TemporaryBan`
- **QR/Pareamento:** `QR`, `PairSuccess`, `PairError`, `QRScannedWithoutMultidevice`
- **Grupos:** `GroupInfo`, `JoinedGroup`
- **Chamadas:** `CallOffer`, `CallAccept`, `CallTerminate`, `CallOfferNotice`, `CallRelayLatency`
- **Presença:** `Presence`, `ChatPresence`
- **Perfil:** `Picture`, `PushNameSetting`, `UserAbout`, `PrivacySettings`
- **Newsletter:** `NewsletterJoin`, `NewsletterLeave`, `NewsletterMuteChange`, `NewsletterLiveUpdate`
- **Bloqueio:** `BlocklistChange`, `Blocklist`
- **Sincroniza??o:** `AppState`, `AppStateSyncComplete`, `HistorySync`, `OfflineSyncCompleted`, `OfflineSyncPreview`
- **Outros:** `IdentityChange`, `FBMessage`, `All`

Payload de webhook conforme a documenta??o: o servidor configurado recebe requisi??es `POST` com informa??es do evento, inst?ncia e dados do evento. A estrutura exata varia conforme o tipo de evento e servidor.

## Arquivos nesta pasta

- `DOCUMENTACAO_COMPLETA_API_EUATENDO.md`: este documento consolidado.
- `api_endpoints_extraidos.json`: endpoints extra?dos em formato estruturado.
- `endpoints.csv`: invent?rio tabular dos endpoints.
- `postman_collection.json`: cole??o Postman gerada com placeholders.
- `pagina_api.html`, `index-CMYpy3gY.js`, `index-BFHuvWR4.css`: fontes baixadas da p?gina analisada.
- `prints/`: evid?ncias visuais da aba aberta, incluindo abas e rolagens.
