# vem — fitness + comunidade

Protótipo navegável de 20 telas para um app de treino que encontra companhia.
**Treino que encontra companhia.**

Projeto acadêmico de UI/UX: interface, sistema de design e apresentação, tudo em
HTML, CSS e JavaScript puros. Sem build, sem framework, sem dependência de internet.

---

## Como abrir

Não precisa instalar nada.

| Arquivo | O que é |
| --- | --- |
| `index.html` | Apresentação do projeto (conceito, sistema, jornada, GenUI, telas, acabamento) |
| `app.html` | Protótipo navegável com as 20 telas em um device frame 390 × 844 |
| `DESIGN_SYSTEM.md` / `design-system.php` | Referências de design (documento de origem, não editar) |

Abra `index.html` direto no navegador. Para navegar entre telas com URL
(`app.html?tela=05`), sirva a pasta localmente:

```bash
python -m http.server 4173
# depois abra http://127.0.0.1:4173/index.html
```

O protótipo também abre por `file://`, só o parâmetro `?tela=` do endereço deixa
de ser lido — a navegação continua funcionando normalmente.

---

## Estrutura

```
.
├─ index.html               apresentação (uma página, 8 seções)
├─ app.html                 protótipo: as 20 telas + tabbar + rail de desktop
├─ DESIGN_SYSTEM.md         referência de design (read-only)
├─ design-system.php        referência de design (read-only)
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css         cores, tipografia, grid de 8 px, raios, sombras
│  │  ├─ base.css           reset, tipografia base, layout do device
│  │  ├─ components.css     botões, chips, cards, avatar, tabbar, ícones…
│  │  ├─ screens.css        layout de cada uma das 20 telas
│  │  ├─ site.css           layout da apresentação
│  │  └─ print.css          paginação A4 para gerar o PDF
│  ├─ js/
│  │  ├─ icons.js           sprite SVG inline (sem requisições externas)
│  │  ├─ data.js            conteúdo: pessoas, grupos, treinos, jornadas, sugestões
│  │  ├─ ui.js              interações: GenUI/LUI, jornada, filtros, toasts
│  │  └─ app.js             roteador (?tela=NN), tabbar, escala do device
│  ├─ fonts/                Abril Fatface, Jost, Nunito Sans, Oswald (woff2)
│  ├─ img/                  avatar.jpg + ilustrações e capas em SVG
│  └─ screens/              s01.png … s20.png (capturas usadas na galeria e no PDF)
└─ vem-apresentacao.pdf     PDF gerado a partir de index.html + print.css
```

---

## As 20 telas

| # | Tela | # | Tela |
| --- | --- | --- | --- |
| 01 | Boas-vindas | 11 | Perfil |
| 02 | Verificação | 12 | Match |
| 03 | Verificado | 13 | Atividades |
| 04 | Criar perfil | 14 | Social |
| 05 | **Objetivo** (ramificação) | 15 | Feed |
| 06 | Interesses | 16 | vem+ |
| 07 | Senha | 17 | Feedback |
| 08 | Pronto | 18 | Sobre |
| 09 | Login | 19 | Configurações |
| 10 | Início | 20 | Notificações |

Regras de interface aplicadas em todas as telas:

- grade de espaçamento de **8 px**;
- alvos de toque com no mínimo **48 px**;
- CTA principal sempre na metade inferior da tela;
- tabbar fixa de 5 abas: **Início, Match, Social, Feed, Perfil**;
- copy em PT-BR, sem texto de preenchimento.

---

## Jornada adaptativa

A tela **05 — Objetivo** não é um formulário: é o ponto de ramificação. A escolha
define a primeira tela depois do onboarding e o card inteligente que a Home gera.

| Caminho | Objetivo | Ordem pós-onboarding | Card da Home |
| --- | --- | --- | --- |
| **A** | Se conectar | Match → Categorias → Feed | “Encontramos 3 pessoas com o mesmo interesse em Yoga. Quer ver?” |
| **B** | Autocuidado | Perfil e métricas → Match | “Sua meta está em 60%. Sugerimos um treino rápido de 15 min.” |
| **C** | Eventos e comunidade | Feed de atividades | “Há um evento de corrida no seu bairro neste sábado. Quer se inscrever?” |

- Seleção única, com três cards grandes e visualmente distintos (Lei de Fitts /
  Lei de Hick), contador visível e `aria-pressed`.
- A escolha fica em `localStorage` (`vem.goal.v1`) e é lida ao reabrir o app.
- O botão **Acessar o app** (tela 08) leva à primeira tela da jornada escolhida.
- O card da Home muda de conteúdo, etiqueta, meta e CTA conforme a jornada.
- Sem escolha salva, o app abre na jornada **Autocuidado** como padrão.

Para testar: abra `app.html?tela=05`, escolha um caminho, avance até a tela 08 e
toque em **Acessar o app**. O chip “Jornada: …” na Home permite trocar o objetivo
a qualquer momento.

---

## GenUI + LUI na Home

A Home combina um campo de linguagem natural (LUI) com um card gerado (GenUI):

1. **Você fala** — escreva algo como “quero yoga para aliviar o estresse” no campo
   da Home e envie.
2. **O LUI rascunha** — o campo reconhece intenção, tempo e nível e monta o card.
3. **Você decide** — o card aparece com **Ver treino** e **Descartar**.
   Descartar mostra um toast com **Desfazer**, então nada é perdido por engano.

Tudo acontece no navegador; nenhum dado é enviado para lugar nenhum.

---

## PDF da apresentação

`vem-apresentacao.pdf` é um **artefato gerado**, não código-fonte. Ele sai de
`index.html` + `assets/css/print.css` (10 páginas A4), com as capturas de
`assets/screens/`.

Para regerar depois de mudar a apresentação ou as telas:

1. Regenere as capturas em 390 × 844 (`assets/screens/s01.png` … `s20.png`).
2. Abra `index.html` no Chrome.
3. `Ctrl+P` → destino **Salvar como PDF** → papel A4 → margens **Nenhuma** →
   marcar **Gráficos de plano de fundo**.

O layout de impressão já cuida de quebras de página, cores e ocultação do que é
só de tela.

---

## Notas

- `DESIGN_SYSTEM.md` e `design-system.php` são as referências originais e não
  devem ser alterados.
- Todas as imagens são locais: um único `avatar.jpg` para pessoas e SVGs para
  todo o resto. Zero requisições externas.
- Ao editar CSS ou JS, atualize o `?v=` no `<link>` / `<script>` correspondente
  para evitar cache antigo durante a avaliação.
