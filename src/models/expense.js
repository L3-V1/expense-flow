export function validateExpenseForm(form) {
  const errors = { valor: '', descricao: '' };
  let valid = true;

  const valorNum = parseFloat(form.valor);
  if (form.valor === '' || isNaN(valorNum) || valorNum <= 0) {
    errors.valor = 'Informe um valor maior que zero.';
    valid = false;
  }

  if (!form.descricao || !form.descricao.trim()) {
    errors.descricao = 'Informe uma descrição.';
    valid = false;
  }

  return { valid, errors };
}

export function createExpense(form) {
  return {
    id: Date.now() + Math.random(),
    valor: parseFloat(form.valor),
    descricao: form.descricao.trim(),
    categoria: form.categoria,
  };
}

export function applyExpenseForm(expense, form) {
  expense.valor = parseFloat(form.valor);
  expense.descricao = form.descricao.trim();
  expense.categoria = form.categoria;
}

export function sumExpenses(expenses) {
  return expenses.reduce((sum, e) => sum + e.valor, 0);
}

export function filterExpenses(expenses, filters) {
  const categoria = filters.categoria;
  const texto = filters.texto.trim().toLowerCase();
  return expenses.filter((e) => {
    if (categoria !== 'todas' && e.categoria !== categoria) return false;
    if (texto && !e.descricao.toLowerCase().includes(texto)) return false;
    return true;
  });
}
