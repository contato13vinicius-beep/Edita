#!/usr/bin/env node
// VYNO NOIR v2 — gera slides (HTML -> PNG 1080x1350), QA automático e prévia.
// Uso: node src/build.js [--only 02] [--all]   (--all inclui slides com status "pendente", que não têm layout v2 ainda)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const content = require("./content");

const ROOT = path.resolve(__dirname, "..");
const HTML = path.join(ROOT, "html");
const OUT = path.join(ROOT, "out");
const W = 1080, H = 1350;
const args = process.argv.slice(2);
const only = args.includes("--only") ? args[args.indexOf("--only") + 1] : null;
fs.mkdirSync(HTML, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

// ---------- utilidades ----------
const style = (o) => Object.entries(o).map(([k, v]) => `${k}:${v}`).join(";");
const fmt = (s) => s.replace(/\*([^*]+)\*/g, '<span class="mk">$1</span>').replace(/\{\{([^}]+)\}\}/g, '<span class="circ">$1</span>');
const rng = (seed) => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;

const spine = () => `<div class="spine"><svg viewBox="0 0 56 ${H}" preserveAspectRatio="none"><path d="M40 0V${H}" stroke="#C6AD83" stroke-width="3" stroke-dasharray="16 11" fill="none" opacity=".9"/><path d="M52 0V${H}" stroke="#fff" stroke-opacity=".06" stroke-width="2"/></svg></div>`;
const counter = (i) => `<div class="counter label">${String(i + 1).padStart(2, "0")}<b>/</b>${String(content.total).padStart(2, "0")}</div>`;
const dots = (i) => `<div class="dots">${Array.from({ length: content.total }, (_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`;
const swipe = () => `<div class="swipe label">DESLIZE<svg viewBox="0 0 84 30"><path d="M4 16h70M58 4l16 12-16 12" fill="none" stroke="#C6AD83" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
const check = () => `<svg viewBox="0 0 52 52"><rect x="5" y="8" width="35" height="35" rx="6" fill="#C6AD83" fill-opacity=".8" stroke="#242424" stroke-width="3.5"/><path d="M12 26l11 12L49 6" fill="none" stroke="#101010" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <filter id="rough" x="-6%" y="-6%" width="112%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/></filter>
  <filter id="rough2" x="-3%" y="-6%" width="106%" height="112%"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3"/></filter>
</defs></svg>`;

// foto real (assets/photos/<slot>.jpg) ou espaço reservado claramente identificado
const photoInner = (p) => fs.existsSync(path.join(ROOT, "assets/photos", p.slot + ".jpg"))
  ? `<img src="../assets/photos/${p.slot}.jpg">`
  : `<div class="ph"><div class="label">${p.label}</div><p>${p.desc}</p><div class="dim">ESPAÇO RESERVADO · ${p.dim}</div></div>`;

const list = (s, st) => `<ul class="checks" style="${style(st)}">${s.items.map((t) => `<li>${check()}<span>${fmt(t)}</span></li>`).join("")}</ul>`;

// ---------- layouts ----------
function renderCover(s, i) {
  const r = rng(5), base = 656, pts = ["0 0", "100% 0"];
  const fringe = [...pts], torn = [...pts];
  for (let x = 1080; x >= 0; x -= 14) {
    torn.push(`${x}px ${base + (r() - .5) * 16 + (r() > .93 ? 12 : 0)}px`);
    fringe.push(`${x}px ${base + 8 + (r() - .5) * 14}px`);
  }
  return `<div class="slide">
    <div class="paper"></div>
    <div style="position:absolute;inset:0;filter:drop-shadow(0 8px 12px rgba(16,16,16,.30))">
      <div style="position:absolute;left:0;top:0;width:1080px;height:676px;background:#fff;clip-path:polygon(${fringe.join(",")})"></div>
      <div class="photo dark-edge" style="left:0;top:0;width:1080px;height:676px;clip-path:polygon(${torn.join(",")})">${photoInner(s.photo)}</div>
    </div>
    ${spine()}${counter(i)}
    <div class="label" style="position:absolute;right:64px;top:62px;z-index:12;color:var(--paper);font-size:28px;letter-spacing:.38em;text-shadow:0 1px 8px rgba(0,0,0,.6)">VYNO NOIR</div>
    <div class="title" style="position:absolute;left:100px;top:690px;font-size:190px;line-height:.93">
      ${s.titleLines.map((l) => `<span class="line"><span class="hl" style="--c:${l.c}">${l.t}</span></span>`).join("")}</div>
    <div class="sub" style="position:absolute;left:104px;top:1070px;width:500px;font-size:42px;text-wrap:balance">${s.sub}<span class="brush-under" style="width:300px"></span></div>
    <ul class="checks" style="left:630px;top:1056px;display:grid;grid-template-columns:auto auto;column-gap:26px;row-gap:11px">
      ${s.items.map((t) => `<li style="font-size:38px;gap:10px;white-space:nowrap"><span style="display:block;flex:none;width:32px;height:32px;margin-top:2px">${check().replace("<svg ","<svg style=\"width:32px;height:32px;margin:0\" ")}</span><span>${t}</span></li>`).join("")}</ul>
    ${dots(i)}${swipe()}${defs}</div>`;
}

function renderSplit(s, i) {
  return `<div class="slide">
    <div class="paper"></div>${spine()}${counter(i)}<div class="tag label">${content.tag}</div>
    <div class="numeral" style="position:absolute;left:96px;top:118px;font-size:300px">${s.n}</div>
    <div class="title" style="position:absolute;left:262px;top:150px;font-size:186px"><span class="line"><span class="hl">${s.titleLines[0]}</span></span></div>
    <div class="sub" style="position:absolute;left:104px;top:392px;font-size:48px">${s.sub}<span class="brush-under" style="width:250px"></span></div>
    ${list(s, { left: "104px", top: "500px", width: "490px", gap: "20px" }).replace('<ul', '<ul data-compact').replace(/<li>/g, '<li style="font-size:42px">')}
    <div class="print" style="left:636px;top:470px;width:384px;height:560px;transform:rotate(2.5deg)">
      <div class="tape" style="left:127px;top:-22px;transform:rotate(-3deg)"></div>
      <div class="photo">${photoInner(s.photo)}</div></div>
    <div class="doodle champ" style="left:880px;top:150px;width:70px"><svg viewBox="0 0 100 100"><path d="M50 6C52 34 66 48 94 50C66 52 52 66 50 94C48 66 34 52 6 50C34 48 48 34 50 6z" style="stroke-width:5"/></svg></div>
    <div class="note" style="left:104px;top:1104px;width:880px;transform:rotate(-.8deg)">${s.noteText}</div>
    ${dots(i)}${swipe()}${defs}</div>`;
}

const page = (body) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=1080">
<link rel="stylesheet" href="../src/theme.css"><link rel="stylesheet" href="../src/base.css"></head><body>${body}</body></html>`;

