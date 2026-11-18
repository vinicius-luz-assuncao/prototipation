# vem — documento do projeto

> **Projeto:** vem — treino que encontra companhia
> **Tipo:** protótipo navegável de 20 telas + design system + apresentação
> **Stack:** HTML, CSS e JavaScript puros — sem build, sem framework, sem dependência de internet
> **Última atualização deste documento:** 17/11/2026
> **Commit de referência:** `d7ce196`

---

## 1. Visão geral

O **vem** é um projeto acadêmico de UI/UX que propõe um app de atividade física
baseado em **companhia**, não em performance. A ideia central é simples: muita
gente quer se movimentar, mas não encontra alguém para começar ou continuar.

O projeto entrega três camadas:

1. **Protótipo navegável** com 20 telas em um device frame de 390 × 844.
2. **Design system “Mineral”** aplicado de ponta a ponta.
3. **Apresentação/pitch** em página única, com conceito, jornada, GenUI,
   arquitetura, galeria das telas e acabamento.

A promessa do produto aparece em uma frase:

> **Treino que encontra companhia.**

---

## 2. Repositório e versionamento

| Item | Valor |
| --- | --- |
| Repositório | `https://github.com/vinicius-luz-assuncao/prototipation.git` |
| Remote | `origin` |
| Branch principal | `main` |
| Último commit enviado | `d7ce196` — “Adiciona imagens aos cards de conceito” |
| Branch secundária | `design/mineral` (mantida no remoto) |
| Licença | Projeto acadêmico, sem licença de distribuição definida |

O projeto **está vinculado ao GitHub** e a branch `main` está sincronizada com
`origin/main`.

### Arquivos locais não versionados no momento

Estes arquivos existem na pasta, mas não fazem parte do último commit:

| Arquivo | Situação |
| --- | --- |
| `index_02.html` | Variação local da apresentação, com textos mais curtos. Não é usada pelo site principal. |
| `assets/img/problema.jpg` | Imagem original em alta resolução usada para gerar o card. |
| `assets/img/virada.jpg` | Imagem original em alta resolução usada para gerar o card. |
| `assets/img/proposta.jpg` | Imagem original em alta resolução usada para gerar o card. |
| `app.zip` | Pacote local do protótipo, aproximadamente 54 MB. Evitar commitar sem necessidade. |

O PDF `vem-apresentacao.pdf` e a pasta `_build/` são artefatos locais e estão no
`.gitignore`.

---

## 3. Problema, insight e proposta

### O problema

Muitas pessoas deixam de praticar atividades físicas por falta de companhia,
insegurança e medo de julgamentos. A dificuldade de encontrar pessoas com
interesses semelhantes e ambientes acolhedores pode gerar desmotivação,
isolamento e abandono da prática esportiva.

**Barreira de entrada.**

### A virada

Quando existe uma conexão, a atividade física ganha um novo significado.
Encontrar alguém, compartilhar experiências e ter companhia torna o momento mais
prazeroso. Essas interações podem estimular a motivação e despertar a vontade de
continuar.

**Vínculo antes de performance.**

### A proposta

O app conecta pessoas por meio de busca e match com base em interesses,
objetivos, localização e modalidades esportivas. É possível encontrar parceiros
de treino, criar e participar de grupos, conversar pelo chat, combinar encontros
e compartilhar conquistas. Com filtros de afinidade e uma comunidade inclusiva,
o vem promove conexões sem julgamentos e incentiva a prática contínua.

**Humano no controle.**

---

## 4. O que o projeto entrega

- Protótipo de **20 telas** navegáveis por cliques, teclado e URL (`?tela=NN`).
- **Onboarding** com verificação social, criação de perfil, objetivo,
  interesses, senha e tela de sucesso.
- **Jornada adaptativa** com três caminhos definidos na tela 05.
- **Home com GenUI/LUI**: a pessoa escreve o que quer e recebe um card editável.
- **Match**, **Atividades**, **Social**, **Feed** e **Perfil**.
- **vem+** (premium), feedback, sobre, configurações e notificações.
- **Design system Mineral** documentado e implementado em tokens CSS.
- **Apresentação navegável** (`index.html`) e PDF gerado (`vem-apresentacao.pdf`).
- Conteúdo em **PT-BR**, com copy real, sem lorem ipsum.
- Todos os recursos locais: fontes, ícones, fotos e ilustrações.

