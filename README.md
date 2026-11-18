# vem — fitness + comunidade

Protótipo navegável de 23 telas para um app de treino que encontra companhia.
**Treino que encontra companhia.**

Projeto acadêmico de UI/UX: interface, sistema de design e apresentação, tudo em
HTML, CSS e JavaScript puros. Sem build, sem framework, sem dependência de internet.

---

## Como abrir

Não precisa instalar nada.

| Arquivo | O que é |
| --- | --- |
| `index.html` | Apresentação do projeto (conceito, sistema, jornada, GenUI, telas, acabamento) |
| `app.html` | Protótipo navegável com as 23 telas em um device frame 390 × 844 |
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
├─ app.html                 protótipo: as 23 telas + tabbar + rail de desktop
├─ DESIGN_SYSTEM.md         referência de design (read-only)
├─ design-system.php        referência de design (read-only)
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css         cores, tipografia, grid de 8 px, raios, sombras
│  │  ├─ base.css           reset, tipografia base, layout do device
│  │  ├─ components.css     botões, chips, cards, avatar, tabbar, ícones…
│  │  ├─ screens.css        layout de cada uma das 23 telas
│  │  ├─ site.css           layout da apresentação
│  │  └─ print.css          paginação A4 para gerar o PDF
│  ├─ js/
│  │  ├─ icons.js           sprite SVG inline (sem requisições externas)
│  │  ├─ data.js            conteúdo: pessoas, atividades, grupos, eventos, jornadas
│  │  ├─ store.js           estado persistido em localStorage + reset/log
│  │  ├─ ui.js              interações: GenUI/LUI, jornada, foto de perfil, toasts
│  │  ├─ social.js          login, verificação, interesses, match, chat e social
│  │  └─ app.js             roteador (?tela=NN), tabbar, escala do device
│  ├─ fonts/                Abril Fatface, Jost, Nunito Sans, Oswald (woff2)
│  ├─ img/                  fotos de pessoas, avatares recortados, eventos, feed e ilustrações SVG
│  └─ screens/              s01.png … s20.png (capturas usadas na galeria e no PDF)
└─ vem-apresentacao.pdf     PDF gerado a partir de index.html + print.css
```

---

## As 23 telas

| # | Tela | # | Tela |
| --- | --- | --- | --- |
| 01 | Boas-vindas | 13 | Atividades |
| 02 | Verificação | 14 | Social |
| 03 | Verificado | 15 | Feed |
| 04 | Criar perfil | 16 | vem+ |
| 05 | **Objetivo** (ramificação) | 17 | Feedback |
| 06 | Interesses | 18 | Sobre |
| 07 | Senha | 19 | Configurações |
| 08 | Pronto | 20 | Notificações |
| 09 | Login | 21 | Documentação do educador (CREF) |
| 10 | Início | 22 | Conversa simulada |
| 11 | Perfil | 23 | Meus eventos |
| 12 | Match | | |

Regras de interface aplicadas em todas as telas:

- grade de espaçamento de **8 px**;
- alvos de toque com no mínimo **48 px**;
- CTA principal sempre na metade inferior da tela;
- tabbar fixa de 5 abas: **Início, Match, Social, Feed, Perfil**;
- copy em PT-BR, sem texto de preenchimento.

---

## Rodada de testes v2

Esta rodada aprofunda o fluxo social e de confiança. Tudo é **simulado no
navegador**, sem backend, e o estado fica em `localStorage` (`assets/js/store.js`).

- **Login com Google** (tela 01) conecta uma conta simulada e segue para a
  verificação.
- **Verificação não trava:** a pessoa vê “Verificar agora” e pode “verificar
  depois”. Ao verificar, passa pela tela 03 (selo) e volta para onde estava.
- **Perfil vazio no início:** o testador começa sem dados; nome, e-mail e foto
  (upload da tela 04 ou depois no Perfil) ficam salvos como data URL durante o
  teste.
- **Dois níveis de interesse:** contextos amplos (tela 06) e atividades
  específicas (até 5 favoritas). Contextos alimentam o match geral; atividades
  alimentam o match específico, o leque do FAB e as sugestões de grupos.
- **Caminho do educador:** escolher “Sou educador físico” (tela 05) leva à
  tela 21 (CREF simulado, selo “em análise”) e depois aos interesses.
- **Match específico:** o FAB de estrela abre o leque de atividades. Sem
  atividade em comum, o FAB continua disponível para escolher por onde começar.
- **Conversa simulada:** o terceiro like dispara o chat (tela 22), com roteiro
  sim/não, convite de evento e convites por contexto.
- **Social em três abas:** Conexões, Grupos e Eventos (tela 23). Posts do Feed
  carregam a atividade e geram sinais ao curtir/salvar.

Para resetar o teste, abra `app.html?reset=1` ou use **Configurações → Redefinir
teste**; o log de ações pode ser baixado em **Configurações → Exportar log**.

Veja `vem-rodada-testes.md` para o roteiro completo.

---

## Jornada adaptativa

A tela **05 — Objetivo** não é um formulário: é o ponto de ramificação. A escolha
define a primeira tela depois do onboarding e o card inteligente que a Home gera.

| Caminho | Objetivo | Ordem pós-onboarding | Card da Home |
| --- | --- | --- | --- |
| **A** | Se conectar | Match → Categorias → Feed | “Encontramos 3 pessoas com o mesmo interesse em Yoga. Quer ver?” |
| **B** | Autocuidado | Perfil e métricas → Match | “Sua meta está em 60%. Sugerimos um treino rápido de 15 min.” |
| **C** | Eventos e comunidade | Feed de atividades | “Há um evento de corrida no seu bairro neste sábado. Quer se inscrever?” |
| **D** | Sou educador físico | CREF (21) → Interesses | “Seu CREF está em análise. Enquanto isso, explore a comunidade.” |

- Seleção única, com cards grandes e visualmente distintos (Lei de Fitts /
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
- Todos os recursos são locais: fontes, ícones, fotos e ilustrações. Zero
  requisições externas.
- Ao editar CSS ou JS, atualize o `?v=` no `<link>` / `<script>` correspondente
  para evitar cache antigo durante a avaliação.
