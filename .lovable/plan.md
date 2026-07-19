
## Objetivo

Adicionar, **somente na página `/cardapio-digital`**, logo abaixo da seção hero (a seção selecionada, antes de `menuProductProblem`), um widget visual que simula um app de e-commerce/catálogo — inspirado no mockup enviado, mas 100% em português e temático de restaurante/cardápio (não roupas). O usuário deve sentir "como seria ter um catálogo próprio", podendo tocar em um produto e ver detalhes (imagens extras + tamanhos/porções) como num e-commerce real.

## Onde entra

- Arquivo: `src/routes/cardapio-digital.tsx`
- Posição: nova `<section className="menuCatalogWidgetSection">` inserida entre `menuProductHero` e `menuProductProblem`.
- Estilos: novas regras em `src/imported.css` (bloco isolado com prefixo `menuCatalog…`) para não afetar outras páginas.

## Estrutura do widget (mockup do "app")

Moldura tipo celular (borda arredondada, sombra, largura ~420px desktop / 100% mobile), contendo:

1. **Topbar** — ícone de loja à esquerda, toggle "SALGADOS / DOCES" ao centro (equivalente ao MAN/WOMAN), ícone de busca à direita.
2. **Banner promocional** — card com gradiente + imagem/emoji ilustrativo, título "PEÇA AGORA!" + subtítulo "SABOR NA PORTA", botão laranja "PEDIR AGORA" e selo de marca fictícia ("Casa GB").
3. **Chips de categoria** — "NOVIDADES", "PRATOS", "BEBIDAS", "SOBREMESAS" (scroll horizontal, primeiro ativo em preto).
4. **Grade 2×2 de produtos** com badge ("NOVO" laranja / "PROMO -20%" roxo), preço em R$ e nome truncado. Ex.: "Burguer Trufado", "Pizza Napoletana", "Açaí Premium", "Suco Detox".
5. **Tab bar inferior** com 4 ícones (loja, mensagem, pedidos, perfil).

Tudo em português, tokens de cor e tipografia consistentes com o restante do site (tons grafite/dourado + destaques laranja/roxo apenas dentro do widget para lembrar o mockup).

## Interação de produto (experiência de e-commerce)

Ao tocar num card da grade, a moldura entra em modo **detalhe do produto** (mesma moldura, transição suave — sem modal externo):

- Botão voltar (←) no topo.
- Carrossel de imagens da peça (3–4 miniaturas + imagem principal, swipe horizontal por pointer events, com miniaturas clicáveis).
- Nome, descrição curta e preço grande.
- Seletor de **tamanho/porção** ("P / M / G" para pratos, "300ml / 500ml / 1L" para bebidas) com estado selecionado.
- Seletor de quantidade (− 1 +).
- Botão fixo "Adicionar ao carrinho" (visual apenas — mostra um toast dentro da moldura "Adicionado ✓" e volta pra grade após 1,2s).

Estado gerenciado por `useState` local no componente do widget (produto selecionado, tamanho, quantidade, toast). Dados dos produtos fictícios num array constante no topo do arquivo do widget.

## Imagens dos produtos

Para não gerar 4+ imagens novas (custo/tempo), usar **ilustrações CSS + emojis grandes** dentro dos cards e do detalhe (fundo com gradiente sutil, emoji centralizado tipo 🍔 🍕 🍣 🥗 🧁 🍹). Fica coerente com o resto do site sem depender de assets externos. Se depois o usuário quiser fotos reais, trocamos os placeholders.

## Detalhes técnicos

- Novo componente: `src/components/imported/cardapio-digital/CatalogWidget.tsx` (client component com estado). Importado por `cardapio-digital.tsx`.
- Sem dependências novas. Sem alteração de rotas nem de outras páginas.
- Responsivo: no mobile ocupa a largura do container com padding; no desktop centralizado com largura fixa da moldura e leve rotação/sombra opcional para dar sensação de mockup.
- Acessibilidade básica: `button` com `aria-label`, foco visível, `role="dialog"` no modo detalhe.

## Fora do escopo

- Não é carrinho real, não persiste estado, não integra com backend.
- Não altera hero, header, footer nem demais seções.
- Não mexe em outras rotas.