---

## 5. Como abrir

Não precisa instalar nada.

| Arquivo | O que é |
| --- | --- |
| `index.html` | Apresentação do projeto |
| `app.html` | Protótipo navegável com as 20 telas |
| `vemapp_projeto.md` | Este documento |
| `README.md` | Guia rápido de uso e estrutura |
| `DESIGN_SYSTEM.md` | Documento do sistema visual |

Para navegar com URLs (`app.html?tela=05`), sirva a pasta localmente:

```bash
python -m http.server 4173
# abra http://127.0.0.1:4173/index.html
```

O protótipo também abre por `file://`; apenas o parâmetro `?tela=` deixa de ser
lido, mas a navegação interna continua funcionando.

---

## 6. Arquitetura e estrutura

```text
.
├─ index.html                    apresentação/pitch (8 seções)
├─ app.html                      protótipo: 20 telas + tabbar + rail desktop
├─ README.md                     guia rápido
├─ DESIGN_SYSTEM.md              referência do design system
├─ design-system.php             referência histórica (não editar)
├─ vemapp_projeto.md             este documento
├─ vem-apresentacao.pdf          PDF gerado (ignorado pelo Git)
│
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css              cores, tipografia, grid, raios, sombras
│  │  ├─ base.css                reset, tipografia base, device frame
│  │  ├─ components.css          botões, chips, cards, avatar, tabbar, toast
│  │  ├─ screens.css             layout específico das 20 telas
│  │  ├─ site.css                layout da apresentação
│  │  └─ print.css               paginação A4 do PDF
│  │
│  ├─ js/
│  │  ├─ icons.js                sprite SVG inline
│  │  ├─ data.js                 pessoas, grupos, treinos, matches, sugestões
│  │  ├─ ui.js                   GenUI/LUI, jornada, filtros, chips e toasts
│  │  └─ app.js                  roteador, tabbar, escala do device
│  │
│  ├─ fonts/                     Abril Fatface, Nunito Sans, Jost, Oswald
│  ├─ img/                       fotos, avatares, eventos, feed e ilustrações
│  └─ screens/                   s01.png … s20.png (capturas 390 × 844)
│
└─ _build/                       scripts locais de captura e QA (ignorado)
```

### Decisões técnicas

- **Sem build:** os arquivos são abertos diretamente no navegador.
- **Sem dependência externa:** fontes e imagens são locais.
- **Roteamento simples:** `app.js` lê `data-screen`, `data-nav`, `data-back` e
  `data-tab`, além do parâmetro `?tela=`.
- **Estado local:** a jornada escolhida é salva em `localStorage`
  (`vem.goal.v1`).
- **Cache busting manual:** ao alterar CSS/JS, atualizar `?v=` no `<link>` ou
  `<script>` correspondente.
- **Mobile first no protótipo:** até 1180 px o app ocupa a tela inteira; acima
  disso aparece o rail lateral e o device frame.

---

## 7. As 20 telas

| # | Tela | Grupo | Papel |
| --- | --- | --- | --- |
| 01 | Boas-vindas | Onboarding | Apresenta a promessa e as duas entradas |
| 02 | Verificação | Onboarding | Código de 6 dígitos |
| 03 | Verificado | Onboarding | Confirmação do selo |
| 04 | Criar perfil | Onboarding | Dados essenciais + foto |
| 05 | **Objetivo** | Onboarding | **Ponto de ramificação da jornada** |
| 06 | Interesses | Onboarding | Modalidades e ritmo |
| 07 | Senha | Onboarding | Requisitos em tempo real |
| 08 | Pronto | Onboarding | Celebração e entrada no app |
| 09 | Login | Onboarding | Retorno para quem já tem conta |
| 10 | Início | App | Card GenUI + LUI + treino do dia |
| 11 | Perfil | App | Progresso, constância e preferências |
| 12 | Match | App | Pessoas por perto com compatibilidade |
| 13 | Atividades | App | Busca, filtros e eventos |
| 14 | Social | App | Conexões e grupos |
| 15 | Feed | App | Histórias e conquistas |
| 16 | vem+ | Conta | Premium com preço claro |
| 17 | Feedback | Conta | Avaliação rápida |
| 18 | Sobre | Conta | Propósito e valores |
| 19 | Configurações | Conta | Conta, privacidade e acessibilidade |
| 20 | Notificações | Conta | Controle granular + retorno ao projeto |

