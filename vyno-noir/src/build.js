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
const photoInner = (p, compact) => fs.existsSync(path.join(ROOT, "assets/photos", p.slot + ".jpg"))
  ? `<img src="../assets/photos/${p.slot}.jpg">`
  : `<div class="ph${p.align === "top" ? " top" : ""}"><div class="label">${p.label}</div><p>${p.desc}</p><div class="dim">${compact ? "RESERVADO" : "ESPAÇO RESERVADO"} · ${p.dim}</div></div>`;

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

// ---------- blocos reutilizáveis ----------
const head = (s, o = {}) => {
  const two = s.titleLines.length > 1;
  const nsz = o.nsz || 300, ts = s.ts, top = o.top ?? 0;
  return `<div class="numeral" style="position:absolute;left:96px;top:${(o.ntop ?? 118) + top}px;font-size:${nsz}px">${s.n}</div>
    <div class="title" style="position:absolute;left:${o.tl || 262}px;top:${(two ? 120 : 150) + top + (o.ttop || 0)}px;font-size:${ts}px">${s.titleLines.map((t) => `<span class="line"><span class="hl">${t}</span></span>`).join("")}</div>`;
};
const subEl = (s, top) => `<div class="sub" style="position:absolute;left:104px;top:${top}px;font-size:48px">${s.sub}<span class="brush-under" style="width:${Math.min(460, 60 + s.sub.length * 12)}px"></span></div>`;
const frame = (i, o = {}) => `<div class="paper"></div>${spine()}${counter(i)}<div class="tag label">${content.tag}</div>`;
const noteEl = (html, st) => `<div class="note" style="${style(st)}">${html}</div>`;
const print = (p, o) => `<div class="print" style="${style({ left: o.x + "px", top: o.y + "px", width: o.w + "px", height: o.h + "px", transform: `rotate(${o.r || 0}deg)` })}">
  <div class="tape" style="left:${o.w / 2 - 65}px;top:-22px;transform:rotate(${-(o.r || 0) - 2}deg)"></div>
  <div class="photo${o.w < 300 ? " sm" : ""}">${photoInner(p, o.w < 300)}</div></div>`;
const arrow = (x, y, w, r, vb = "0 0 200 80", d = "M10 50C50 20 110 20 180 44M180 44l-26-14M180 44l-22 22") => `<div class="doodle" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${r}deg)"><svg viewBox="${vb}"><path d="${d}"/></svg></div>`;

// foto que sangra até a borda, com borda rasgada (edge: top | bottom | left)
const bleed = (p, x, y, w, h, edge, seed = 3) => {
  const r = rng(seed), pad = 14, pts = [], fr = [];
  const jag = (n) => (r() - .5) * 14 + (r() > .94 ? 11 : 0) + n;
  if (edge === "bottom") { pts.push("0 0", `${w}px 0`); fr.push("0 0", `${w}px 0`); for (let X = w; X >= 0; X -= 14) { pts.push(`${X}px ${jag(h - 12)}px`); fr.push(`${X}px ${jag(h - 4)}px`); } }
  if (edge === "top") { for (let X = 0; X <= w; X += 14) { pts.push(`${X}px ${jag(pad + 12)}px`); fr.push(`${X}px ${jag(pad + 4)}px`); } pts.push(`${w}px ${h + pad}px`, `0 ${h + pad}px`); fr.push(`${w}px ${h + pad}px`, `0 ${h + pad}px`); }
  if (edge === "left") { for (let Y = 0; Y <= h; Y += 14) { pts.push(`${jag(pad + 12)}px ${Y}px`); fr.push(`${jag(pad + 4)}px ${Y}px`); } pts.push(`${w + pad}px ${h}px`, `${w + pad}px 0`); fr.push(`${w + pad}px ${h}px`, `${w + pad}px 0`); }
  const ox = edge === "left" ? -pad : 0, oy = edge === "top" ? -pad : 0;
  const bw = w + (edge === "left" ? pad : 0), bh = h + (edge === "top" ? pad : 0);
  return `<div style="position:absolute;left:${x + ox}px;top:${y + oy}px;width:${bw}px;height:${bh + (edge === "bottom" ? 0 : 0)}px;filter:drop-shadow(0 ${edge === "top" ? -6 : 6}px 10px rgba(16,16,16,.28))">
    <div style="position:absolute;inset:0;background:#fff;clip-path:polygon(${fr.join(",")})"></div>
    <div class="photo" style="inset:0;clip-path:polygon(${pts.join(",")})">${photoInner(p)}</div></div>`;
};

