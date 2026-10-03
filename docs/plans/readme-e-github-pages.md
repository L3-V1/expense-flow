---
titulo: README e publicação no GitHub Pages
data: 2026-10-03
status: implementado
---

# README e publicação no GitHub Pages

## Decisões

- **Deploy**: GitHub Pages por branch, `main` / `(root)`, sem workflow de Actions. A pasta `docs/` não serve de origem porque guarda os planos. URL: `https://l3-v1.github.io/expense-flow/`.
- **`.nojekyll`** na raiz, para servir os arquivos como estão (sem o Jekyll transformar os `.md` em páginas).
- **CDN**: Alpine fixado em `alpinejs@3.17.4` (antes `3.x.x`). Tailwind Play CDN mantido, para não introduzir etapa de build.
- **README.md** em pt-BR, voltado para vitrine e desenvolvimento: link do site, captura de tela, funcionalidades, stack, como rodar, estrutura, publicação e licença.
- **Vocabulário**: o item registrado se chama **lançamento** (termo dos títulos e botões da interface), registrado em `GLOSSARY.md`. A interface ainda usa "gasto" como substantivo em alguns textos (estado vazio, aviso de orçamento estourado); a unificação ficou fora deste escopo.
- **Captura de tela**: `docs/images/screenshot.png`, 1280px, uso típico (6 lançamentos, orçamento de R$ 3.000 com saldo positivo).
- **Licença**: MIT, L3-V1, 2026.
- **Versionamento**: `CLAUDE.md` e `GLOSSARY.md` passam a ser versionados (o repositório é público, então ficam visíveis também no site).
- **Git**: um commit no `main`, sem push.

## Passo manual

Ativar em *Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`*. O `gh` CLI não está instalado, então isso não foi automatizado.