### Navegação principal

Tabbar fixa com cinco abas: **Início, Match, Social, Feed, Perfil**.
As telas 13, 16, 17, 18, 19 e 20 são acessadas por atalhos contextuais.

---

## 8. Fluxos principais

### 8.1 Onboarding e jornada adaptativa

A tela **05 — Objetivo** não é um formulário: é o ponto de ramificação. A escolha
define a primeira tela depois do onboarding e o card que a Home gera.

| Caminho | Objetivo | Ordem pós-onboarding | Card da Home |
| --- | --- | --- | --- |
| **A** | Se conectar | Match → Categorias → Feed | “Encontramos 3 pessoas com o mesmo interesse em Yoga. Quer ver?” |
| **B** | Autocuidado | Perfil e métricas → Match | “Sua meta está em 60%. Sugerimos um treino rápido de 15 min.” |
| **C** | Eventos e comunidade | Feed de atividades | “Há um evento de corrida no seu bairro neste sábado. Quer se inscrever?” |

- Seleção única com três cards grandes, contador visível e `aria-pressed`.
- A escolha fica em `localStorage` (`vem.goal.v1`).
- Sem escolha salva, o app abre na jornada **Autocuidado**.
- O chip “Jornada: …” na Home permite trocar o objetivo a qualquer momento.

### 8.2 GenUI + LUI na Home

1. **Você fala** — a pessoa escreve algo como “quero yoga para aliviar o estresse”.
2. **O LUI rascunha** — intenção, duração, lugar e intensidade viram uma sugestão.
3. **Você decide** — “Ver treino” ou “Descartar”. Se descartar, o desfazer fica
   disponível.

Nada é salvo sem confirmação. Toda sugestão pode ser refeita, descartada ou
desfeita.

### 8.3 Atividades, match e social

- **Match:** pessoas próximas com compatibilidade explicada por rotina, nível e
  bairro — não por aparência.
- **Atividades:** busca por modalidade ou bairro, filtros e seis atividades,
  incluindo **Corrida no Parque** e **Yoga ao pôr do sol**.
- **Social:** conexões, grupos e contextos em comum.
- **Feed:** fotos reais de corrida e yoga, conquistas e histórias.

### 8.4 Conta e confiança

- **vem+** comunica preço com âncora anual e benefícios claros.
- **Feedback** faz uma pergunta e oferece cinco respostas.
- **Configurações** cobre conta, privacidade e acessibilidade.
- **Notificações** tem controle granular e mantém o retorno à página do projeto.

### 8.5 Controle temporário de teste

As telas **01 a 08** exibem um botão flutuante **“Pular onboarding”**. Ele leva
direto à Home (10) e mostra o toast “Onboarding pulado. Modo de teste.”.

> **Atenção:** esse controle é temporário e deve ser removido antes da entrega
> final. Ele não aparece no PDF nem nas capturas de tela.

---

## 9. Design system Mineral

### 9.1 Princípio

Mineral é um sistema **plano, lavanda e silencioso**. A estrutura aparece por
bordas de 1 px e contraste de tinta, não por sombras. A cor é reservada para
pontos de energia — ação, afinidade, cuidado, progresso — e nunca decora.

### 9.2 Paleta principal

| Token | Hex | Uso |
| --- | --- | --- |
| `--paper` | `#FCF8FC` | Fundo do app e da apresentação |
| `--surface` | `#FFFFFF` | Cards, inputs e tabbar |
| `--line` | `#E7DAE7` | Borda padrão de 1 px |
| `--ink` | `#302437` | Texto, títulos e ícones |
| `--ink-muted` | `#6D596D` | Texto secundário |
| `--vermilion` | `#F57335` | Ação primária |
| `--plum` | `#F77CC5` | Afinidade, match e GenUI |
| `--sky` | `#C799C8` | Cuidado e seleção |
| `--sage` | `#DAE35A` | Progresso e conquistas |
| `--purple` | `#66416B` | vem+ / premium |

