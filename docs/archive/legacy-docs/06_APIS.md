# APIs

APIs principais:

- `/api/certificados/*`: upload, importacao, detalhe, aviso manual e links.
- `/api/clientes`: listagem/cadastro conforme fluxo.
- `/api/notifications/*`: configuracoes, templates, eventos, recipients e rebuild.
- `/api/cron/certificados-vencimentos`: scanner diario protegido por `CRON_SECRET`.
- `/api/cron/euatendo-dispatch`: dispatcher euAtendo protegido por `CRON_SECRET`.
- `/api/whatsapp/euatendo/health`: teste admin de conexao.
- `/api/whatsapp/euatendo/check-number`: validacao admin de numero.
- `/api/whatsapp/euatendo/test-message`: envio admin controlado.
- `/api/download/[token]/validar`: download publico protegido.

Nao existem rotas operacionais do canal local anterior.
