# Copy da página de Site Institucional — funil de conscientização e urgência

## O que vamos fazer

Reescrever a página `/site-institucional` como um funil curto: **dor → valor → prova → ação**. O objetivo é reduzir o texto, trocar a linguagem de “agência” por linguagem de resultado e fazer o visitante bater o olho e entender que precisa de um site profissional agora.

## Ponto de partida

- Arquivo: `src/routes/site-institucional.tsx`
- Estrutura visual atual preservada: hero, problema, entregáveis, showcase, processo, CTA final.
- ICP assumido: pequenos negócios, prestadores de serviço e marcas que já vendem offline ou no Instagram, mas ainda não têm um site profissional — ou têm um genérico.

## Abordagem (Revenue-Centric Design)

- **Awareness level:** *problem-aware*. O visitante já sabe que site existe, mas não entende o custo de não ter um bom.
- **Abrir com a dor:** perda de clientes que pesquisam e não encontram, ou dúvida sobre credibilidade.
- **Value first:** antes de falar em “site”, falar no resultado que ele gera (autoridade, clareza, contato).
- **5-second test:** headline em uma linha, subhead responde “por que isso importa para mim”.
- **CTA microcopy:** cada botão deve responder *o que acontece* quando clicar.
- **Especificidade:** mostrar transformação, não categoria.

## Nova estrutura de copy

### 1. Hero — primeira dobra
- **Eyebrow:** manter `SITE INSTITUCIONAL` ou remover (testar visualmente).
- **H1:** `Seu negócio existe. Só falta ser encontrado com autoridade.`
- **Sub:** `Um site institucional não é cartão de visita. É um funil 24h que apresenta o que você faz, prova que pode confiar e direciona o visitante para o contato — sem depender de algoritmo.`
- **CTA primário:** `Quero um site que vende` (WhatsApp).
- **CTA secundário:** `Ver como funciona` (âncora `#entregamos`).

### 2. Problema — fundo claro
- **H2:** `Sem site profissional, você perde antes de conversar.`
- **Copy:** `O cliente pesquisa no Google, vê a concorrência e não te encontra. Ou encontra um site lento, genérico e sem rosto. Em 5 segundos ele decide: “não parece confiável”. E some.`
- **CTA:** `Não deixar isso acontecer`.

### 3. Valor — fundo escuro
- **H2:** `Site institucional é vendedor que não dorme.`
- **3 bullets curtos:**
  1. Apresenta a marca em segundos.
  2. Organiza serviços e produtos de um jeito que o cliente entende.
  3. Converte visita em WhatsApp, ligação ou formulário.
- **CTA:** `Quanto custa não ter isso?`.

### 4. O que entregamos — `deliverables`
- **H2:** `Do que você precisa para vender sozinho.`
- Manter os 4 cards, mas com copy mais enxuta:
  1. **Proposta clara na primeira dobra** — “O que você faz, para quem e por quê, sem rolar a página.”
  2. **Prova de capacidade** — “Cases, números e depoimentos que tiram a dúvida.”
  3. **Caminho único pro contato** — “CTA claro, sem botões competindo.”
  4. **Estrutura sob medida** — “Nada de template genérico adaptado à força.”

### 5. Já entregamos — showcase
- **H2:** `Sites que viraram cartão de visita e viraram porta de entrada.`
- Atualizar os cards do `PerspectiveTicker` para mostrar categorias reais de site (ex: clínica, restaurante, serviço, loja) e, quando possível, um resultado curto.
- **Fallback:** se não houver cases reais, manter os mocks visuais e usar copy de categoria/resultado.

### 6. Como funciona — processo
- **H2:** `Do briefing ao ar em 4 passos.`
- Manter os 4 passos, mas encurtar as descrições:
  1. **Briefing** — “Entendemos o que você vende e o que precisa provar.”
  2. **Arquitetura** — “Mensagem central, estrutura e tom definidos antes do visual.”
  3. **Implementação** — “Site construído com stack moderna, sem plugin.”
  4. **Operação** — “No ar, testado e com caminho de contato funcionando.”

### 7. CTA final
- **H2:** `Seu site pode ser sua melhor peça de vendas.`
- **Sub:** `Me conta o que você vende. Devolvo uma estrutura e um valor.`
- **CTA:** `Solicitar orçamento no WhatsApp`.

## Detalhes técnicos

- Arquivo a editar: `src/routes/site-institucional.tsx`.
- Alterações de copy apenas: arrays `deliverables`, `steps` e JSX das seções.
- Manter imports, `BrandLogo`, `ProductSwitcher`, `PerspectiveTicker`, `FinalCta`.
- Ajustar quebras de linha no mobile para manter o ritmo visual.
- Se houver cases reais, substituir os cards do showcase por dados específicos em um passo adicional.

## Critérios de sucesso

- Hero passa no teste de 5 segundos: qualquer pessoa entende o valor em uma leitura.
- Redução de ~30–40% do volume de texto em relação à versão atual.
- Uma ação clara por seção, sem competir com a navegação.
- Tom educa e cria urgência: o visitante deve sentir que estar sem site profissional tem custo real.