// ---------- QA (roda no navegador) ----------
const qa = () => {
  const issues = [];
  const q = (sel) => [...document.querySelectorAll(sel)];
  const R = (el) => {
    if (el.matches(".checks li")) { const g = document.createRange(); g.selectNodeContents(el.lastElementChild); const t = g.getBoundingClientRect(), b = el.firstElementChild.getBoundingClientRect(); return { left: b.left, top: Math.min(t.top, b.top), right: t.right, bottom: Math.max(t.bottom, b.bottom) }; }
    if (el.matches(".note")) { const g = document.createRange(); g.selectNodeContents(el); const t = g.getBoundingClientRect(), b = el.getBoundingClientRect(); return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, tl: t.left, tr: t.right }; }
    return el.getBoundingClientRect();
  };
  const text = [...q(".counter"), ...q(".tag"), ...q(".numeral"), ...q(".title .line"), ...q(".sub"), ...q(".checks li"), ...q(".note"), ...q(".swipe"), ...q(".dots")];
  const art = [...q(".print"), ...q(".photo:not(.print .photo)")];
  const nm = (el) => (el.className || "") + ":" + (el.textContent || "").trim().slice(0, 22);
  for (const el of text) {
    const r = R(el);
    if (r.left < 62 || r.right > 1080 - 30 || r.bottom > 1350 - 22 || r.top < 20) issues.push(`fora da margem: ${nm(el)} [${[r.left, r.top, r.right, r.bottom].map(Math.round)}]`);
    if (el.scrollWidth > el.clientWidth + 2 && !el.matches(".title .line, .numeral")) issues.push(`texto cortado: ${nm(el)}`);
  }
  const inter = (a, b) => { const x = Math.min(a.right, b.right) - Math.max(a.left, b.left), y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top); return x > 0 && y > 0 ? x * y : 0; };
  for (let i = 0; i < text.length; i++) for (let j = i + 1; j < text.length; j++) {
    const a = text[i], b = text[j]; if (a.contains(b) || b.contains(a)) continue;
    const ar = inter(R(a), R(b)); if (ar > 80) issues.push(`texto sobreposto: ${nm(a)} × ${nm(b)} (${Math.round(ar)}px²)`);
  }
  // texto × foto: contadores sobre a foto da capa são intencionais (ignorados)
  for (const t of text) { if (t.matches(".counter")) continue; for (const a of art) { const ar = inter(R(t), R(a)); if (ar > 150) issues.push(`texto sobre foto: ${nm(t)} (${Math.round(ar)}px²)`); } }
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
    if (s.status !== "v2") { console.log("· " + s.file + " (pendente de aprovação)"); continue; }
    const html = page(s.type === "cover" ? renderCover(s, i) : renderSplit(s, i));
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
  await browser.close();
  console.log(problems ? `\n${problems} alerta(s) de QA` : "\nQA: sem cortes, sobreposições ou margens violadas");
})();
