#!/usr/bin/env node
// Gera os slides (HTML -> PNG 1080x1350), executa o controle de qualidade e monta a prévia.
// Uso: node src/build.js [--only 03] [--flags]   (--flags marca slots de foto ainda sem foto real)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { ill, doodle, scenes } = require("./illustrations");
const content = require("./content");

const ROOT = path.resolve(__dirname, "..");
const HTML = path.join(ROOT, "html");
const OUT = path.join(ROOT, "out");
const W = 1080, H = 1350;
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
const showFlags = args.includes("--flags");

fs.mkdirSync(HTML, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// ---------- componentes ----------
const mk = (s) => s.replace(/\*([^*]+)\*/g, '<span class="mk">$1</span>');

const spiral = () => {
  let rings = "";
  for (let y = 24; y < H; y += 45)
    rings += `<rect x="4" y="${y - 8}" width="84" height="16" rx="8" fill="#161616"/>
      <rect x="10" y="${y - 6}" width="70" height="4" rx="2" fill="#5a5a5a"/>
      <circle cx="74" cy="${y}" r="9" fill="#3a3326" opacity=".55"/>`;
  return `<div class="spiral"><svg viewBox="0 0 96 ${H}">${rings}</svg></div>`;
};

const check = (color) => `<svg viewBox="0 0 52 52"><rect x="5" y="6" width="38" height="38" rx="7" fill="${color}" stroke="#111" stroke-width="4"/>
  <path d="M11 26l11 12L50 4" fill="none" stroke="#111" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="rough" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="4.5"/></filter>
  <filter id="rough2" x="-3%" y="-6%" width="106%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/></filter>
</defs></svg>`;

const style = (o) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join(";");
const decorEl = (d) => `<div class="decor" style="${style({ left: d.x + "px", top: d.y + "px", width: d.w + "px", transform: `rotate(${d.r || 0}deg)` })}">${(ill[d.ill] || doodle[d.ill])()}</div>`;

const polaroid = (p) => {
  const photoFile = path.join(ROOT, "assets/photos", p.slot + ".jpg");
  const has = fs.existsSync(photoFile);
  const inner = has ? `<img src="../assets/photos/${p.slot}.jpg">` : `<svg viewBox="0 0 300 300" preserveAspectRatio="xMidYMid slice">${scenes[p.scene]()}</svg>`;
  const flag = !has && showFlags ? `<div class="slot-flag">FOTO: ${p.slot}</div>` : "";
  return `<div class="polaroid" data-slot="${p.slot}" style="${style({ left: p.x + "px", top: p.y + "px", width: p.w + "px", transform: `rotate(${p.r || 0}deg)` })}">
    <div class="ph">${inner}${flag}</div><div class="cap">${p.cap || ""}</div></div>`;
};

const circle = (c) => {
  const ci = c.d - 12, size = ci * c.zoom;
  const px = ci / 2 - c.cx * size, py = ci / 2 - c.cy * size;
  return `<div class="pcircle" style="${style({ left: c.x + "px", top: c.y + "px", width: c.d + "px", height: c.d + "px",
    "background-image": `url(${content.PHOTO})`, "background-size": size + "px " + size + "px", "background-position": px + "px " + py + "px" })}"></div>`;
};

const dots = (i) => `<div class="dots">${Array.from({ length: content.total }, (_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`;
const swipe = () => `<div class="swipe">deslize<svg viewBox="0 0 70 34" class="ill" style="width:70px;height:34px"><path d="M4 18h58M48 6l14 12-14 12" style="stroke-width:5"/></svg></div>`;
const counter = (i) => `<div class="counter">${String(i + 1).padStart(2, "0")}/${String(content.total).padStart(2, "0")}</div>`;
const tag = () => `<div class="tag">${content.tag}</div>`;

const cssVars = (s) => `--nw:${s.noteW || 640}px;--nf:${s.noteSize || 56}px;--accent:${s.accent};--accent2:${s.accent2 || "var(--pink)"};--note:${s.note || "var(--yellow)"};--ts:${s.ts || 128}px`;
const list = (s) => `<ul class="checks">${s.items.map((t) => `<li>${check(s.accent)}<span>${mk(t)}</span></li>`).join("")}</ul>`;
const titleBlock = (s) => `<div class="head"><div class="bubble">${s.n}</div><div class="title">${s.titleLines.map((l) => `<span class="line"><span class="hl">${l}</span></span>`).join("")}</div></div>`;

// ---------- layouts ----------
function renderCover(s, i) {
  const cols = [s.items.slice(0, 4), s.items.slice(4)];
  const colHtml = cols.map((col, ci) => `<ul class="cl" style="list-style:none;display:flex;flex-direction:column;gap:10px;width:410px">${col.map((t, k) => {
    const idx = ci * 4 + k;
    return `<li style="display:flex;gap:18px;align-items:center;font-size:46px;line-height:1">${check(s.itemColors[idx])}<span>${t}</span></li>`;
  }).join("")}</ul>`).join("");
  return `<div class="slide" style="${cssVars(s)}">
    <div class="paper"></div>${spiral()}${counter(i)}
    <div class="decor" style="left:915px;top:36px;width:100px;transform:rotate(8deg)">${ill.bulb()}</div>
    <div style="position:absolute;left:124px;top:112px;font-family:var(--font-title);text-transform:uppercase;line-height:.92;filter:url(#rough2);font-size:208px">
      ${s.titleLines.map((l) => `<span style="display:block;white-space:nowrap"><span class="hl" style="--c:${l.c}">${l.t}</span></span>`).join("")}</div>
    <div style="position:absolute;left:124px;top:508px;font-family:var(--font-note);font-weight:700;font-size:50px;white-space:nowrap">${s.sub}
      <div style="height:9px;margin-top:4px;border-radius:9px;background:var(--lilac);transform:rotate(-.5deg)"></div></div>
    <div class="box" style="left:124px;top:600px;width:890px;height:288px"></div>
    <div style="position:absolute;left:160px;top:626px;display:flex;gap:30px">${colHtml}</div>
    <div class="ring" style="left:588px;top:900px;width:432px;height:432px"></div>
    ${circle({ x: 598, y: 910, d: 412, zoom: 1.03, cx: .5, cy: .5 })}
    <div class="note" style="left:130px;top:970px;width:380px;padding:16px 22px 20px;font-size:64px;transform:rotate(-3deg);--note:var(--pink);text-align:center">Passo a passo</div>
    <div class="decor" style="left:190px;top:1115px;width:250px;transform:rotate(14deg)">${doodle.arrowRight()}</div>
    <div class="swipe" style="left:140px;right:auto;top:1200px;bottom:auto">deslize para começar</div>
    <div class="decor" style="left:480px;top:1130px;width:70px">${ill.star()}</div>
    ${dots(i)}${defs}</div>`;
}

function renderContent(s, i) {
  const photos = (s.photos || []).map(polaroid).join("");
  const circles = (s.circles || []).map(circle).join("");
  const decor = (s.decor || []).map(decorEl).join("");
  return `<div class="slide" style="${cssVars(s)}">
    <div class="paper"></div>${spiral()}${counter(i)}${tag()}
    ${titleBlock(s)}
    <div class="sub">${s.sub}</div>
    ${list(s)}
    ${circles}${photos}${decor}
    <div class="note" style="top:${s.noteTop}px">${s.noteText}</div>
    ${dots(i)}${swipe()}${defs}</div>`;
}

function renderFinal(s, i) {
  return `<div class="slide" style="${cssVars(s)}">
    <div class="paper"></div>${spiral()}${counter(i)}${tag()}
    ${titleBlock(s)}
    <div class="sub">${s.sub}</div>
    ${list(s).replace('class="checks"', 'class="checks" style="width:900px"')}
    <div class="ring" style="left:624px;top:900px;width:420px;height:420px"></div>
    ${circle({ x: 632, y: 908, d: 404, zoom: 1.45, cx: .52, cy: .5 })}
    <div class="note" style="top:905px;left:118px;width:480px;font-size:62px;line-height:1.04;--note:var(--yellow)">${s.noteText}</div>
    <div class="brand" style="left:140px;top:1195px;transform:rotate(-2deg)">VYNO NOIR</div>
    <div class="decor" style="left:470px;top:1180px;width:70px;transform:rotate(10deg)">${ill.star()}</div>
    ${dots(i)}${defs}</div>`;
}

const page = (body) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=1080">
<link rel="stylesheet" href="../src/theme.css"><link rel="stylesheet" href="../src/base.css"></head><body>${body}</body></html>`;

// ---------- controle de qualidade (roda dentro do navegador) ----------
const qa = () => {
  const issues = [];
  const R = (el) => { if (el.matches && el.matches(".checks li")) { const g = document.createRange(); g.selectNodeContents(el.lastElementChild); const t = g.getBoundingClientRect(), b = el.firstElementChild.getBoundingClientRect(); return { left: b.left, top: Math.min(t.top, b.top), right: t.right, bottom: Math.max(t.bottom, b.bottom), width: t.right - b.left, height: t.height }; } return el.getBoundingClientRect(); };
  const q = (sel) => [...document.querySelectorAll(sel)];
  const text = [...q(".counter"), ...q(".tag"), ...q(".bubble"), ...q(".title .line"), ...q(".sub"), ...q(".checks li"), ...q(".note"), ...q(".brand"), ...q(".swipe")];
  const art = [...q(".decor"), ...q(".polaroid"), ...q(".pcircle")];
  const name = (el) => (el.className && el.className.baseVal === undefined ? el.className : "svg") + ":" + (el.textContent || "").trim().slice(0, 24);
  for (const el of [...text, ...art]) {
    const r = R(el);
    const isText = text.includes(el);
    if (r.left < 98 && !el.classList.contains("pcircle") || r.right > 1080 - 24 || r.top < 24 || r.bottom > 1350 - 20)
      issues.push(`fora da margem segura: ${name(el)} [${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}]`);
    if (isText && el.scrollWidth > el.clientWidth + 2) issues.push(`texto cortado: ${name(el)}`);
  }
  const inter = (a, b) => { const x = Math.min(a.right, b.right) - Math.max(a.left, b.left), y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return x > 0 && y > 0 ? x * y : 0; };
  for (let i = 0; i < text.length; i++) for (let j = i + 1; j < text.length; j++) {
    const a = text[i], b = text[j]; if (a.contains(b) || b.contains(a)) continue;
    const ar = inter(R(a), R(b)); if (ar > 80) issues.push(`texto sobreposto: ${name(a)} × ${name(b)} (${Math.round(ar)}px²)`);
  }
  for (const t of text) for (const a of art) {
    const ar = inter(R(t), R(a)); if (ar > 120) issues.push(`arte sobre texto: ${name(t)} × ${name(a)} (${Math.round(ar)}px²)`);
  }
  for (let i = 0; i < art.length; i++) for (let j = i + 1; j < art.length; j++) {
    const ra = R(art[i]), rb = R(art[j]); const ar = inter(ra, rb);
    const small = Math.min(ra.width * ra.height, rb.width * rb.height);
    if (ar > small * 0.3) issues.push(`artes sobrepostas: ${name(art[i])} × ${name(art[j])} (${Math.round(ar / small * 100)}%)`);
  }
  return issues;
};

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  let problems = 0;
  for (let i = 0; i < content.slides.length; i++) {
    const s = content.slides[i];
    if (only && !s.file.includes("-" + only + "-")) continue;
    const html = page(s.type === "cover" ? renderCover(s, i) : s.type === "final" ? renderFinal(s, i) : renderContent(s, i));
    const hp = path.join(HTML, s.file + ".html");
    fs.writeFileSync(hp, html);
    await pg.goto("file://" + hp);
    await pg.evaluate(() => document.fonts.ready);
    await pg.waitForTimeout(150);
    const issues = await pg.evaluate(`(${qa.toString()})()`);
    await pg.screenshot({ path: path.join(OUT, s.file + ".png"), clip: { x: 0, y: 0, width: W, height: H } });
    console.log((issues.length ? "⚠ " : "✓ ") + s.file + (issues.length ? "\n   " + issues.join("\n   ") : ""));
    problems += issues.length;
  }
  // prévia
  if (!only) {
    const g = 30, pw = 540, ph = 675;
    const cells = content.slides.map((s) => `<img src="../out/${s.file}.png" width="${pw}" height="${ph}">`).join("");
    fs.writeFileSync(path.join(HTML, "preview.html"), `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#161616;width:${3 * pw + 4 * g}px;height:${3 * ph + 4 * g}px;display:grid;grid-template-columns:repeat(3,${pw}px);gap:${g}px;padding:${g}px;box-sizing:border-box">${cells}</body>`);
    const pp = await ctx.newPage();
    await pp.setViewportSize({ width: 3 * pw + 4 * g, height: 3 * ph + 4 * g });
    await pp.goto("file://" + path.join(HTML, "preview.html"));
    await pp.waitForTimeout(300);
    await pp.screenshot({ path: path.join(OUT, "vyno-noir-preview.png") });
  }
  await browser.close();
  console.log(problems ? `\n${problems} alerta(s) de QA` : "\nQA: nenhum problema de corte/sobreposição detectado");
})();
