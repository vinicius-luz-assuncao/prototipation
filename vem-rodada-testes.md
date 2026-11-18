# vem — roteiro da rodada de testes v2

> **Rodada:** testes v2 (social e confiança)
> **Data:** 18/11/2026
> **Objetivo:** validar o fluxo de conexão — login, verificação, interesses em
> dois níveis, match específico, conversa simulada, grupos e eventos.

Tudo é **simulado no navegador**, sem backend. O estado fica em `localStorage`
sob as chaves `vem.*` (`assets/js/store.js`).

---

## Como preparar o ambiente

```bash
python -m http.server 4173
# abra http://127.0.0.1:4173/app.html
```

- Para **resetar** o teste: `app.html?reset=1` ou **Configurações → Redefinir
  teste**.
- Para ver o **log de ações**: **Configurações → Exportar log** (baixa um `.json`).
- O protótipo também abre por `file://`; apenas o parâmetro `?tela=` deixa de ser
  lido.

---

## Roteiro principal

1. **01 — Boas-vindas** · tocar em **Continuar com Google**.
   - Esperado: toast “Conta Google conectada” e avanço para a tela 02.
2. **02 — Verificação** · a pessoa decide:
   - **Iniciar verificação** → tela 03 (selo) → **Continuar** → retorna ao fluxo.
   - **Verificar depois** → estado “Verificação pendente” com **Verificar agora**
     e **Continuar sem verificar**.
3. **04 — Criar perfil** · preencher nome e e-mail, subir uma foto.
   - Esperado: a foto é redimensionada e salva como data URL; o avatar passa a
     aparecer preenchido na Home, no Perfil e nas Configurações.
4. **05 — Objetivo** · testar os dois caminhos:
   - **Social** (Se conectar / Autocuidado / Eventos) → segue para a tela 06.
   - **Sou educador físico** → tela 21 (CREF) → enviar documentação simulada →
     selo “Educador em análise” → tela 06.
5. **06 — Interesses** · escolher contextos amplos e até 5 atividades específicas.
   - Esperado: contador de contextos e de favoritas; sugestões de busca com
     emoji; atividade customizada quando não existir no catálogo.
6. **07 — Senha** → **08 — Pronto** → **Acessar o app** → Home (10).

---

## Cenários a validar

### A. Verificação não bloqueante

- Sem verificar, explorar, favoritar e ver eventos funcionam.
- Dar **match**, entrar em **grupos** e **conversar** exibem um convite para
  verificar, sem travar o teste.
- O selo pendente aparece no Perfil e um banner na Home até concluir.

### B. Perfil vazio

- Começar sem dados: Home mostra “Bom dia” (sem nome), avatar vazio e um aviso
  para completar o perfil.
- Completar nome e foto remove o aviso; o Perfil reflete a mudança.

### C. Match específico e leque (FAB de estrela)

- Com atividades em comum, o card de match mostra o selo “Match em …”.
- O FAB de estrela abre o leque de atividades; sem favoritas, ainda é possível
  escolher por onde começar com aquela pessoa.
- Alternar entre **match geral** e **match específico** muda o deck.

### D. Conversa simulada (terceiro like)

- O **terceiro like** arma a conversa; a pessoa “envia” uma mensagem em segundos
  e a badge do Social acende.
- O chat (tela 22) segue o roteiro sim/não até o **convite de evento**.
- Aceitar o evento adiciona o item em **Meus eventos** (tela 23).
- Abrir outra conversa não apaga a anterior (histórico arquivado).

### E. Social, grupos e sinais

- **Social** tem três abas: Conexões, Grupos e Eventos.
- Grupos aparecem apenas quando uma conexão já participa.
- Curtir/salvar posts do **Feed** gera sinais que aparecem nas sugestões do
  Perfil.

---

## Critérios de aceite

- [ ] 23 telas navegáveis por clique, teclado e URL (`?tela=NN`).
- [ ] Nenhum erro de console.
- [ ] Estado persiste entre recargas e é apagado por `?reset=1`.
- [ ] Copy 100% em PT-BR, sem lorem ipsum.
- [ ] Alvos de toque de 48 px e grade de 8 px mantidos.
- [ ] Sem dependência de internet (fontes, ícones e imagens locais).
