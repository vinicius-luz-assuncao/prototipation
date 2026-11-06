# VEM — DESIGN SYSTEM “MINERAL”

> **Projeto:** vem — treino que encontra companhia
> **Tipo:** protótipo navegável de 20 telas (HTML/CSS/JS, sem build) + apresentação
> **Implementação:** `assets/css/tokens.css`, `base.css`, `components.css`, `screens.css`, `site.css`
> **Referência histórica:** `design-system.php` (sistema editorial anterior, mantido apenas como registro)

---

## 01. PRINCÍPIO

Mineral é um sistema **plano, lavanda e silencioso**. A estrutura aparece por
bordas de 1 px e contraste de tinta, não por sombras. A cor é reservada para
pontos de energia — ação, afinidade, cuidado, progresso — e nunca decora.

```text
superfície clara → espaço → conteúdo
acento forte     → uma única intenção por tela
tipografia       → hierarquia antes de cor
```

---

## 02. COR

### Base

| Token             | Hex       | Uso                                      |
| ----------------- | --------- | ---------------------------------------- |
| `--paper`         | `#FCF8FC` | Fundo do app, das telas e da apresentação |
| `--surface`       | `#FFFFFF` | Cards, inputs, tabbar                    |
| `--line`          | `#E7DAE7` | Borda padrão de 1 px                     |
| `--line-strong`   | `#D6C3D6` | Borda de ênfase e foco                   |
| `--ink`           | `#302437` | Texto, títulos, ícones                   |
| `--ink-2`         | `#46334A` | Texto de apoio                           |
| `--ink-muted`     | `#6D596D` | Texto secundário                         |
| `--ink-ghost`     | `#8A7689` | Metadados e legendas                     |

### Energia

| Token         | Hex       | Significado                          |
| ------------- | --------- | ------------------------------------ |
| `--vermilion` | `#F57335` | Ação primária (CTA)                  |
| `--plum`      | `#F77CC5` | Afinidade, match, GenUI              |
| `--sky`       | `#C799C8` | Cuidado, seleção, notas              |
| `--sage`      | `#DAE35A` | Progresso, conquistas                |
| `--purple`    | `#66416B` | vem+ / premium                       |
| `--disabled`  | `#97999B` | Ação indisponível                    |

### Versões AA (texto pequeno)

`--vermilion-ink #A64312` · `--plum-ink #A1336F` · `--sky-ink #6B4370` ·
`--sage-ink #5D6B2C` · `--purple-ink #55355A`.

**Regra:** cor pura só em blocos, ícones e rótulos grandes. Texto pequeno usa a
versão `-ink` ou tinta.

### Tints

`--tint-vermilion #FDE7DA` · `--tint-plum #FDE5F2` · `--tint-sky #F1E4F1` ·
`--tint-sage #EEF2D4` · `--tint-purple #EFE5F0`.

### Gradientes

- `--grad-warm`: lavanda → rosa → papel (fechamento, capas suaves).
- `--grad-cool`: lilás → lima → papel (perfil).
- `--grad-violet`: `#302437 → #4E3153 → #66416B` (premium, seção GenUI).
- `--grad-ink`: `#302437 → #4A3450`.

---

## 03. TIPOGRAFIA

| Família       | Papel                                              |
| ------------- | -------------------------------------------------- |
| `Abril Fatface` | Apenas marca (`vem`), preço e nome no perfil      |
| `Nunito Sans` | Todo o resto: títulos, interface, corpo e rótulos   |

Pesos disponíveis: 400, 600, 700, 800.

| Estilo          | Tamanho / linha | Peso | Uso                          |
| --------------- | --------------- | ---- | ---------------------------- |
| H1              | 27 / 32         | 700  | Título de tela               |
| Card title      | 22 / 26         | 700  | Título de card               |
| Section         | 14 / 19         | 800  | Cabeçalho de seção           |
| Eyebrow         | 10 / 14         | 600  | Rótulo uppercase, +0.09em    |
| Body            | 14 / 20         | 400  | Texto corrente               |
| Micro           | 11 / 16         | 600  | Apoio                        |
| Micro small     | 9 / 12          | 600  | Legendas                     |
| Button          | 15 / 20         | 800  | Rótulo de ação               |

Apresentação: H1 até 82 px / 800, títulos de seção 34–54 px / 800,
`letter-spacing` entre −0.02em e −0.035em.

---

## 04. ESPAÇAMENTO E GRADE

Grade estrita de 8 px: `8 · 16 · 24 · 32 · 48 · 64 · 80`.

```css
--margin: 24px;   /* margem lateral das telas */
--gutter: 16px;   /* respiro entre colunas   */
```

