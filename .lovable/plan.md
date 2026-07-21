## Objetivo
Reescrever a seção **Como funciona** da página `/site-institucional` para refletir o processo real de criação de um site institucional: entender a proposta da marca, organizar a estrutura, apresentar o protótipo, validar com o cliente e entregar acompanhando resultados.

## Escopo
- Editar o array `steps` em `src/routes/site-institucional.tsx`.
- Manter a mesma estrutura visual e animação existente (lista numerada 01-05).
- Não mexer em layout, cores, fontes ou outros componentes da página.

## Proposta de 5 passos

| # | Título | Descrição sugerida |
|---|--------|--------------------|
| 01 | **Briefing** | Entendemos o que você vende, o que oferece e qual é a proposta da marca. |
| 02 | **Estrutura** | Definimos a organização das páginas, mensagens e caminhos que o visitante vai percorrer. |
| 03 | **Protótipo** | Apresentamos o framework visual do site para você ver como vai ficar antes de produzir. |
| 04 | **Validação** | Ajustamos com base no seu feedback e só então partimos para a versão final. |
| 05 | **Entrega** | Site no ar, testado, e acompanhado para ver se está gerando resultado. |

## Dúvidas para aprovação
- O título "Estrutura" pode ser substituído por **Arquitetura da Informação**, **Wireframe** ou **Mapa do Site** se você preferir um termo mais técnico.
- O passo "Entrega" inclui publicação e acompanhamento de resultados. Se quiser separar em "Entrega" e "Resultados", a seção passa para 6 passos.

## Arquivos envolvidos
- `src/routes/site-institucional.tsx` (apenas o array `steps`).

## Critério de conclusão
- Seção renderiza os 5 novos passos com títulos e descrições atualizados.
- Build continua passando sem erros.