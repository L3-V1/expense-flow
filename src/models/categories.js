export const CATEGORIES = [
  { key: 'alimentacao', label: 'Alimentação', color: '#E8890C' },
  { key: 'transporte', label: 'Transporte', color: '#1B1A17' },
  { key: 'moradia', label: 'Moradia', color: '#F2B705' },
  { key: 'saude', label: 'Saúde', color: '#B23A1E' },
  { key: 'lazer', label: 'Lazer', color: '#5E7F6B' },
  { key: 'educacao', label: 'Educação', color: '#6F86A8' },
  { key: 'compras', label: 'Compras', color: '#8A5A00' },
  { key: 'outros', label: 'Outros', color: '#A8A08C' },
];

export function categoryLabel(key) {
  const c = CATEGORIES.find((c) => c.key === key);
  return c ? c.label : key;
}

export function categoryColor(key) {
  const c = CATEGORIES.find((c) => c.key === key);
  return c ? c.color : '#A8A08C';
}
