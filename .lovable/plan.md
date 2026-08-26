# Corrigir o menu do cabeçalho

O painel do menu hambúrguer está aparecendo colado nas bordas, sem cantos arredondados e com espaçamento estranho no mobile.

## Causa

Existem duas definições de estilo para o painel do menu no mesmo arquivo de CSS, ambas para telas até 760px:

- A antiga (bloco original importado) força `width: 100%`, `left: 0`, `top: 82px`, fundo chapado e `padding: 30px`.
- A nova (redesign do hambúrguer) define painel flutuante com `left/right: 20px`, cantos arredondados, blur e sombra.

Como a antiga mantém `width: 100%`, o painel estoura a largura e ignora o recuo lateral, produzindo o visual quebrado da captura.

## O que será feito

1. Remover as regras antigas do painel de navegação mobile, deixando só o estilo novo do dropdown (flutuante, arredondado, com blur e sombra).
2. Ajustar o painel para acompanhar a altura real do cabeçalho, com um pequeno respiro abaixo dele, em vez do `top: 82px` fixo.
3. Padronizar os itens: espaçamento uniforme, separadores sutis entre os links, área de toque maior e alinhamento consistente.
4. Fechar o menu automaticamente ao navegar para outra página ou ao clicar fora / pressionar Esc.
5. Garantir que os links funcionem em todas as páginas: hoje "O que fazemos", "Serviços" e "Contato" são âncoras da home; fora da home passarão a levar para a home na seção correta.

## Detalhes técnicos

- `src/imported.css`: remover o bloco `.nav nav` da media query legada (linha 3) e consolidar no bloco novo do dropdown; usar `top: calc(100% + 10px)` e `width: auto` com `left/right`.
- `src/routes/index.tsx` (e demais cabeçalhos que usem `.nav`): fechar o menu em clique externo/Esc e apontar as âncoras para `/#id` quando fora da home.