- Conteúdo das telas: padding lateral 24 px, gap vertical 16 px.
- Cards: padding 16 px, gap interno 10 px.
- Alvos de toque: mínimo 48 × 48 px.
- CTA primário sempre na metade inferior da tela.

---

## 05. RAIO E ELEVAÇÃO

| Token       | Valor | Uso                                  |
| ----------- | ----- | ------------------------------------ |
| `--r-sm`    | 8 px  | detalhes                             |
| `--r-md`    | 20 px | cards, inputs, botões                |
| `--r-lg`    | 24 px | blocos e cards de destaque           |
| `--r-pill`  | 999px | chips, badges, segmented             |

Sombras são exceção: `--shadow-1/2/3` existem para overlays e apresentação.
**Cards do app usam borda de 1 px, não sombra.**

---

## 06. COMPONENTES

### Botões

- Altura 54 px, raio 20 px, rótulo 15/20 w800.
- Primário: fundo `--vermilion`, rótulo `--ink`.
- Secundário: fundo `--surface`, borda `--line`, rótulo `--ink`.
- Fantasma: sem fundo, rótulo `--ink-muted`.
- Desabilitado: fundo `--disabled`, rótulo branco, sem hover.

### Inputs

- Altura 50 px, raio 20 px, fundo branco, borda 1 px.
- Foco: borda `--ink` + anel `--tint-sky`.
- Busca com ícone à esquerda, 20 px, stroke 1.6.

### Chips e tags

- Raio 100%, altura mínima 40 px.
- Selecionado: fundo `--ink`, texto `--paper`.
- Tag de categoria: fundo `--tint-*`, texto `--*-ink`.

### Cards

- Fundo `--surface`, borda 1 px `--line`, raio 20 px.
- Sem sombra; hover só eleva na apresentação.

### Segmented control

- Trilho `--sky` (#C799C8), raio 30 px.
- Pílula ativa branca, texto `--ink`.

### Progresso

- Trilho 5 px, `--sky`.
- Preenchimento `--ink`.
- Rótulo `Etapa X de 4` em 10/14 w600.

### Tab bar

- Altura 78 px, fundo branco, borda superior 1 px.
- 5 abas: Início, Match, Social, Feed, Perfil.
- Ativa: ícone e rótulo em `--ink` + ponto laranja 5 × 3 px.

### Notas

- Fundo lilás sólido `--sky`, texto `--ink`, raio 20 px.
- Sem transparência e sem listra lateral.

### GenUI

- Badge em eyebrow (sem pílula escura).
- Card branco com borda, ações confirmar/descartar.
- Undo em pílula de tinta.

---

## 07. ANATOMIA DA TELA (390 × 844)

```text
status bar        46 px
header            40 px   (chevron 18 px + título centralizado 14/19 w800)
progresso         74 px   (rótulo 10/14 + trilho 5 px)
conteúdo          24 px de margem, gap 16 px
tab bar           78 px   (apenas telas de navegação)
```

- Moldura do device: 390 × 844, raio 22 px, borda 9 px `--ink`.
- Área segura inferior respeita a tab bar.

---

## 08. MOVIMENTO

- `--dur-1 160ms` · `--dur-2 240ms` · `--dur-3 320ms`.
- Curva padrão `--ease: cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Animações explicam mudança: entrada de card, swipe de match, progresso.
- `prefers-reduced-motion` reduz tudo a 0.01 ms.

---

## 09. ACESSIBILIDADE

- Contraste mínimo AA (4.5:1) para texto pequeno.
- Alvos de toque ≥ 48 px.
- Foco visível em todos os controles.
- `aria-pressed` em escolhas, `aria-label` em ícones sem texto.
- Nunca depender só de cor para comunicar estado.
- Texto PT-BR, `lang="pt-BR"`.

---

## 10. TELAS

```text
01 Boas-vindas        08 Pronto            15 Feed
02 Verificação        09 Login             16 vem+
03 Verificado         10 Home (GenUI)      17 Feedback
04 Criar perfil        11 Perfil            18 Sobre
05 Objetivo (ramifica) 12 Match            19 Configurações
06 Interesses         13 Atividades         20 Notificações
07 Senha              14 Social
```

O onboarding ramifica na tela 05 em três jornadas (autocuidado, conexão,
eventos). A tela 10 mantém o fluxo de GenUI/LUI com confirmar, descartar e
desfazer em qualquer caminho.

---

## 11. O QUE EVITAR

- Sombras em cards do app.
- Mais de uma cor de energia competindo na mesma dobra.
- Texto pequeno sobre cor pura.
- Cantos menores que 8 px em superfícies interativas.
- Gradientes fora de premium, perfil e capas.
- Fotografias genéricas — o protótipo usa `avatar.jpg` com tratamento e SVG.
