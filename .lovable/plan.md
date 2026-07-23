## Diagnóstico

Rodei o scanner de SEO e o de segurança:

- **Segurança**: zero findings em todos os scanners (Supabase, RLS, supply chain, MCP, connectors). Nada para corrigir.
- **SEO**: 6 findings ativos. Deles, 4 dá pra corrigir no código agora; 2 exigem uma ação sua (não dá pra automatizar).

## Plano

### 1. H1 descritivo na home (`agent_content:content`, mid)
No `LumusReplicaEffect.tsx` o "GB IA" é geometria 3D, não um `<h1>` de verdade — o crawler está lendo um H1 fraco em algum lugar. Adicionar um `<h1>` visualmente oculto (`sr-only`) dentro do hero com "GB IA — Sistemas, automação e IA autônoma para escalar seu negócio". Isso resolve o SEO sem mudar o visual do 3D.

### 2. Metadados por rota (`agent_metadata:metadata_quality`, mid)
- **`/gb-studio`**, **`/site-institucional`**, **`/crm`**: não têm `head()` nenhum — herdam tudo do root. Adicionar `head()` completo (title, description, og:title, og:description, og:type, og:url, canonical) específico de cada produto.
- **`/ecommerce`**: title atual tem 66 chars — encurtar para <60.
- **`/gb-social`**: description tem 167 chars — encurtar para <160.
- **`/termos-de-uso`**: description tem 39 chars — expandir para faixa 50–160.
- Todas as leaf routes já têm `<link rel="canonical">` próprio (verifiquei) exceto as 3 sem `head()` acima — vai vir junto no passo.

### 3. OG previews únicos por página (`agent_metadata:social_preview`, mid)
Cobre `/gb-studio`, `/site-institucional`, `/crm`: og:title, og:description e og:url próprios (já entra no passo 2). **Não vou gerar og:images novas** — sem imagem específica é melhor do que uma genérica (a plataforma injeta screenshot automático no compartilhamento). Se você quiser, gero depois — me diz quais páginas.

### 4. `/llms.txt` (`http:llms_txt`, low)
Criar `public/llms.txt` no formato spec com nome do site, tagline, e link para cada rota pública (`/`, `/gb-social`, `/gb-studio`, `/ecommerce`, `/site-institucional`, `/cardapio-digital`, `/crm`, `/politica-de-privacidade`, `/termos-de-uso`). `/admin` fica de fora.

### 5. Performance LCP (`lighthouse:lighthouse_performance`, low)
O finding é sobre a versão **publicada** — a última publicada não tinha `font-display: swap` no Google Fonts. Já está no root com `&display=swap`, então na próxima publicação isso resolve sozinho. Vou marcar como fixed (já satisfeito) depois de reconfirmar.

### 6. Google Search Console (`gsc:gsc`, mid) — precisa de você
Exige OAuth interativo (você precisa autorizar a conta Google que administra o domínio). Não consigo fazer sozinho. Vou deixar o próximo passo pronto para quando você quiser: `standard_connectors--connect` com `google_search_console`, aí verifico posse do domínio e submeto o sitemap. **Não faço isso no build a menos que você peça.**

### Escopo — o que NÃO vou fazer
- Não vou gerar novas imagens OG (você decide se quer).
- Não vou trocar copy de nenhuma página além do H1 oculto da home.
- Não vou tocar em componentes visuais nem em layout.
- GSC fica pendendo até você me chamar.

## Detalhes técnicos

- H1 oculto usa classe `sr-only` (mesmo padrão do shadcn/Tailwind).
- Cada `head()` novo segue exatamente o shape das rotas que já têm (ecommerce/gb-social) — `meta` array com title, description, og:*, e `links` com canonical self-referencing.
- `llms.txt` fica em `public/` e vira `/llms.txt` automaticamente.
- Ao final: `seo--update_findings` marcando os 5 findings resolvidos como `fixed` (todos menos o GSC, que fica pendente aguardando você).
