# Projeto de vídeo vertical (Edita)

Projeto Remotion para vídeos verticais **1080 × 1920, 30 fps**. Composição padrão: `Vertical` (src/Root.tsx).

## Estrutura de pastas

| Pasta | Conteúdo |
| --- | --- |
| `originais/` | Brutos enviados por mim. **Nunca alterar, renomear, recortar ou sobrescrever.** Trabalhe sempre sobre cópias. |
| `referencias/` | Vídeos que quero estudar (não entram no final). |
| `estilos/` | Fichas de estilo em `.md` (cores, fontes, ritmo, tipos de transição). |
| `briefings/` | Um `.md` por projeto: objetivo, duração, público, roteiro e critérios de aceite. |
| `exports/` | Apenas os finais renderizados. |
| `public/sfx/` | Efeitos sonoros curtos (CC0), usados em `src/`. |
| `src/` | Código Remotion (composições). |
| `.tmp/` | Temporários de render (TEMP/TMP/TMPDIR apontam para cá em `remotion.config.ts`). |

## Regras

1. **Originais são sagrados.** Nunca alterar os arquivos em `originais/`.
2. **Transcrição é sempre local.** Usar `@remotion/install-whisper-cpp` (ou Whisper local). Nunca enviar áudio ou vídeo para serviço pago de transcrição.
3. **Todo projeto começa por um briefing** em `briefings/`, antes de qualquer código de composição.
4. **Validar um trecho curto antes do todo.** Renderizar 5–10 s, aprovar, só então renderizar o vídeo completo.
5. **Proibido na edição:**
   - tremida de câmera (camera shake);
   - pulsar elementos (pulse/heartbeat em loop);
   - seguir rosto quadro a quadro (tracking facial);
   - sons empilhados (vários SFX no mesmo instante);
   - nada parado por mais de 2 s em vídeo falado.

## Comandos

- `npm run dev` — abre o Remotion Studio (porta 3000).
- `npm run lint` — ESLint + tsc.
- `npx remotion compositions` — lista as composições.
- `npx remotion still Vertical --frame=60 exports/teste.png` — still de teste.
- `npx remotion render Vertical exports/<nome>.mp4` — render final.

## Skills

Skills oficiais do Remotion (`remotion-dev/skills`) estão em `.claude/skills/remotion-*`. Use `remotion-best-practices` quando não souber qual usar; as demais cobrem create, markup, captions, render, studio, docs, etc.

## Ambiente

- Node 22, npm 10, ffmpeg/ffprobe 6.x no PATH.
- Whisper: não instalado por padrão; usar `@remotion/install-whisper-cpp` quando precisar transcrever.
- Se o Remotion não conseguir baixar o próprio Chrome, defina `REMOTION_BROWSER_EXECUTABLE` com o caminho de um Chrome/Chromium local (lido em `remotion.config.ts`).
