import { formatCurrency } from '../utils/format.js';

export function renderDonutChart(canvas, existingChart, categoryData) {
  if (!canvas) {
    existingChart?.destroy();
    return null;
  }

  if (existingChart) {
    existingChart.destroy();
  }

  const labels = categoryData.map((c) => c.label);
  const values = categoryData.map((c) => c.total);
  const colors = categoryData.map((c) => c.color);

  return new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data: values, backgroundColor: colors, borderColor: '#1B1A17', borderWidth: 2, hoverOffset: 4 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '58%',
      animation: { duration: 250 },
      plugins: {
        legend: { display: false },
        tooltip: {
          cornerRadius: 0,
          backgroundColor: '#1B1A17',
          titleColor: '#FFFDF7',
          bodyColor: '#FFFDF7',
          borderColor: '#F2B705',
          borderWidth: 2,
          padding: 10,
          callbacks: {
            label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.parsed)}`,
          },
        },
      },
    },
  });
}