**Regra:** laranja só para a próxima ação. Texto pequeno usa as versões `-ink`,
nunca a cor pura.

### 9.3 Tipografia

| Família | Papel |
| --- | --- |
| **Abril Fatface** | Marca (`vem`), preço e nome no perfil |
| **Nunito Sans** | Títulos, interface, corpo e rótulos |

A apresentação usa títulos de seção grandes, com `letter-spacing` negativo.
O app mantém hierarquia fixa entre H1, título de card, corpo e microtexto.

### 9.4 Espaçamento e grade

- Grade estrita de **8 px**: `8 · 16 · 24 · 32 · 48 · 64 · 80`.
- Margem lateral das telas: **24 px**.
- Gutter: **16 px**.
- Alvos de toque: mínimo **48 × 48 px**.
- CTA principal sempre na metade inferior da tela.

### 9.5 Componentes

- **Botões:** primário laranja, secundário branco com borda, fantasma sem fundo.
- **Inputs:** 50 px de altura, borda de 1 px e foco visível.
- **Chips:** seleção com fundo de tinta e texto claro.
- **Cards:** brancos, borda de 1 px, raio de 20 px, sem sombra.
- **Tabbar:** 78 px, branca, com ponto laranja na aba ativa.
- **GenUI:** card branco com ações confirmar/descartar e undo em pílula.
- **Toasts:** tinta escura, ação de desfazer quando necessário.

### 9.6 Acessibilidade

- Contraste mínimo **AA** para texto pequeno.
- Alvos de toque de no mínimo **48 px**.
- Foco de teclado visível em todos os controles.
- `aria-pressed` em escolhas e `aria-label` em ícones sem texto.
- Estado nunca comunicado apenas por cor.
- `prefers-reduced-motion` reduz animações.
- Conteúdo em `pt-BR`, com `lang="pt-BR"`.

---

## 10. Conteúdo e imagens

- **Avatares reais:** `ana-beatriz-avatar.jpg`, `marina-avatar.jpg`,
  `camila-avatar.jpg`, `rafael-avatar.jpg`, `luiza-avatar.jpg` e
  `bruna-avatar.jpg`.
- **Perfil próprio:** avatar de Ana Beatriz + capa `ana-capa.jpg`.
- **Eventos:** `evento-corrida-no-parque.jpg` e `evento-yoga.jpg`.
- **Feed:** `feed-marina-corrida.jpg` e `feed-rafael-yoga.jpg`.
- **Cards de conceito:** `problema-card.jpg`, `virada-card.jpg` e
  `proposta-card.jpg`, versões 4:3 otimizadas a partir das imagens originais.
- **Ilustrações:** SVGs locais para splash, verificação, boas-vindas e capas.

As imagens usadas na interface são otimizadas para web. Os arquivos originais das
três fotos dos cards de conceito permanecem em `assets/img/`, mas não são
carregados pela página.

---

## 11. Evolução do projeto

| Commit | Data | Entrega |
| --- | --- | --- |
| `2e84379` | 30/10/2026 | Protótipo inicial: 20 telas, jornadas adaptativas e apresentação |
| `cf79248` | 06/11/2026 | Re-skin Mineral + textos do pitch + apresentação e PDF |
| `25f9938` | 06/11/2026 | Merge da branch `design/mineral` na `main` |
| `32e6b6f` | 07/11/2026 | Atualização das artes, remoção de P&B e aura animada |
| `2611d18` | 07/11/2026 | Tela cheia no mobile + retorno à página do projeto |
| `f735b88` | 07/11/2026 | Atualização de SVG com imagem rasterizada |
| `932420d` | 09/11/2026 | Eventos, fotos e avatares reais no protótipo |
| `908e82a` | 09/11/2026 | Botão temporário “Pular onboarding” |
| `d7ce196` | 09/11/2026 | Imagens nos três cards de conceito da apresentação |

