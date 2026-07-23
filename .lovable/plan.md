## Diagnóstico

Confirmei consultando o banco:

- **Tabela `home_cards`: 0 linhas.** Por isso o admin mostra "Sem imagem" em todos os cards da home. O site em si funciona porque o `src/routes/index.tsx` tem um array fixo (`caseCards`) como fallback — mas nada disso foi para o banco, então o admin não enxerga.
- **`portfolio_items` do `gb-social`: 0 linhas.** E, além disso, a página `/gb-social` **não lê do banco** — o `PerspectiveTicker` usa uma lista fixa de `/gb-social-designs/design-*.png`. Ou seja, hoje qualquer coisa que você adicionar na aba "GB Social" do admin **não aparece em lugar nenhum no site**.

Outro detalhe: alguns cards da home hoje são "UI animada" (chat do Social, dashboard do CRM, catálogo do Menu), não imagem. Esses não têm frames de imagem por design — precisam ser tratados no admin como "usar animação padrão" em vez de forçar uma imagem.

## Plano

### 1. Semear `home_cards` com o conteúdo atual da home
Migração que insere os 6 cards atuais (`studio`, `social`, `ecommerce`, `crm`, `site`, `menu`) com título, descrição, badge, href e as `frames` de imagem que hoje aparecem no site (Studio pega as 3 do lookbook; E-commerce e Site pegam suas capas `/covers/hero-*.jpg`; Social, CRM e Menu ficam com `frames: []` porque usam UI animada).

Resultado: o admin passa a listar as capas reais e permitir editar. Os cards que hoje são animações continuam funcionando via fallback no `index.tsx` quando `frames` está vazio.

### 2. Conectar `/gb-social` ao `portfolio_items`
- Semear `portfolio_items` com `page_key='gb-social'` usando os 9 designs hoje fixos no `PerspectiveTicker`.
- Refatorar `PerspectiveTicker` para receber os designs por prop e alterar `src/routes/gb-social.tsx` para buscar via `fetchReferencesByPage("gb-social")` (com a lista atual como fallback, mesmo padrão de e-commerce/institucional/cardápio).

Resultado: a aba "GB Social" do admin passa a controlar de verdade as imagens que rolam na página.

### 3. Sinalizar no admin os cards "sem imagem editável"
Nos cards da home cujo visual é UI animada (Social, CRM, Menu), mostrar no lugar do "SEM IMG" um rótulo tipo "ANIMAÇÃO" com um tooltip curto ("Este card usa uma animação da marca, não uma imagem"). Evita a sensação de bug.

### Fora de escopo
- Não vou mudar o layout do admin nem os specs de dimensões.
- Não vou trocar as capas atuais — só levo o que já está no site para o banco para você poder editar.

## Detalhes técnicos

- Migração idempotente com `INSERT ... ON CONFLICT (key) DO NOTHING` para `home_cards` e um `INSERT ... WHERE NOT EXISTS` para os 9 itens do `gb-social`.
- `PerspectiveTicker` ganha prop `designs?: string[]`; mantém a constante atual como default para não quebrar SSR/preview enquanto os dados carregam.
- `src/routes/gb-social.tsx` passa a usar `useQuery` + `fetchReferencesByPage("gb-social")` no mesmo padrão já usado nas outras páginas.
