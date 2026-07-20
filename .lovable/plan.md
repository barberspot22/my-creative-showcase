Ajuste de responsividade em tablet (768–1023px) para que todas as páginas ocupem a largura total da tela com um padding lateral fixo e confortável (respiro), sem margens percentuais excessivas.

### Diagnóstico confirmado
- O projeto só possui media queries ativas em `max-width:760px` e `max-width:900px`. Não existe uma regra de transição para a faixa de tablet (768–1023px), então essa viewport herda os valores de desktop (paddings de 6% a 10% e grids de 2 colunas).
- As páginas de produto (`/gb-studio`, `/gb-social`, `/ecommerce`, `/crm`, `/site-institucional`, `/cardapio-digital`) e a home (`/`) usam paddings percentuais que, em 768px, geram ~46–76px de espaço lateral — muito para tablet.
- O admin já colapsa a sidebar em ≤1023px, mas o padding interno também pode ficar apertado demais nessa faixa.

### O que será feito

1. **Criar media query global de tablet** em `src/imported.css`:
   ```text
   @media (min-width: 761px) and (max-width: 1023px) { ... }
   ```
   Com padding lateral padrão de **28px** (pode ajustar para 24px em telas muito próximas de 768px e 32px em 1024px se necessário).

2. **Páginas de produto** — ajustar seções para 100% de largura com padding lateral:
   - `.studioNav`, `.studioHero`, `.problemBlock`, `.processBlock`, `.audienceBlock`, `.briefingBlock`, `.studioFooter`
   - `.socialHero`, `.socialProductPage` seções internas (`.whatsappBlock`, `.allChannels`, `.socialWorkShowcase`, `.autonomyBlock`, `.dnaBlock`, `.socialFlow`, `.socialFinal`)
   - `.commerceHero`, `.commerceProblem`, `.commerceDeliverables`, `.commerceGallerySection`, `.commerceProcess`, `.commerceProof`, `.commerceFinal`
   - `.crmHero`, `.crmAutoBlock`, `.crmSystemShowcase`, `.crmChatBlock`, `.crmStructure`, `.crmCompareBlock`, `.crmFinal`
   - `.siteProductHero`, `.siteProductProblem`, `.siteProductDeliverables`, `.siteWorkShowcase`, `.siteProductProcess`, `.siteProductFinal`
   - `.menuProductHero`, `.menuCatalogWidgetSection`, `.menuProductProblem`, `.menuProductDeliverables`, `.menuVisualShowcase`, `.menuProductProcess`, `.menuProductProof`, `.menuProductFinal`

   Detalhes:
   - Padding lateral fixo (28px) em vez de 6%–9%.
   - Grids de 2 colunas (`problemBlock`, `processBlock`, `comparison`, `commerceDeliverables ol`, etc.) passam para 1 coluna para aproveitar a largura total.
   - Blocos com margem lateral percentual (`briefingBlock`, `socialFinal`, `commerceFinal`) passam para margem fixa de 20px/28px e largura auto, ocupando a largura disponível.

3. **Home (`/`)** — ajustar seções com padding percentual:
   - `.nav` (padding 22px 5.5% → 22px 28px)
   - `.services` (70px 7% 95px → 70px 28px 95px)
   - `.why` (90px 9% → 90px 28px)
   - `.references` (85px 10% 90px → 85px 28px 90px)
   - `.contact` (padding 0 24px já ok, mas verificar max-width)
   - `.siteFooter .footerInner` (padding 120px 8% 40px → 120px 28px 40px)
   - `.processTrail` (padding 140px 6% 160px → 140px 28px 160px)
   - Manter `.heroFoldScene` e `.circleProductSection` com comportamento visual atual, mas garantir que o título e os cards não fiquem cortados nas laterais.

4. **Admin (`/admin`)** — ajustar layout para tablet:
   - `.admX-section` e `.admX-topbar` já colapsam em ≤1023px, mas vou garantir que o padding seja 28px e que formulários/previews não fiquem menores que a tela.
   - Em 768–1023px, preview de cards pode ser exibido abaixo do formulário com largura total, como já acontece em mobile.
   - Verificar se bottom nav não esconde conteúdo (padding-bottom adequado).

5. **Verificação**:
   - Usar o preview nos viewports 768px e 1024px (tablet) para confirmar que não há scroll horizontal, conteúdo cortado ou espaços laterais desiguais.
   - Validar que as mudanças não afetam o mobile existente (≤760px) nem o desktop (≥1024px).

### O que não muda
- Nenhuma alteração de conteúdo, copy ou funcionalidade.
- Sem novas dependências.
- Páginas legais (`/politica-de-privacidade`, `/termos-de-uso`) já têm padding fixo; só serão revisadas para garantir consistência.

### Entrega esperada
Todas as páginas do site e do painel admin terão um layout confortável em tablet: conteúdo aproveitando a largura total da tela com padding lateral simétrico e sem elementos encostados ou “flutuando” no centro com margens excessivas.