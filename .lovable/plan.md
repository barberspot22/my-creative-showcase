# Reposicionamento de copy: de "sistema" para "soluções sob medida"

## Objetivo

Hoje o site repete "sistema" em quase todo lugar (hero, cards, benefícios, footer, contato), o que deixa a GB IA parecendo uma software house pura. A ideia é ampliar a leitura para **"soluções sob medida movidas por IA"**, mantendo o tom técnico mas cabendo tudo: sites, e-commerce, CRM, cardápio, automação, IA autônoma, GB Studio e GB Social.

**Escopo confirmado:** só a home (`src/routes/index.tsx`). Sem mexer em SEO, formulário de contato, páginas internas ou admin nessa rodada.

## Mudanças de copy

### 1. Cards de produto (descrição enxuta e conectada à proposta de cada um)

Hoje três cards terminam com a mesma frase "em um sistema só", o que apaga a diferença entre eles. Cada descrição vai passar a refletir a promessa do produto:

- **E-commerce** — hoje: *"Loja, automação e IA vendedora em um sistema só"* → *"Loja pronta pra vender no automático, com IA que atende e converte."*
- **CRM** — hoje: *"CRM, follow-up automatico e dashboard de vendas em um sistema so"* → *"Funil, follow-up e dashboard num só lugar — comercial que não perde lead."*
- **Cardápio Digital** — hoje: *"Cardápio e presença digital em um sistema só"* → *"Cardápio, pedidos e presença digital que vendem por você."*
- **Site Institucional**, **GB Studio**, **GB Social** — reviso as descrições existentes pra manter o mesmo padrão (frase curta, foco no resultado, sem "sistema").

Regra: cada card fala do **resultado** que aquele produto entrega, sem repetir palavra entre eles.

### 2. Bloco de benefícios (`benefits`)

Trocar as ocorrências de "sistema" por termos que caibam no portfólio maior:

- *"Quem desenha o sistema é quem também mantém no ar"* → *"Quem desenha a solução é quem também mantém no ar."*
- *"Sistemas autônomos, mas com humano no controle…"* → *"Automações autônomas, mas com humano no controle onde o risco é alto."*

### 3. Bloco de contato

- *"Conte o problema. A gente desenha o sistema."* → *"Conte o problema. A gente desenha a solução."*

### 4. Footer

- *"Sistemas, automação e IA autônoma."* → *"Soluções sob medida, automação e IA autônoma."*

### 5. Alt text do mapa de conexões

- *"…arquitetura dos sistemas da GB IA"* → *"…arquitetura das soluções da GB IA"* (só pra não destoar).

## Fora do escopo desta rodada

- Páginas internas (`/gb-studio`, `/gb-social`, `/ecommerce`, `/crm`, `/cardapio-digital`, `/site-institucional`)
- Formulário de contato (select "Sistemas & Sites")
- Metadata / SEO (`head()` das rotas)
- Painel admin

## Detalhes técnicos

Arquivo único: `src/routes/index.tsx`. Alterações pontuais nas constantes `benefits`, `caseCards` (campo `description`) e nos textos JSX de contato/footer/alt. Sem mudança de estrutura, tipos ou estilos.
