## Diagnóstico
- O scroll vertical da página CRM funciona em áreas normais no teste mobile.
- O provável bloqueio está nos elementos horizontais/sticky: principalmente o `ProductSwitcher` no topo e trechos com `touch-action: pan-x`, que podem sinalizar ao navegador para priorizar gesto horizontal e prejudicar o deslize vertical quando o toque começa ali.
- A seção `recoverNectionFlow` tem `overflow: hidden`, mas não há handler de gesto nela; não parece ser a causa principal do travamento vertical.

## Plano de correção
1. **Ajustar o menu horizontal de produtos**
   - Trocar `touch-action: pan-x` por uma configuração que permita scroll vertical da página e scroll lateral nativo do menu.
   - Manter o arraste horizontal suave, mas sem capturar swipe vertical.

2. **Padronizar áreas horizontais da CRM**
   - Aplicar `touch-action: pan-y`/scroll-snap apenas onde fizer sentido, para o navegador deixar a página rolar verticalmente.
   - Garantir que nenhum contêiner horizontal da CRM bloqueie gesto vertical por `overflow` ou captura indevida.

3. **Validar no preview mobile**
   - Testar swipe vertical começando no hero, menu de produtos, cards e seção de recuperação.
   - Testar swipe horizontal onde houver trilha/carrossel para confirmar que continua funcionando sem travar a página.

## Arquivos previstos
- `src/imported.css`
- Possivelmente `src/components/ProductSwitcher.tsx`, se o ajuste de CSS não for suficiente.