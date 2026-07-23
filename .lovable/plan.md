## Diagnóstico

Confirmei no banco:
- Card **E-commerce** hoje: 1 frame só (`/covers/hero-ecommerce.jpg`).
- Card **Site Institucional** hoje: 1 frame só (`/covers/hero-institucional.jpg`).
- Já existem portfólios reais no banco: 7 sites de e-commerce (`/references/ecommerce/tall-*.jpg`) e 7 sites institucionais (`/references/institucional/premium-*.jpg`).

Como o componente do card já suporta múltiplos `frames` (é o que faz o Studio alternar entre 3 lookbooks), basta trocar o conteúdo do campo `frames` desses dois cards para as URLs dos portfólios reais — sem mexer em código.

## Plano

### 1. Atualizar `home_cards.frames` do card `ecommerce`
Substituir o único frame atual pelos 7 mockups `tall-*` já cadastrados em `portfolio_items` para `page_key='ecommerce'`. Assim o card na home passa a passar por sites reais que a pessoa vê depois na página `/ecommerce`.

### 2. Atualizar `home_cards.frames` do card `site`
Mesma ideia: trocar o único frame por 7 mockups `premium-*` de `portfolio_items` para `page_key='site-institucional'`.

### 3. Nada muda nos cards de animação
Social, CRM e Menu continuam com `frames: []` (usam UI animada). Já resolvi na rodada anterior a sinalização "Animação" no admin — não é imagem faltando.

## Detalhes técnicos

- Uma única migração com dois `UPDATE home_cards SET frames = '[...]'::jsonb WHERE key IN ('ecommerce','site')`.
- URLs vêm literalmente da tabela `portfolio_items` (mantendo a ordem por `position`), então o que roda no card é exatamente o mesmo conjunto que aparece na galeria da respectiva página.
- Depois disso, no admin, esses dois cards passam a mostrar "7 IMG" (em vez de "1 IMG") e você consegue editar/remover cada frame individualmente pela UI já existente.

### Fora de escopo

- Não vou trocar o card do Studio (já tem 3 frames de lookbook próprios).
- Não vou mudar layout do admin nem do carrossel da home.
