## Objetivo
Padronizar a chamada para ação (CTA) final de todas as páginas internas com um bloco **elegante, minimalista e tech**, encaminhando para o **WhatsApp de orçamento** com uma mensagem pré-preenchida contando de qual produto se trata.

## Páginas afetadas
- `/site-institucional`
- `/cardapio-digital`
- `/ecommerce`
- `/crm`
- `/gb-social`
- `/gb-studio`

## O que muda visualmente
Substituir o bloco final atual (que hoje varia entre `siteProductFinal`, `menuProductFinal`, `commerceFinal`, `crmFinal`, `socialFinal` e `briefingBlock`) por um **componente único e sóbrio**:

```text
──────────────────────────────────────────────
 ORÇAMENTO · [NOME DO PRODUTO]         (eyebrow em mono, cinza)

 Uma conversa. Um orçamento sob medida.     (headline fina, platinum sutil)
 Conte o contexto — devolvemos escopo e valor.

  [ Solicitar orçamento no WhatsApp  → ]      (botão pill minimal, borda 1px platinum,
                                               hover: leve glow dourado)
──────────────────────────────────────────────
```

- Sem gradientes fortes, sem emojis, sem texto grande gritando.
- Tipografia leve (peso 300–400), letter-spacing amplo no eyebrow, divisor 1px platinum acima e abaixo.
- Botão pill preto com borda platinum 1px, seta unicode `→` fina; hover: borda dourada + glow discreto.
- Alinhamento centralizado, muito respiro (padding vertical generoso).
- Responsivo: no mobile o botão vira full-width contido pelo padding lateral.

## Implementação técnica

1. **Novo componente** `src/components/FinalCta.tsx`
   - Props: `pageKey: PageKey`, `productName: string`.
   - Lê `usePageLink(pageKey)` para pegar URL/label configurados no admin, mas por padrão renderiza label fixo "Solicitar orçamento no WhatsApp".
   - Renderiza a estrutura minimal descrita acima.

2. **Novo CSS** em `src/imported.css` (classe `.finalCta`, `.finalCtaEyebrow`, `.finalCtaTitle`, `.finalCtaButton`) — sem depender das classes específicas atuais (`siteProductFinal` etc.).

3. **Atualizar defaults em `src/lib/adminLinks.ts`**
   - Trocar `defaultLabel` das 6 páginas para `"Solicitar orçamento no WhatsApp"`.
   - Ajustar `defaultUrl` de cada uma com mensagem pré-preenchida específica, ex.:
     - Cardápio: `Olá! Quero um orçamento de Cardápio Digital + Social Media.`
     - E-commerce: `Olá! Quero um orçamento de E-commerce completo (loja + automação + IA).`
     - CRM: `Olá! Quero um orçamento de CRM sob medida.`
     - Site institucional: `Olá! Quero um orçamento de Site Institucional.`
     - GB Social: `Olá! Quero um orçamento do GB Social (social media de IA).`
     - GB Studio: `Olá! Quero um orçamento do GB Studio (fotografia com IA).`
   - Todos apontando para `https://wa.me/?text=...` (o número segue vazio como está hoje, para o admin configurar depois — se você já tiver o número, me passa que eu embuto).

4. **Substituir as `<section>` finais** em cada página pelo `<FinalCta pageKey="..." productName="..." />`. Remover CSS específico dos blocos finais antigos que ficar órfão (opcional — deixo comentado se preferir manter).

## Escopo intocado
- Não altero navegação, heróis, seções intermediárias, nem outras CTAs (cabeçalho, hero, botões de "ver como funciona"). Apenas o bloco final e os defaults do admin.

## Perguntas rápidas (posso seguir sem, com defaults acima)
- Você quer que eu **também substitua a CTA do cabeçalho** e do hero pelo mesmo padrão "Solicitar orçamento", ou mantenho como está? _Meu default: manter._
- Tem um **número de WhatsApp fixo** para embutir no `defaultUrl`, ou deixo vazio (`wa.me/?text=...`) para o admin preencher? _Meu default: deixar vazio._