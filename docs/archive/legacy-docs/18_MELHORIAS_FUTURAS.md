# 18 - Melhorias Futuras

Estas sugestoes nao foram implementadas. Elas partem da leitura do codigo atual apos a remocao do canal local legado.

## Prioridade alta

### Criar testes automatizados do dispatcher euAtendo

Problema: o envio automatico depende de reserva atomica, delay, retry e respostas externas.

Beneficio: reduz risco de duplicidade ou falha silenciosa em producao.

### Auditar todas as rotas com Service Role

Problema: Service Role ignora RLS.

Beneficio: reduz risco de vazamento por bug de autorizacao.

### Validar UTF-8 em toda a interface

Problema: historicamente houve textos com mojibake em alguns documentos e labels.

Beneficio: melhora UX e reduz risco de mensagens confusas.

## Prioridade media

### Mover rebuild pesado para RPC set-based

Problema: rebuild ainda calcula/insere muitos eventos no backend.

Beneficio: melhor performance em alto volume.

### Cursor pagination em eventos

Problema: offset/count exact pode pesar em muitas linhas.

Beneficio: listagens mais estaveis com 10.000+ eventos.

### ConfirmDialog padronizado

Problema: algumas acoes podem usar confirmacoes nativas.

Beneficio: consistencia visual e melhor controle de UX.

### Documentar operacao de reconciliacao

Problema: API existe, mas operadores precisam de procedimento claro.

Beneficio: facilita recuperacao de inconsistencias Storage/banco.

## Prioridade baixa

### Remover dependencia nao usada

Verificar `framer-motion` se realmente nao houver uso.

### Expandir testes automatizados

Criar testes para:

- upload PFX invalido;
- parsing com senha incorreta;
- renovacao sem duplicar;
- link de uso unico;
- dispatcher euAtendo;
- retry/backoff;
- delay persistente;
- DTO financeiro.

### Observabilidade

Adicionar metricas:

- latencia do cron;
- tempo de rebuild;
- numero de eventos criados;
- falhas de Storage;
- tempo de reserva do dispatcher;
- taxa de sucesso euAtendo por dia.
