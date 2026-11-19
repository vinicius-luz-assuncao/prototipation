# vem — lista de execuções da rodada v3

> Documento de tarefas da próxima rodada do protótipo. Serve de guia para a
> supervisão: cada item aberto é um bloco de trabalho; itens marcados como
> **criado** já têm código no repositório e aguardam revisão/refino.

Status: `☐` pendente · `🔨` em andamento · `✅` criado (aguardando supervisão)

---

## BLOCO 1 — Correções críticas e estruturais (bugs)

- ☐ Corrigir o **loop de perfil**: desvincular “Perfil vazio” e “Editar foto” do
  fluxo de onboarding; criar tela/modal independente de edição de perfil.
- ☐ Ajustar layout da **Tela 01**: espaçamento do botão “Continuar com Google”
  respeitando a grade de 8px.
- ☐ **Legibilidade desktop**: aumentar a escala das fontes na visualização web.

## BLOCO 2 — Nova arquitetura de informação (telas)

- ☐ **Tela 06 (Interesses)**: reduzir para 6 contextos principais + 6 atividades
  sugeridas; adicionar busca por texto nas duas seções.
- ☐ **Tela 11 (Perfil)**: galeria para upload de fotos de atividades + foto de capa.
- ☐ **Tela 14 (Social)**: aba de Eventos lista apenas eventos criados ou com
  inscrição confirmada do usuário.
- ☐ **Tela 15 (Feed)**: feed híbrido (posts de atividades + cards de eventos
  futuros) com busca por atividade.

## BLOCO 3 — A grande virada do “Match” (interação e nomenclatura)

- ☐ Substituir a nomenclatura “Match” → “Conexões” em todas as telas.
- ✅ **[CÓDIGO CRIADO / AGUARDANDO SUPERVISÃO]** Card interativo (menu radial,
  estilo Pinterest):
  - **Toque curto** → abre o perfil da pessoa (sheet com foto, bio, atividades
    e CTAs “Conectar” / “Conectar em {atividade}”).
  - **Toque longo (420 ms)** → abre o menu radial com **X** (esquerda),
    **👍 conectar** (direita) e as **atividades da pessoa** em arco no topo.
  - **Arrastar e soltar** sobre uma ação executa; soltar fora cancela.
  - **Fallback acessível**: botão “Abrir ações (menu radial)” sob o card.
  - Arquivos: `app.html` (markup do radial), `assets/css/screens.css`
    (`.match-radial*`), `assets/js/social.js` (`likePerson`, `openRadial`,
    `layoutRadial`, `runRadialAction`, `openPersonProfile`).
- ☐ **Feedback pós-conexão**: modal “Deu match!” com botão primário
  “Iniciar conversa”.
- ☐ **Badge no Social**: indicador vermelho na aba Social quando houver nova
  conexão ou mensagem não lida.

## BLOCO 4 — Onboarding guiado (o tutorial do Vem)

- ☐ Criar o avatar do Vem e os balões de fala.
- ☐ Fluxo passo a passo: introdução na Home (mencionando Feedback nas
  Configurações) → aba Conexões → simulação de match com o perfil do Vem →
  redirecionamento com badge para o Chat no Social.

---

## Notas para a supervisão (item do menu radial)

O que já está pronto e testado (QA funcional, zero erros de console):

- Long press abre o radial; soltar sobre X avança o deck (pass), sobre 👍 roda a
  reação existente (joinha/high-five) e sobre uma pílula conecta na atividade
  específica (salva em `S.match.specifics`, favorita e registra o match).
- Reaproveita a lógica anterior: `likePerson(person, slug)` centraliza curtida
  geral e específica; o 3º like continua armando a conversa simulada.
- `openPersonProfile` reusa o `openSheet` existente.

Pontos em aberto para refinar (deixados de propósito para a supervisão):

- **Acessibilidade**: os botões do radial permanecem no tab order mesmo fechados;
  ideal é `tabindex="-1"`/`inert` quando fechado e `aria-expanded` no gatilho.
- **Notificação da outra pessoa**: hoje só há `toast` local; falta o texto
  “Fulano quer dar match para treinar {atividade} com você!” como mensagem.
- **Galeria do perfil** (toque curto) ainda não existe — o sheet mostra as
  atividades, não as fotos; depende do Bloco 2 (Tela 11).
- A posição do arco é calculada sobre `clientWidth/clientHeight`; recalcular em
  `resize` se o card mudar de tamanho.
- `preview-radial.html` é um preview estático autocontido (só visual); pode ser
  removido quando não for mais útil.
