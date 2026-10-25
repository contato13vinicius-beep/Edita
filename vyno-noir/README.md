# VYNO NOIR — carrossel "Lifestyle Roadmap" (v2)

Saída: `out/vyno-noir-01-capa.png` … `09-liberdade.png` (1080×1350, 4:5) e `out/vyno-noir-preview.png`.
Versão anterior (colorida) preservada em `versions/`.

## Gerar
```
node src/build.js            # todos os slides + prévia + QA automático
node src/build.js --only 03  # um slide
```
Requer Node + Playwright (Chromium).

## Estrutura
- `src/theme.css` — paleta (preto, grafite, off-white, champagne, espresso, cinza) e fontes. Mude a identidade aqui.
- `src/base.css` — template: papel, lombada, títulos de marcador, checklist, impressões com fita, notas.
- `src/content.js` — textos, `layout` e fotos de cada slide. `*palavra*` = marca-texto; `{{palavra}}` = círculo à mão.
- `src/build.js` — layouts (cover, split, band, left, listfirst, collage, bleedright, bleedbottom, closing), QA e prévia.
- `assets/photos/` — fotografias. `photo-prompts.md` descreve cada cena.

## Fotos
Sem arquivo em `assets/photos/<slot>.jpg`, o slide mostra um espaço reservado identificado. Slots: capa, rotina, carreira, academia, dinheiro, viagem-aeroporto, viagem-aviao, viagem-praia, viagem-destino, carro, familia, liberdade. Salve e rode o build.

## Novo carrossel
Copie um slide em `content.js`, escolha um `layout`, troque textos/`n`/foto e ajuste `total`.
