export function saldoDisponivel(budget, total) {
  return (budget ?? 0) - total;
}

export function orcamentoEstourado(budget, saldo) {
  return budget !== null && saldo < 0;
}
