# Expense Flow

Livro-caixa pessoal: a pessoa anota o que gastou, classifica por categoria e compara com um orçamento.

## Language

**Lançamento**:
Um valor que a pessoa anotou como saído do bolso, com descrição e categoria.
_Avoid_: Gasto (como substantivo), despesa, transação

**Categoria**:
Uma das classes fixas que agrupam os lançamentos (Alimentação, Transporte, Moradia, Saúde, Lazer, Educação, Compras, Outros).
_Avoid_: Tipo, tag

**Total gasto**:
A soma dos valores de todos os lançamentos, sem considerar filtros.
_Avoid_: Despesa total

**Orçamento**:
O valor máximo que a pessoa se propõe a gastar; é opcional.
_Avoid_: Limite, meta

**Saldo disponível**:
O orçamento menos o total gasto.
_Avoid_: Sobra, restante

**Orçamento estourado**:
A situação em que existe um orçamento e o saldo disponível ficou negativo.
_Avoid_: Limite excedido
