## Problema

Na tentativa anterior duas coisas quebraram:

1. **Sombra escura em cima do "GB IA"** — a light section seguinte (`.light` / "Sistemas & Sites" em creme) mostra o texto GB IA por trás porque a hero virou `position:sticky` e continua atrás de todo o resto do site. O efeito visual escuro em cima das letras é a hero vazando por baixo das seções seguintes que não são 100% opacas em toda extensão.
2. **Hero sticky persiste eternamente** — como `.hero` é sticky no `<body>`, ela fica fixa atrás de TODAS as seções seguintes, não só da segunda dobra. Isso é errado: o usuário quer que a hero fique fixa apenas até a segunda dobra ("O futuro molda o seu negócio") cobri-la; depois o site deve rolar normal.

## Solução

Trocar a abordagem: em vez de `position:sticky` na hero (que persiste para sempre), voltar ao modelo de **overlap por margem negativa** (segunda dobra sobe por cima da hero no scroll), mas sem o gradiente escuro que criava a sombra em cima do "GB IA".

### Mudanças em `src/imported.css`

1. **Remover o override sticky** adicionado no fim do arquivo (bloco `/* Sticky hero */`). A hero volta ao fluxo normal com sua altura fixa (720px desktop / 640px mobile).
2. **Reintroduzir o overlap suave**: `.circleProductSection` recebe `margin-top: -140px` (desktop) / `-90px` (mobile) para entrar por cima da base do robô.
3. **Fade de topo transparente → preto puro em curta distância** (0% transparente → 40px opaco), sem faixa cinza intermediária. Isso cria uma borda limpa que cobre só a base do robô, sem escurecer o "GB IA" que fica acima da linha de overlap.
4. **Garantir opacidade total** de `.circleProductSection` (background sólido `#050505`) para que nada da hero apareça atrás dela depois que ela entra em cena.

### Resultado esperado

- "GB IA" no topo aparece inteiro, sem faixa cinza escura por cima.
- Ao rolar, a segunda dobra ("O futuro molda o seu negócio") entra por cima da base do robô com uma borda limpa.
- Depois da segunda dobra, o site flui normal — a hero não fica mais atrás das seções seguintes.

## Detalhes técnicos

- Arquivo alterado: `src/imported.css` (remover bloco sticky no fim + ajustar `.circleProductSection` e seu `::before`).
- Nenhum arquivo `.tsx` muda.
- Sem mudanças em rotas ou lógica.
