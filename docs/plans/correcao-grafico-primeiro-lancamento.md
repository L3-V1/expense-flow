---
titulo: Correção do gráfico de rosca após o primeiro lançamento
data: 2026-10-02
status: implementado
---

# Correção: gráfico de rosca não aparece após o primeiro lançamento

> **Revisão pós-implementação (2026-10-02):** o diagnóstico do plano aprovado estava incompleto. Durante os testes, só o `x-init` não resolveu: a causa real era o cache do `$refs` no Alpine. Esta versão registra a causa confirmada e as mudanças que foram de fato aplicadas. O plano original aprovado está no fim do arquivo.

## Contexto
Com a lista vazia, o bloco do gráfico em `index.html:277` fica dentro de `<template x-if="expenses.length > 0">`, então o canvas não existe no DOM. Ao adicionar o primeiro lançamento, o gráfico não aparecia. Ao recarregar a página, aparecia.

### Causa confirmada
No Alpine 3.17.4, o objeto `$refs` de um componente é montado e guardado em cache (`_x_refs_proxy`) na primeira vez que é lido. Ele passa a apontar só para os objetos de refs que existiam naquele momento.

1. Com a lista vazia, o `init()` chama `renderChart()`, que lê `this.$refs.donutCanvas`. Como o canvas ainda não existe, o root não tem `_x_refs`, e o cache do `$refs` fica vazio.
2. No primeiro lançamento, o `x-if` cria o canvas e o `x-ref` registra `donutCanvas` em `root._x_refs`. Mas o `$refs` em cache não enxerga esse objeto novo e continua devolvendo `undefined`.
3. `renderDonutChart` recebe `canvas` indefinido e sai cedo. Isso se repete em todas as renderizações seguintes, até a página ser recarregada.

Com dados salvos, o canvas já existe quando o `$refs` é lido pela primeira vez, por isso recarregar fazia o gráfico aparecer.

Diagnóstico no navegador, depois do primeiro lançamento: `root._x_refs` continha `donutCanvas`, mas `Object.keys(root._x_refs_proxy)` retornava `[]`.

Problema relacionado: quando todos os lançamentos são excluídos, o canvas some, mas `this.chart` continuava apontando para a instância antiga do Chart.js, que nunca era destruída.

## Mudanças aplicadas

1. **`index.html:280`**: o canvas deixou de usar `x-ref`, passou a ser identificado por um atributo de dados e desenha o gráfico assim que é montado:
   ```html
   <canvas data-chart="donut" x-init="$nextTick(() => renderChart())" ...>
   ```

2. **`src/controllers/expenseFlowController.js`** (`renderChart`): o canvas é buscado direto no DOM do componente, sem passar pelo `$refs`:
   ```js
   renderChart() {
     // Busca direta no DOM: o canvas fica dentro de um x-if e o $refs do Alpine
     // não enxerga refs criadas depois do primeiro acesso.
     const canvas = this.$root.querySelector('[data-chart="donut"]');
     this.chart = renderDonutChart(canvas, this.chart, this.totalsByCategory);
   },
   ```

3. **`src/services/chartService.js:4`**: quando o canvas não existe, a instância antiga é destruída e a função retorna `null`:
   ```js
   if (!canvas) {
     existingChart?.destroy();
     return null;
   }
   ```

## Verificação realizada
Feita no Playwright, com o projeto servido localmente, o `localStorage` limpo e o cache do navegador desativado. As ações foram chamadas pelo `Alpine.$data` do componente, e cada passo foi conferido com `Chart.getChart(canvas)`:

| Passo | Resultado |
|---|---|
| Estado inicial vazio | sem canvas, sem gráfico |
| 1º lançamento | gráfico aparece com 1 categoria |
| 2º lançamento (outra categoria) | 2 categorias |
| Edição de categoria | gráfico atualizado |
| Filtro por categoria | 1 categoria |
| Excluir todos | canvas removido, `this.chart === null` |
| Novo lançamento | gráfico volta com 1 categoria |

Não houve erros no console.

Observação: o cache em disco do perfil do Playwright servia a versão antiga dos módulos ES. Foi preciso limpar o cache via CDP (`Network.clearBrowserCache`) para testar o código novo.

## Pendência identificada
O `x-ref="budgetInput"` (`index.html:245`) também fica dentro de um `x-if` e está sujeito ao mesmo cache do `$refs`. É provável que o foco automático em `startEditBudget()` falhe quando a página abre sem dados. Não foi corrigido nesta mudança.

---

## Plano original aprovado

Com a lista vazia, o bloco do gráfico em `index.html:277` fica dentro de `<template x-if="expenses.length > 0">`, então o `<canvas x-ref="donutCanvas">` não existe no DOM. Ao adicionar o primeiro lançamento, o watcher `expenses` (`src/controllers/expenseFlowController.js:35`) chama `renderChart()` dentro de um `$nextTick`. Esse callback pode rodar antes de o `x-if` montar o canvas. Nesse caso `this.$refs.donutCanvas` ainda está `undefined`, e `renderDonutChart` (`src/services/chartService.js:4`) sai cedo sem desenhar nada. Depois disso nenhum outro gatilho redesenha o gráfico. Ao recarregar, o `init()` encontra o canvas já montado e o gráfico aparece.

Mudanças previstas:
1. `index.html:280`: `<canvas x-ref="donutCanvas" x-init="$nextTick(() => renderChart())" ...>`
2. `src/services/chartService.js:4`: destruir a instância antiga e retornar `null` quando não houver canvas.
3. O controller não mudaria.
