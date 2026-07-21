# Refatorar carrossel de E-commerce

## Objetivo
Reestilizar o `BentoMorphGallery` da página `/ecommerce` para que cada card pareça um preview de site real no ar (como na imagem enviada), mantendo os 5 templates de E-commerce existentes e a identidade GB IA (fundo escuro, acentos lime, tipografia melódica/mono).

## Contexto confirmado
- O carrossel atual usa `BentoMorphGallery.tsx` com loop infinito, drag e auto-scroll (já implementados).
- A página `/ecommerce` importa o componente na segunda dobra, com título "Modelos & Templates".
- O usuário quer **manter os templates de E-commerce** (Atelier, Forma, Pulse, Nativa, Essencial) e aplicar o **layout da imagem**, com a **paleta GB IA** (lime + imagem).

## Mudanças propostas

### 1. Estrutura dos cards (BentoMorphGallery.tsx)
Cada card passa a ter:
- **Moldura externa escura** (`#111` / `#181818`) com bordas arredondadas grandes e padding interno.
- **Header com navegação**: logo do cliente (3 bolinhas) + 3 links de menu (ex: "Loja", "Catálogo", "Checkout") em chips cinza.
- **Área de preview**: headline grande, subtítulo curto, botão de CTA arredondado preto/lime com texto "FALAR NO WHATSAPP".
- **Meta abaixo do card**: nome do template e tipo/segmento.
- Conteúdo por template adaptado ao E-commerce:
  - Atelier → Moda: "Nova coleção no ar", "Drop exclusivo mobile"
  - Forma → Casa: "Ambiente pronto", "Vitrine por cômodo"
  - Pulse → Fitness: "Drop ativo", "Assinatura + upsell"
  - Nativa → Beleza: "Rotina completa", "Kit de autocuidado"
  - Essencial → Catálogo: "Linha essencial", "Compra rápida no WhatsApp"

### 2. Comportamento
- Manter **loop infinito**, **drag horizontal** e **auto-scroll suave** já implementados.
- Cards maiores e mais visíveis, com aspecto de site em desktop/tablet.
- Pausar auto-scroll ao interagir ou passar o mouse (já existe, mas validar).
- Ajustar o `scrollLeft` inicial para centralizar a cópia do meio (já existe).

### 3. Estilização CSS (src/imported.css)
Adicionar classes novas para o carrossel no estilo da imagem:
- `.commerceSiteCard` — moldura arredondada, fundo escuro, sombra suave, padding.
- `.commerceSiteHeader` — linha com bolinhas e chips de menu.
- `.commerceSitePreview` — área clara/cinza do site com headline, parágrafo, botão.
- `.commerceSiteCta` — botão arredondado estilo "FALAR NO WHATSAPP".
- `.commerceSiteMeta` — nome do template + tipo abaixo do card.
- Cores: fundo do preview em variações de `#f5f1e8`, `#d4e3dc`, `#ffe75e`, `#f3c7cf`, `#ececec` (mantidas, mas adaptadas para melhor contraste).
- Responsivo: cards com `min-width` para 1 card por viewport em mobile, 2-3 em desktop.
- Garantir que o drag não conflite com cliques nos botões/CTAs.

### 4. Ajustes na página `/ecommerce`
- Manter a seção "Modelos & Templates" na segunda dobra.
- Atualizar o texto introdutório, se necessário, para combinar com o novo visual: "Modelos que já viram loja no ar" → permanece.
- Verificar se o texto "Loop infinito · arraste ou deixe rolar →" abaixo do carrossel ainda faz sentido ou pode ser melhorado.

## Escopo fora desta entrega
- Não alterar o conteúdo da página além do carrossel e do texto introdutório imediato.
- Não mudar a seção de áudio, omni-channel ou CTA final.
- Não adicionar novas rotas ou imagens externas (usar preview CSS puro).

## Validação
- Rodar `bun run build` para garantir que o TypeScript e os imports não quebram.
- Verificar em preview mobile e desktop se o drag horizontal continua funcionando e se os cards renderizam como site previews.