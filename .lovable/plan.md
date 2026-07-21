Objetivo: alinhar a copy de `/cardapio-digital` com a narrativa de autonomia do cliente — o cliente visualiza o cardápio/produtos, navega as opções e compra/faz o pedido com agilidade, sem depender do atendente. A página também deve mostrar, de forma tangível, como seria o site real do cliente.

Aplicação da skill Revenue-Centric Design (conversion-and-landing-pages):
- 5-second test: o hero abre com o problema do cliente (atendimento lento, cardápio escondido) e a promessa de autonomia.
- Specificity: transformação concreta — "seu cliente vê tudo, escolhe e pede" em vez de "solução completa".
- CTA microcopy: os botões respondem o que acontece, quanto tempo leva e o custo/risco (orçamento via WhatsApp, sem compromisso).
- Compress decision window: a prévia do catálogo aparece cedo, logo após o hero, para que o visitante "sinta" o produto antes de pedir orçamento.
- Value first, ask later: a seção de entregáveis e o widget de catálogo vêm antes do CTA final, provando o valor antes de pedir o contato.

Escopo da mudança:
1. Reescrever o hero de `src/routes/cardapio-digital.tsx` para focar na autonomia do cliente.
2. Reordenar / reescrever a seção "Experimente" (menuCatalogWidgetSection) para destacar que a prévia é uma simulação do site real do cliente.
3. Reescrever a seção "Por que os dois problemas são o mesmo problema" para focar no custo de esconder o cardápio e nas perdas de venda.
4. Reescrever os 4 entregáveis para a narrativa de autonomia + agilidade.
5. Reescrever os 4 passos do processo para enfatizar "seu catálogo no ar, seu cliente pedindo sozinho".
6. Ajustar a seção "Vitrine de pratos e conteúdo" (FanGallery) para uma legenda que remete à experiência real do cliente.
7. Ajustar o `FinalCta` e a mensagem padrão do WhatsApp em `src/lib/adminLinks.ts` para manter a coerência da narrativa.
8. Atualizar o `head()` de `src/routes/cardapio-digital.tsx` para title/description/og alinhados com a nova copy.
9. Não alterar componentes visuais (CatalogWidget, FanGallery) — apenas a copy ao redor deles.
10. Verificar no preview se nenhum bloco de texto quebra o layout em mobile/tablet.

Copy proposta para aprovação:

---

Hero
- eyebrow: CARDÁPIO DIGITAL + VENDA AUTÔNOMA
- h1: Seu cliente vê o cardápio. Escolhe. E pede sozinho.
- p: O cliente não precisa esperar resposta no WhatsApp. Navega pelos produtos, vê fotos, preços e variações, e finaliza o pedido no próprio ritmo — enquanto você atende quem realmente precisa de ajuda.
- CTA primário: SOLICITAR ORÇAMENTO
- CTA secundário: Ver como funciona

Seção "Experimente" (acima do widget)
- eyebrow: EXPERIMENTE AGORA
- h2: Sinta como seria o site do seu negócio.
- p: Toque em qualquer produto. Veja fotos, tamanhos, preços e o botão de pedir — exatamente como seu cliente veria. Essa prévia é o mesmo fluxo que entregamos.

Seção de problema
- eyebrow: O CUSTO DE ESCONDER O CARDÁPIO
- h2: Cardápio escondido é cliente perdido.
- p: Cliente pergunta preço no WhatsApp e espera. Quer ver opções e não encontra. Desiste e pede no concorrente. Quando o cardápio é claro, visual e fácil de comprar, a venda acontece sem atrito.

Entregáveis
- eyebrow: O QUE VOCÊ RECEBE
- h2: Uma vitrine que vende sozinha.
1. Cardápio digital visual — fotos, preços, descrições e variações organizadas por categoria.
2. Pedido integrado ao WhatsApp — cliente escolhe, monta o pedido e envia pronto para você confirmar.
3. Atendimento apenas quando importa — o agente responde dúvidas, direciona reservas e finaliza pedidos.
4. Painel único — cardápio, pedidos, conversas e postagens em um só lugar.

Como funciona
- eyebrow: COMO FUNCIONA
- h2: Do cardápio atual ao cliente pedindo sozinho.
1. Briefing — entendemos seu cardápio, preços e as dúvidas mais frequentes dos clientes.
2. Arquitetura — montamos a navegação por categorias, variações e o fluxo de pedido.
3. Implementação — subimos o cardápio digital e conectamos ao seu WhatsApp.
4. Operação — cliente vê, escolhe e pede. Você só confirma e prepara.

Vitrine de pratos e conteúdo
- eyebrow: VEJA NA PRÁTICA
- h2: O cliente toca e pede. Simples assim.

Já entregamos
- mantém os cases atuais, com ênfase na autonomia do cliente e redução de tempo de resposta.

FinalCta / WhatsApp
- Mensagem padrão: Olá! Quero um orçamento de Cardápio Digital. Quero que meus clientes vejam os produtos e consigam pedir com mais autonomia.
- FinalCta title: Quer que seus clientes vejam tudo e peçam sozinhos?

---

Critério de aceite: copy aprovada, aplicada sem quebrar layout, e preview validado em mobile e desktop.