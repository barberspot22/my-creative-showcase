# Mais chamadas para ação no site

A home hoje não tem nenhum botão de WhatsApp entre as seções: a segunda dobra (carrossel "O futuro molda o seu negócio") termina sem CTA, e o único ponto de conversão é a seção de contato no fim da página. As páginas de serviço já usam o botão de seção; falta padronizar e reforçar.

## O que muda

1. **Segunda dobra (carrossel de produtos)**
   Botão de WhatsApp logo abaixo dos cards, com mensagem contextual ("Vi os serviços da GB IA e quero entender qual faz sentido pro meu negócio").

2. **Trilha de processo (ProcessTrail)**
   Botão ao final da trilha, com mensagem sobre diagnóstico ("Quero um diagnóstico do meu negócio").

3. **Rodapé de navegação**
   Um botão de WhatsApp no bloco da marca no rodapé, para captar quem chega até o fim rolando.

4. **Páginas de serviço**
   Revisão rápida de cada página (Studio, Social, E-commerce, CRM, Site Institucional, Cardápio, Catálogo): garantir pelo menos 2 pontos de contato ao longo da rolagem, além do CTA final, sempre com mensagem própria da seção.

Todos os botões usam o mesmo componente e o número central já configurado (27 98867-3309), e disparam o evento de Lead no rastreamento.

## Detalhes técnicos

- Reutilizar `src/components/SectionCta.tsx` (estilos `.sectionCtaButton` já em `src/imported.css`).
- Inserir em `src/routes/index.tsx` (após o `circleProductCarousel`, dentro da seção `#servicos`) e em `src/components/imported/ProcessTrail.tsx`.
- Adicionar o disparo de `trackLead` no clique do `SectionCta` para medir conversões por seção.
- Espaçamento consistente: margem superior de 40px desktop / 28px mobile.