// ---------- layouts ----------
function renderSplit(s, i) {   // 02: foto-impressão à direita
  return `<div class="slide">${frame(i)}${head(s)}${subEl(s, 392)}
    ${list(s, { left: "104px", top: "500px", width: "490px", gap: "20px" }).replace(/<li>/g, '<li style="font-size:42px">')}
    ${print(s.photo, { x: 636, y: 470, w: 384, h: 560, r: 2.5 })}
    <div class="doodle champ" style="left:880px;top:150px;width:70px"><svg viewBox="0 0 100 100"><path d="M50 6C52 34 66 48 94 50C66 52 52 66 50 94C48 66 34 52 6 50C34 48 48 34 50 6z" style="stroke-width:5"/></svg></div>
    ${noteEl(s.noteText, { left: "104px", top: "1104px", width: "880px", transform: "rotate(-.8deg)" })}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderBand(s, i) {    // 03: foto panorâmica no topo, lista em largura total
  return `<div class="slide">${frame(i)}${head(s)}${subEl(s, 366)}
    ${print(s.photo, { x: 110, y: 486, w: 868, h: 262, r: -1.2 })}
    ${list(s, { left: "104px", top: "792px", width: "880px", gap: "14px" }).replace(/<li>/g, '<li style="font-size:44px">')}
    ${noteEl(s.noteText, { left: "104px", top: "1146px", width: "880px", "font-size": "56px", transform: "rotate(.6deg)", padding: "20px 44px 24px" })}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderLeft(s, i) {    // 04: foto à esquerda, lista à direita, nota à direita
  return `<div class="slide">${frame(i)}${head(s)}${subEl(s, 366)}
    ${print(s.photo, { x: 112, y: 480, w: 380, h: 570, r: -2.5 })}
    ${list(s, { left: "540px", top: "492px", width: "490px", gap: "20px" }).replace(/<li>/g, '<li style="font-size:42px">')}
    ${noteEl(s.noteText, { left: "420px", top: "1092px", width: "590px", "font-size": "58px", transform: "rotate(-.8deg)" })}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderListFirst(s, i) { // 05: lista no topo, foto + nota embaixo
  return `<div class="slide">${frame(i)}${head(s)}${subEl(s, 392)}
    ${list(s, { left: "104px", top: "500px", width: "880px", gap: "18px" }).replace(/<li>/g, '<li style="font-size:44px">')}
    ${print(s.photo, { x: 112, y: 880, w: 520, h: 340, r: -2 })}
    ${arrow(790, 772, 56, -4, "0 0 80 200", "M30 10C60 50 60 120 40 180M40 180l-20-22M40 180l26-14")}
    ${noteEl(s.noteText, { left: "672px", top: "930px", width: "340px", "font-size": "54px", transform: "rotate(1.2deg)", padding: "26px 30px 30px" })}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderCollage(s, i) {   // 06: colagem 2x2 de fotos
  const pos = [[596, 470, -3], [822, 486, 2.5], [606, 768, 2], [826, 778, -2.5]];
  return `<div class="slide">${frame(i)}${head(s)}${subEl(s, 366)}
    ${list(s, { left: "104px", top: "492px", width: "470px", gap: "20px" }).replace(/<li>/g, '<li style="font-size:42px">')}
    ${s.photos.map((p, k) => print(p, { x: pos[k][0], y: pos[k][1], w: 206, h: 262, r: pos[k][2] })).join("")}
    ${noteEl(s.noteText, { left: "104px", top: "1074px", width: "880px", "font-size": "54px", transform: "rotate(.6deg)" })}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderBleedRight(s, i) { // 07: foto sangra à direita com borda rasgada
  return `<div class="slide">${frame(i)}${head(s)}${subEl(s, 366)}
    ${list(s, { left: "104px", top: "492px", width: "500px", gap: "20px" }).replace(/<li>/g, '<li style="font-size:42px">')}
    ${bleed(s.photo, 654, 456, 426, 600, "left", 8)}
    ${noteEl(s.noteText, { left: "104px", top: "1086px", width: "880px", "font-size": "54px", transform: "rotate(-.6deg)" })}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderBleedBottom(s, i) { // 08: foto sangra embaixo, nota sobre a foto
  return `<div class="slide light-ui">${frame(i)}${head(s)}${subEl(s, 358)}
    ${list(s, { left: "104px", top: "456px", width: "880px", gap: "12px" }).replace(/<li>/g, '<li style="font-size:42px">')}
    ${bleed(s.photo, 56, 808, 1024, 542, "top", 11)}
    ${noteEl(s.noteText, { left: "104px", top: "1052px", width: "690px", "font-size": "54px", transform: "rotate(-.8deg)" }).replace('class="note"', 'class="note ov"')}
    ${dots(i)}${swipe()}${defs}</div>`;
}
function renderClosing(s, i) {   // 09: espelho da capa — foto no topo, assinatura no fim
  const r = rng(21), base = 440, fr = ["0 0", "100% 0"], tn = ["0 0", "100% 0"];
  for (let X = 1080; X >= 0; X -= 14) { tn.push(`${X}px ${base + (r() - .5) * 16 + (r() > .93 ? 12 : 0)}px`); fr.push(`${X}px ${base + 8 + (r() - .5) * 14}px`); }
  return `<div class="slide"><div class="paper"></div>
    <div style="position:absolute;inset:0;filter:drop-shadow(0 8px 12px rgba(16,16,16,.30))">
      <div style="position:absolute;left:0;top:0;width:1080px;height:460px;background:#fff;clip-path:polygon(${fr.join(",")})"></div>
      <div class="photo dark-edge" style="left:0;top:0;width:1080px;height:460px;clip-path:polygon(${tn.join(",")})">${photoInner(s.photo)}</div></div>
    ${spine()}${counter(i)}
    <div class="label" style="position:absolute;right:64px;top:62px;z-index:12;color:var(--paper);font-size:28px;letter-spacing:.38em;text-shadow:0 1px 8px rgba(0,0,0,.6)">VYNO NOIR</div>
    ${head(s, { nsz: 230, ntop: 460, tl: 232, ttop: 336, top: 0 }).replace(/top:150px/, "top:482px")}
    <div class="sub" style="position:absolute;left:104px;top:654px;font-size:44px">${s.sub}<span class="brush-under" style="width:420px"></span></div>
    ${list(s, { left: "104px", top: "752px", width: "880px", gap: "9px" }).replace(/<li>/g, '<li style="font-size:40px">')}
    ${noteEl(s.noteText, { left: "104px", top: "1084px", width: "640px", "font-size": "60px", transform: "rotate(-.8deg)", padding: "24px 44px 28px" })}
    <div class="brand-sign" style="position:absolute;right:64px;top:1150px;width:236px;text-align:right;z-index:12"><div class="label" style="font-size:30px;letter-spacing:.3em;color:var(--black);margin-right:-.3em">VYNO NOIR</div><div style="font-family:var(--font-note);font-weight:700;font-size:36px;line-height:1;color:var(--espresso);margin-top:10px">vivendo mais,<br>mostrando menos</div></div>
    ${dots(i)}${defs}</div>`;
}
const RENDER = { cover: renderCover, split: renderSplit, band: renderBand, left: renderLeft, listfirst: renderListFirst, collage: renderCollage, bleedright: renderBleedRight, bleedbottom: renderBleedBottom, closing: renderClosing };

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
  for (const t of text) { if (t.matches(".counter, .ov") || (t.matches(".dots, .swipe") && t.closest(".light-ui"))) continue; for (const a of art) { const ar = inter(R(t), R(a)); if (ar > 150) issues.push(`texto sobre foto: ${nm(t)} (${Math.round(ar)}px²)`); } }
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
    const html = page(RENDER[s.layout || s.type](s, i));
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
  if (!only) {   // prévia geral (apenas para revisão)
    const g = 30, pw = 540, ph = 675;
    fs.writeFileSync(path.join(HTML, "preview.html"), `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#161616;width:${3 * pw + 4 * g}px;height:${3 * ph + 4 * g}px;display:grid;grid-template-columns:repeat(3,${pw}px);gap:${g}px;padding:${g}px;box-sizing:border-box">${content.slides.map((s) => `<img src="../out/${s.file}.png" width="${pw}" height="${ph}">`).join("")}</body>`);
    const pp = await ctx.newPage();
    await pp.setViewportSize({ width: 3 * pw + 4 * g, height: 3 * ph + 4 * g });
    await pp.goto("file://" + path.join(HTML, "preview.html"));
    await pp.waitForTimeout(300);
    await pp.screenshot({ path: path.join(OUT, "vyno-noir-preview.png") });
  }
  await browser.close();
  console.log(problems ? `\n${problems} alerta(s) de QA` : "\nQA: sem cortes, sobreposições ou margens violadas");
})();
