# Menu do cabeçalho: links certos, submenu e visual

Hoje o menu mostra só quatro itens genéricos ("O que fazemos", "Serviços", "GB Studio", "Contato"), sem os links reais dos serviços, e o painel aparece quebrado (colado nas bordas, sem cantos arredondados).

## Novo menu

Estrutura, com "Serviços" recolhível (accordion) e na mesma ordem definida na home:

```text
INÍCIO
SERVIÇOS  ▾
   GB Social
   Menu Digital
   E-commerce
   Catálogo Digital
   Site Institucional
   CRM
   GB Studio
COMO TRABALHAMOS
CONTATO
```

- "Serviços" abre/fecha ao clicar, com animação suave; fechado por padrão.
- Estando dentro de uma página de serviço, "Serviços" já aparece aberto e o item atual fica destacado.
- Os itens de serviço são links reais para as páginas, funcionando de qualquer página do site.
- "Início", "Como trabalhamos" e "Contato" levam para a home na seção correta quando o usuário não está na home.

## Correção visual

- O painel volta a ser um card flutuante: recuo lateral, cantos arredondados, fundo translúcido com blur e sombra.
- Espaçamento uniforme, separadores sutis entre grupos e área de toque maior nos itens.
- Menu fecha ao navegar, ao clicar fora e ao pressionar Esc.

## Detalhes técnicos

- Criar `src/components/SiteMenu.tsx` com a lista de itens e o accordion de serviços, reutilizado por todas as páginas que hoje renderizam o header `.nav`, para manter uma ordem única.
- A ordem dos serviços segue os `caseCards` de `src/routes/index.tsx`: `/gb-social`, `/cardapio-digital`, `/ecommerce`, `/catalogo-digital`, `/site-institucional`, `/crm`, `/gb-studio`.
- Navegação com `<Link>` do TanStack Router; âncoras da home como `/#servicos`, `/#leistungen`, `/#kontakt`.
- Em `src/imported.css`: remover as regras antigas de `.nav nav` na media query legada (que forçam `width: 100%` e `left: 0`) e consolidar no bloco novo do dropdown, usando `top: calc(100% + 10px)` com `left/right` e `width: auto`; adicionar estilos do submenu.
