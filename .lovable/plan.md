## Objetivo

Reescrever a página `/cardapio-digital` separando-a de **Catálogo/E-commerce** e ampliando o público-alvo: restaurantes presenciais, delivery, dark kitchens, autônomos de comida (confeiteiras, marmiteiras, hamburguerias caseiras) e marcas que querem exibir o cardápio online. Foco: **autonomia do cliente** para ver, escolher e pedir — presencial ou remoto.

## Nova narrativa (público ampliado)

Ângulo central: "Seu cardápio, aberto o tempo todo, em qualquer lugar." O cliente vê fotos, preços e detalhes, monta o pedido e envia — na mesa via QR ou de casa via link/WhatsApp. Sem depender de garçom, sem depender de você responder mensagem.

### Blocos e copy

1. **Hero**
   - Eyebrow: "CARDÁPIO DIGITAL"
   - H1: "Seu cardápio aberto 24h. Na mesa, no delivery, no perfil."
   - Sub: "O cliente vê as fotos, escolhe e envia o pedido sozinho. Você recebe pronto para preparar."

2. **Problema** (substitui o bloco atual)
   - Título: "Cardápio escondido custa venda."
   - Texto: "Cliente pergunta preço no WhatsApp e espera. Não sabe o que tem hoje. Não entende o combo. Desiste. Quando o cardápio é visual, atualizado e fácil de pedir, a venda acontece sem atrito — na mesa ou no delivery."

3. **Para quem é** (bloco novo, curto — 4 chips/linhas)
   - Restaurantes e bares (QR na mesa)
   - Delivery próprio e dark kitchen
   - Autônomos de comida (confeitaria, marmita, hamburgueria caseira)
   - Marcas de alimentos que querem exibir o portfólio

4. **Widget interativo** (mantém `CatalogWidget`, re-tematizado para comida)
   - Título: "Assim seu cliente pede sozinho"
   - Categorias: Entradas · Pratos · Bebidas · Sobremesas
   - Itens em R$ com nomes reais de prato
   - Botão do card: "Adicionar ao pedido"

5. **O que entrega** (4 bullets)
   - Cardápio visual por categoria (fotos, preços, adicionais, variações)
   - QR Code na mesa **e** link único para bio/WhatsApp/delivery
   - Pedido enviado direto ao WhatsApp ou cozinha (KDS/impressão quando faz sentido)
   - Pagamento integrado (Pix e cartão) — na mesa ou online

6. **Como funciona** (trilha em 4 passos)
   - Cardápio e categorias → Canais (mesa, link, WhatsApp) → Teste com equipe → Vai ao ar

7. **FinalCta**
   - Título: "Quer seu cardápio pedindo por você?"
   - Sub: "Me conta como você vende hoje — mesa, delivery ou os dois. Devolvo escopo, prazo e valor."

## Ajustes fora da página

- `src/lib/adminLinks.ts`: mensagem padrão de `cardapio-digital` → *"Olá! Quero um orçamento de Cardápio Digital. Vendo por [mesa/delivery/WhatsApp] e quero que meus clientes vejam e peçam sozinhos."*
- SEO da rota: `title` "Cardápio Digital — Mesa, delivery e WhatsApp | GB IA"; `description` "Cardápio digital com fotos, pedido no WhatsApp/mesa e pagamento integrado. Para restaurantes, delivery, autônomos e marcas de comida." Atualiza OG e canonical para self-reference.
- `ProductSwitcher` e `/ecommerce`: sem mudança — Catálogo/loja segue no e-commerce.

## Fora de escopo

- Não crio rota nova.
- Sem mudanças de layout, header, footer ou design system — apenas conteúdo textual, tema do widget e SEO da rota.
- Sem integrações reais de pagamento/KDS (segue como demonstração).
