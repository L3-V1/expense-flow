import { CATEGORIES } from './categories.js';

export function totalsByCategory(expenses, total) {
  return CATEGORIES
    .map((c) => {
      const sum = expenses.filter((e) => e.categoria === c.key).reduce((s, e) => s + e.valor, 0);
      return { key: c.key, label: c.label, color: c.color, total: sum, percent: total > 0 ? (sum / total) * 100 : 0 };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);
}
