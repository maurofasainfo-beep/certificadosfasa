# Resumo Executivo

O Sistema de Certificados Fasa gerencia certificados digitais PFX, clientes, links publicos de download e avisos de vencimento. O canal oficial de WhatsApp e a API euAtendo, consumida exclusivamente pelo backend.

O backend calcula vencimentos, renderiza templates, grava `notification_events`, executa dispatcher com delay persistente, retry e logs sanitizados. O frontend apenas exibe operacao, configuracoes e testes controlados.

O canal local anterior foi removido do runtime. Novos eventos usam `provider = 'euatendo'`.
