# vem — lista de execuções da rodada v3

> Documento de tarefas da rodada v3 do protótipo. Itens marcados como **✅**
> estão implementados e testados; **🔨** está em andamento; **☐** ainda aberto.
> O **Bloco 3 (menu radial)** segue com itens de supervisão listados ao final.

Status: `☐` pendente · `🔨` em andamento · `✅` implementado

---

## BLOCO 1 — Correções críticas e estruturais (bugs)

- ✅ **Loop de perfil**: criada a tela independente **24 · Editar perfil**
  (`app.html`), com foto, nome, e-mail, nascimento e bio. “Editar perfil” (11),
  “Perfil vazio” (10) e “Dados pessoais” (19) agora apontam para a tela 24, e
  não mais para o onboarding (04).
- ✅ **Layout da Tela 01**: `.splash__actions` passou a usar `display: grid;
  gap: var(--s-2)`, alinhando o botão “Continuar com Google” à grade de 8px.
- ✅ **Legibilidade desktop**: tokens de tipografia ampliados em telas ≥1180px
  (`base.css`) e piso da escala do device elevado de 0.45 → 0.6 (`app.js`).

## BLOCO 2 — Nova arquitetura de informação (telas)

- ✅ **Tela 06 (Interesses)**: reduzida a **6 contextos principais** (busca por
  texto revela os demais) + **6 atividades sugeridas** como atalhos, com busca
  por texto já existente na seção de atividades.
- ✅ **Tela 11 (Perfil)**: **galeria de fotos de atividades** (até 6, com upload
  e remoção) e **edição de foto de capa** (upload local, data URL).
- ✅ **Tela 14 (Social)**: aba de Eventos segue listando apenas eventos com
  inscrição confirmada do usuário (compartilhamento mantido).
- ✅ **Tela 15 (Feed)**: **feed híbrido** com faixa de **eventos** (com botão de
  inscrição) + posts, e **busca por atividade** que filtra posts e eventos.

## BLOCO 3 — A grande virada do “Match” (interação e nomenclatura)

- ✅ Substituir a nomenclatura “Match” → “Conexões” em todas as telas.
- ✅ **[SUPERVISÃO]** Card interativo (menu radial, estilo Pinterest).
- ✅ **Feedback pós-conexão**: modal “Vocês conectaram!” com botão primário
  “Iniciar conversa” e secundário “Continuar” (mutual — joinha/high-five).
- ✅ **Badge no Social**: contador na aba Social acende com **nova conexão** ou
  **mensagem não lida**, e zera ao visitar o Social.

## BLOCO 4 — Onboarding guiado (o tutorial do Vem)

- ✅ **Avatar do Vem + balões de fala**: mascote `👋` com balão reutilizável
  (`#vem-bubble`) e ações configuráveis.
- ✅ **Fluxo passo a passo**: introdução na Home (mencionando Feedback nas
  Configurações) → aba Conexões → **simulação de conexão com o Vem** → badge +
  conversa no Social.

## EXTRA — Inscrição em eventos (cards)

- ✅ **Botão de inscrição/desinscrição** nos cards de evento (feed, Social e
  Meus eventos) e nas atividades:
  - **Inscrever-se**: sem confirmação (ação reversível e de baixo risco).
  - **Desinscrever-se**: confirmação via modal (remove um compromisso assumido).
  - Estado refletido nos botões em todas as telas (`Inscrever-se` ⇄ `Desinscrever`).

---

## Notas para a supervisão

Pronto e testado (QA funcional, zero erros de console): menu radial, reações,
modal de conexão, badge do Social, inscrição/desinscrição em eventos, tutorial
do Vem, tela de edição de perfil, galeria, capa, feed híbrido e interesses 6+6.

Pontos em aberto para refinar (deixados de propósito):

- **Acessibilidade**: os botões do radial permanecem no tab order mesmo fechados;
  ideal `tabindex="-1"`/`inert` quando fechado e `aria-expanded` no gatilho.
- **Notificação da outra pessoa**: hoje só há `toast`/modal local; falta a
  mensagem “Fulano quer se conectar para treinar {atividade} com você!”.
- **Perfil do Vem no deck**: a “simulação de match com o Vem” é feita pelo balão
  do tutorial (mantém o deck focado em pessoas reais). O perfil `vem` existe em
  `data.js` (chat/conexão) caso se queira inseri-lo no deck.
- A posição do arco do radial é calculada sobre `clientWidth/clientHeight`;
  recalcular em `resize`.
- `preview-radial.html` é um preview estático autocontido; pode ser removido.
- Galeria/capa/fotos usam `data URL` (localStorage); sem banco, conforme escopo.