### Marcos conceituais

1. **Base funcional** — as 20 telas e o roteamento.
2. **Identidade** — adoção do sistema Mineral e da paleta lavanda/tinta.
3. **Conteúdo real** — substituição de placeholders por pessoas, eventos e
   imagens reais.
4. **Refinamento de pitch** — nova apresentação, textos e cards visuais.
5. **Testes de navegação** — botão temporário de skip do onboarding.

---

## 12. Estado atual, QA e artefatos

### O que está validado

- Navegação entre as 20 telas e pela URL `?tela=NN`.
- Tabbar contextual, rail de desktop e escala do device.
- Layout mobile em **390 × 844**, tablet em **768 × 1024** e desktop em
  **1024 × 768**.
- Sem overflow horizontal nas telas testadas.
- Botão de skip visível apenas no onboarding, com navegação para a Home e toast.
- Cards de conceito responsivos em **1440 px**, **900 px** e **390 px**, com
  imagens carregando e cards alinhados.
- Nenhuma dependência externa de rede.

### Capturas e PDF

- `assets/screens/s01.png` … `s20.png` são as capturas usadas na galeria.
- As capturas **não incluem** o botão temporário de skip.
- `vem-apresentacao.pdf` é um artefato gerado e está no `.gitignore`.
- O PDF atual **ainda não inclui** as imagens novas dos cards de conceito.

### Como regerar o PDF

1. Regenere as capturas em 390 × 844, se as telas mudaram.
2. Abra `index.html` no Chrome.
3. `Ctrl+P` → **Salvar como PDF** → A4 → margens **Nenhuma** → marcar
   **Gráficos de plano de fundo**.

---

## 13. Pendências e próximos passos

1. **Remover o botão “Pular onboarding”** e o toast de teste antes da entrega.
2. **Regerar as capturas e o PDF** se a apresentação for congelada.
3. **Revisar os arquivos não versionados:** decidir se `index_02.html`, os
   originais das fotos e `app.zip` entram no repositório ou ficam apenas locais.
4. **Atualizar o `DESIGN_SYSTEM.md`** em uma próxima rodada: ele ainda menciona
   `avatar.jpg` como placeholder e não reflete todos os assets atuais. É uma
   referência histórica, portanto foi mantido sem alterações.
5. **Revisar acessibilidade do skip** ou confirmar sua remoção, já que é um
   controle de teste fora do fluxo definitivo.

---

## 14. Documentos relacionados

| Documento | Conteúdo |
| --- | --- |
| [`README.md`](README.md) | Guia rápido: como abrir, estrutura, telas, jornada, GenUI e PDF |
| [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) | Sistema visual completo: cor, tipo, grid, componentes, movimento e acessibilidade |
| [`index.html`](index.html) | Pitch navegável: conceito, sistema, leis, jornada, GenUI, arquitetura, telas e acabamento |
| [`app.html`](app.html) | Protótipo funcional com as 20 telas |
| `vemapp_projeto.md` | Este documento: visão consolidada, evolução e estado do projeto |

---

## 15. Convenções de manutenção

- **Sem build:** não introduzir bundler, framework ou etapa de compilação.
- **PT-BR:** toda a copy visível deve permanecer em português.
- **Grid de 8 px** e alvos de toque de **48 px** são regras, não sugestões.
- **Sem internet:** fontes, ícones e imagens devem continuar locais.
- **Cache busting:** ao alterar CSS ou JS, subir o `?v=` correspondente nos HTML.
- **Cards do app:** borda de 1 px, sem sombra.
- **Texto pequeno:** usar versões `-ink` das cores de energia.
- **Fotografias:** pessoas em cor; duotone apenas em fotos de match.
- **Artefatos gerados** (`_build/`, `vem-apresentacao.pdf`, pacotes `.zip`) não
  devem ser commitados.

---

## 16. Histórico deste documento

| Data | Alteração |
| --- | --- |
| 17/11/2026 | Criação do documento consolidado a partir do estado do commit `d7ce196` |
