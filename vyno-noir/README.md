# VYNO NOIR — carrossel "Lifestyle Roadmap"

Saída: `out/vyno-noir-01-capa.png` … `09-liberdade.png` (1080×1350, PNG) e `out/vyno-noir-preview.png` (grade de revisão).

## Gerar
```
node src/build.js            # todos os slides + prévia + QA (corte/sobreposição/margens)
node src/build.js --only 03  # só um slide
node src/build.js --flags    # marca os slots de foto ainda sem foto real
```
Requer Node + Playwright (Chromium).

## Estrutura
- `src/theme.css` — cores e fontes (mude aqui a identidade).
- `src/base.css` — template: papel quadriculado, espiral, títulos, listas, notas, polaroids.
- `src/content.js` — textos e posição de cada ilustração/foto de cada slide.
- `src/illustrations.js` — ilustrações SVG e cenas-substitutas das fotos.
- `src/build.js` — renderização, QA e prévia.
- `assets/fonts` — Caveat Brush (títulos), Caveat (notas), Patrick Hand (listas).

## Novo carrossel
1. Copie um objeto de `slides` em `content.js`: troque `file`, `n`, `accent`, `titleLines`, `sub`, `items` (use `*palavra*` para marca-texto) e `noteText`.
2. Posicione `decor` (ilustrações da biblioteca), `photos` (polaroids) ou `circles` (foto circular).
3. Ajuste `total` e rode `node src/build.js`. Leia os alertas do QA.

## Fotos reais
Os polaroids usam cenas ilustradas como substituto. Para trocar, salve `assets/photos/<slot>.jpg` (slots: carreira, academia, viagem-praia, viagem-cidade, estrada, familia-1, familia-2) e rode o build — são usadas automaticamente. A foto circular (capa, slide 7 e 9) vem de `assets/photos/personagem.jpg`.
