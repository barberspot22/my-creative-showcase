# Instalar a skill "Revenue-Centric Design" no projeto

Vou baixar o repositório `heliocosta-dev/revenue-centric-design` (SKILL.md + references/ + assets/), colocar em `.agents/skills/revenue-centric-design/` e ativar via `skills--apply_draft`. A partir daí, a skill é injetada automaticamente sempre que o pedido tocar em design/UX/conversão/onboarding/preço/retention — eu consulto o `SKILL.md` e leio o `references/<tema>.md` relevante antes de agir.

## Passos

1. **Baixar o repo** via `git clone --depth=1 https://github.com/heliocosta-dev/revenue-centric-design.git` para `/tmp/rcd`.
2. **Copiar conteúdo** (`SKILL.md`, `references/`, `assets/`, `LICENSE`) para `.agents/skills/revenue-centric-design/`.
3. **Validar** `SKILL.md` (frontmatter `name` + `description`); ajustar apenas se estiver fora do padrão exigido pelo Lovable (nome kebab-case, descrição clara de quando ativar).
4. **Aplicar** com `skills--apply_draft` apontando para `.agents/skills/revenue-centric-design`.
5. **Confirmar ativação** listando `.workspace/skills/`.

## Regras de uso depois de ativa

- Toda vez que o pedido envolver: landing/hero/CTA, onboarding, pricing, churn, retention, copy persuasiva, feature adoption, ICP/posicionamento, experimentação — consulto o `SKILL.md` e o `references/<tema>.md` correspondente antes de propor mudanças de design.
- Respeitar a licença do repo: **não usar** essa skill para produtos de aposta/cassino/gambling.
- Skill é **guia** — decisões visuais específicas do GB IA (paleta grafite/dourado, tipografia platinum, etc.) continuam mandando sobre padrões genéricos da skill quando houver conflito.

## Nada muda no código do site

Instalar a skill não altera nenhum arquivo em `src/`. É só configuração do agente. Mudanças visuais só acontecem quando você pedir e eu aplicar os princípios da skill.
