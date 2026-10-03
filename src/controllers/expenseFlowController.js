import { CATEGORIES, categoryLabel, categoryColor } from '../models/categories.js';
import { validateExpenseForm, createExpense, applyExpenseForm, sumExpenses, filterExpenses } from '../models/expense.js';
import { saldoDisponivel, orcamentoEstourado } from '../models/budget.js';
import { totalsByCategory } from '../models/categoryTotals.js';
import { loadState, saveState } from '../services/storageService.js';
import { renderDonutChart } from '../services/chartService.js';
import { formatCurrency } from '../utils/format.js';

export function expenseFlow() {
  return {
    expenses: [],
    categories: CATEGORIES,
    form: { editingId: null, valor: '', descricao: '', categoria: 'alimentacao' },
    errors: { valor: '', descricao: '' },
    deleteTargetId: null,
    chart: null,
    budget: null,
    editingBudget: false,
    budgetInput: '',
    filters: { categoria: 'todas', texto: '' },
    toasts: [],

    notify(message, type = 'success') {
      const id = Date.now() + Math.random();
      this.toasts.push({ id, message, type });
      setTimeout(() => this.dismissToast(id), 4000);
    },

    dismissToast(id) {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    },

    init() {
      this.loadFromStorage();
      this.$watch('expenses', () => this.$nextTick(() => this.renderChart()));
      this.$watch('filters', () => this.$nextTick(() => this.renderChart()), { deep: true });
      this.$watch('expenses', () => this.persist(), { deep: true });
      this.$watch('budget', () => this.persist());
      this.$nextTick(() => this.renderChart());
    },

    loadFromStorage() {
      const data = loadState();
      if (!data) return;
      if (Array.isArray(data.expenses)) this.expenses = data.expenses;
      if (typeof data.budget === 'number' || data.budget === null) this.budget = data.budget;
    },

    persist() {
      saveState({ expenses: this.expenses, budget: this.budget });
    },

    addExpense() {
      const { valid, errors } = validateExpenseForm(this.form);
      this.errors = errors;
      if (!valid) return;
      this.expenses.push(createExpense(this.form));
      this.resetForm();
      this.notify('Lançamento adicionado.');
    },

    startEdit(id) {
      const e = this.expenses.find((x) => x.id === id);
      if (!e) return;
      this.form = { editingId: e.id, valor: String(e.valor), descricao: e.descricao, categoria: e.categoria };
      this.errors = { valor: '', descricao: '' };
    },

    updateExpense() {
      const { valid, errors } = validateExpenseForm(this.form);
      this.errors = errors;
      if (!valid) return;
      const e = this.expenses.find((x) => x.id === this.form.editingId);
      if (!e) return;
      applyExpenseForm(e, this.form);
      this.resetForm();
      this.notify('Lançamento salvo.');
    },

    cancelEdit() {
      this.resetForm();
    },

    resetForm() {
      this.form = { editingId: null, valor: '', descricao: '', categoria: 'alimentacao' };
      this.errors = { valor: '', descricao: '' };
    },

    requestDelete(id) {
      this.deleteTargetId = id;
    },

    cancelDelete() {
      this.deleteTargetId = null;
    },

    confirmDelete() {
      this.expenses = this.expenses.filter((e) => e.id !== this.deleteTargetId);
      if (this.form.editingId === this.deleteTargetId) this.resetForm();
      this.deleteTargetId = null;
      this.notify('Lançamento excluído.');
    },

    categoryLabel,
    categoryColor,

    get total() {
      return sumExpenses(this.expenses);
    },

    get saldoDisponivel() {
      return saldoDisponivel(this.budget, this.total);
    },

    get orcamentoEstourado() {
      return orcamentoEstourado(this.budget, this.saldoDisponivel);
    },

    startEditBudget() {
      this.budgetInput = this.budget !== null ? String(this.budget) : '';
      this.editingBudget = true;
      this.$nextTick(() => this.$refs.budgetInput?.focus());
    },

    commitBudget() {
      const value = parseFloat(this.budgetInput);
      if (!isNaN(value) && value >= 0) {
        this.budget = value;
        this.notify('Orçamento definido.');
      } else if (this.budgetInput !== '') {
        this.notify('Informe um orçamento igual ou maior que zero.', 'error');
      }
      this.editingBudget = false;
    },

    cancelEditBudget() {
      this.editingBudget = false;
    },

    get filteredExpenses() {
      return filterExpenses(this.expenses, this.filters);
    },

    get filteredTotal() {
      return sumExpenses(this.filteredExpenses);
    },

    clearFilters() {
      this.filters = { categoria: 'todas', texto: '' };
    },

    get totalsByCategory() {
      return totalsByCategory(this.filteredExpenses, this.filteredTotal);
    },

    formatCurrency,

    renderChart() {
      // Busca direta no DOM: o canvas fica dentro de um x-if e o $refs do Alpine
      // não enxerga refs criadas depois do primeiro acesso.
      const canvas = this.$root.querySelector('[data-chart="donut"]');
      this.chart = renderDonutChart(canvas, this.chart, this.totalsByCategory);
    },
  };
}
