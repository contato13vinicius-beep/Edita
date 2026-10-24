// Biblioteca de ilustrações desenhadas à mão (SVG). Cada item: viewBox 0 0 200 200.
// Classes de preenchimento: w branco, y amarelo, b azul, m menta, p rosa, l lilás, g grafite, e bege.
const S = (inner, vb = "0 0 200 200") => `<svg class="ill" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;

const ill = {
  coffee: () => S(`
    <ellipse class="w" cx="98" cy="166" rx="78" ry="14"/>
    <path class="n" d="M148 96h10c18 0 20 30-4 36l-12 3"/>
    <path class="w" d="M44 84h108v26c0 34-24 52-54 52s-54-18-54-52z"/>
    <ellipse class="e" cx="98" cy="84" rx="54" ry="11"/>
    <path d="M78 62c-9-10 9-18 0-30M110 62c-9-10 9-18 0-30"/>`),
  planner: () => S(`
    <rect class="y" x="38" y="22" width="126" height="160" rx="10"/>
    <path d="M38 54h126"/><path d="M30 76h18M30 106h18M30 136h18M30 166h18"/>
    <rect class="w" x="66" y="70" width="18" height="18" rx="3"/><path d="M69 79l5 6 9-13"/>
    <rect class="w" x="66" y="100" width="18" height="18" rx="3"/><path d="M69 109l5 6 9-13"/>
    <rect class="w" x="66" y="130" width="18" height="18" rx="3"/>
    <path d="M96 79h50M96 109h42M96 139h34"/><path d="M60 38h40"/>`),
  phone: () => S(`
    <rect class="g" x="60" y="12" width="84" height="170" rx="18"/>
    <rect class="b" x="69" y="30" width="66" height="136" rx="6" style="stroke-width:3"/>
    <path class="sy" d="M90 21h24"/>
    <rect class="w" x="77" y="42" width="50" height="20" rx="4" style="stroke-width:3"/>
    <rect class="y" x="77" y="72" width="22" height="22" rx="6" style="stroke-width:3"/>
    <rect class="m" x="105" y="72" width="22" height="22" rx="6" style="stroke-width:3"/>
    <rect class="p" x="77" y="102" width="22" height="22" rx="6" style="stroke-width:3"/>
    <rect class="w" x="105" y="102" width="22" height="22" rx="6" style="stroke-width:3"/>
    <path style="stroke-width:3" d="M77 138h50M77 150h30"/>`),
  clock: () => S(`
    <circle class="p" cx="52" cy="52" r="20"/><circle class="p" cx="148" cy="52" r="20"/>
    <circle class="w" cx="100" cy="106" r="68"/>
    <path d="M100 48v10M100 154v10M42 106h10M148 106h10"/>
    <path style="stroke-width:6" d="M100 106V68M100 106l26 15"/>
    <circle class="k" cx="100" cy="106" r="6"/><path d="M64 176l-10 12M136 176l10 12"/>`),
  miniCheck: () => S(`
    <g transform="rotate(-4 100 100)"><rect class="w" x="40" y="20" width="124" height="160" rx="6"/>
    <rect class="m" x="56" y="44" width="20" height="20" rx="4"/><path d="M59 54l6 7 10-14"/><path d="M88 54h56"/>
    <rect class="m" x="56" y="82" width="20" height="20" rx="4"/><path d="M59 92l6 7 10-14"/><path d="M88 92h46"/>
    <rect class="m" x="56" y="120" width="20" height="20" rx="4"/><path d="M59 130l6 7 10-14"/><path d="M88 130h52"/>
    <path d="M56 160h40"/></g>`),
  laptop: () => S(`
    <rect class="g" x="34" y="30" width="132" height="92" rx="9"/>
    <rect class="w" x="45" y="41" width="110" height="70" rx="3" style="stroke-width:3"/>
    <rect class="b" x="58" y="82" width="16" height="22" style="stroke-width:3"/>
    <rect class="y" x="82" y="68" width="16" height="36" style="stroke-width:3"/>
    <rect class="m" x="106" y="54" width="16" height="50" style="stroke-width:3"/>
    <path style="stroke-width:3" d="M130 60h16M130 72h12"/>
    <path class="e" d="M14 130h172l-10 24H24z"/><path d="M82 140h36"/>`),
  books: () => S(`
    <rect class="b" x="26" y="138" width="148" height="32" rx="4"/><path d="M46 138v32M56 138v32"/>
    <rect class="y" x="36" y="104" width="126" height="32" rx="4"/><path d="M142 104v32M152 104v32"/>
    <g transform="rotate(-5 90 84)"><rect class="p" x="30" y="70" width="136" height="32" rx="4"/><path d="M52 70v32M62 70v32"/></g>`),
  chart: () => S(`
    <path d="M24 170H182M24 170V28"/>
    <rect class="m" x="42" y="126" width="26" height="44"/><rect class="y" x="82" y="98" width="26" height="72"/><rect class="b" x="122" y="70" width="26" height="100"/>
    <path d="M36 112L88 80L118 56L170 30M170 30l-16 2M170 30l-3 16"/>`),
  dumbbell: () => S(`
    <path style="stroke-width:12" d="M62 100h76"/>
    <rect class="g" x="40" y="58" width="22" height="84" rx="7"/><rect class="g" x="138" y="58" width="22" height="84" rx="7"/>
    <rect class="g" x="22" y="74" width="18" height="52" rx="6"/><rect class="g" x="160" y="74" width="18" height="52" rx="6"/>`),
  sneaker: () => S(`
    <path class="w" d="M18 132V80c22 2 36-10 44-28l20 10c10 20 28 30 62 34 24 4 36 14 36 30v6z"/>
    <path class="b" d="M14 140h176v12a12 12 0 0 1-12 12H26a12 12 0 0 1-12-12z"/>
    <path d="M84 70l10-8M94 84l10-8M106 96l10-8"/><path class="m" d="M36 122c24 8 56 2 90-12"/>`),
  bottle: () => S(`
    <rect class="g" x="80" y="18" width="40" height="30" rx="7"/>
    <path class="b" d="M70 60c0-10 10-12 30-12s30 2 30 12v100a18 18 0 0 1-18 18H88a18 18 0 0 1-18-18z"/>
    <rect class="w" x="70" y="96" width="60" height="44"/><path d="M78 118q6-9 12 0t12 0t12 0"/>`),
  calculator: () => S(`
    <rect class="w" x="46" y="16" width="108" height="168" rx="14"/>
    <rect class="m" x="60" y="32" width="80" height="32" rx="5"/>
    ${[0, 1, 2].map(c => [0, 1, 2, 3].map(r => `<circle class="${r === 3 && c === 2 ? "y" : "w"}" cx="${70 + c * 30}" cy="${90 + r * 26}" r="9"/>`).join("")).join("")}`),
  coins: () => S(`
    <ellipse class="y" cx="100" cy="150" rx="60" ry="20"/><path d="M40 150v14c0 11 27 20 60 20s60-9 60-20v-14"/>
    <ellipse class="y" cx="100" cy="124" rx="60" ry="20"/><path d="M40 124v14c0 11 27 20 60 20s60-9 60-20v-14" />
    <ellipse class="y" cx="100" cy="98" rx="60" ry="20"/><path d="M40 98v14c0 11 27 20 60 20s60-9 60-20V98"/>
    <ellipse class="y" cx="100" cy="72" rx="60" ry="20"/><path d="M40 72v14c0 11 27 20 60 20s60-9 60-20V72"/>
    <path style="stroke-width:3" d="M104 64c-6-4-16-2-16 4s8 6 12 8 6 8-2 10-14-2-16-6"/>`),
  passport: () => S(`
    <g transform="rotate(-6 100 100)"><rect class="g" x="46" y="18" width="110" height="164" rx="10"/>
    <circle class="n sy" cx="101" cy="82" r="28" style="stroke:var(--yellow)"/>
    <path style="stroke:var(--yellow)" d="M73 82h56M101 54c-14 14-14 42 0 56M101 54c14 14 14 42 0 56"/>
    <path style="stroke:var(--yellow)" d="M70 134h62M82 150h38"/></g>`),
  plane: () => S(`
    <path class="n" style="stroke-dasharray:3 12" d="M8 190C30 140 70 150 90 110"/>
    <g transform="rotate(38 118 92)"><path class="w" d="M118 14c8 0 10 10 10 20v38l56 32v14l-56-16v28l16 12v10l-26-8-26 8v-10l16-12v-28l-56 16v-14l56-32V34c0-10 2-20 10-20z"/></g>`),
  suitcase: () => S(`
    <path class="n" d="M76 58V40a8 8 0 0 1 8-8h32a8 8 0 0 1 8 8v18"/>
    <rect class="e" x="32" y="58" width="136" height="108" rx="14"/>
    <path d="M68 58v108M132 58v108"/>
    <circle class="p" cx="100" cy="100" r="15"/><rect class="b" x="80" y="124" width="26" height="20" rx="3" transform="rotate(-8 93 134)"/>
    <path d="M56 166v10M144 166v10"/>`),
  postcards: () => S(`
    <g transform="rotate(9 100 100)"><rect class="y" x="40" y="46" width="124" height="86" rx="4"/><path d="M56 76h56M56 92h44M56 108h50"/><rect class="w" x="128" y="58" width="24" height="26"/></g>
    <g transform="rotate(-8 100 100)"><rect class="w" x="26" y="74" width="124" height="86" rx="4"/><rect class="b" x="34" y="82" width="108" height="50"/><circle class="y" cx="112" cy="98" r="9"/><path d="M34 132l30-26 24 18 18-12 36 20"/></g>`),
  key: () => S(`
    <circle class="w" cx="60" cy="100" r="34"/><circle class="g" cx="60" cy="100" r="10"/>
    <path d="M94 100h86M150 100v22M168 100v16"/>`),
  pin: () => S(`
    <path class="n" style="stroke-dasharray:3 12" d="M14 186C60 190 40 130 90 140S150 150 170 170"/>
    <path class="p" d="M100 20c-26 0-42 18-42 40 0 28 42 70 42 70s42-42 42-70c0-22-16-40-42-40z"/><circle class="w" cx="100" cy="60" r="14"/>`),
  heart: () => S(`<path class="p" d="M100 168C40 126 24 90 36 62c12-28 50-26 64 4 14-30 52-32 64-4 12 28-4 64-64 106z"/>`),
  sun: () => S(`<circle class="y" cx="100" cy="100" r="40"/><path d="M100 24v20M100 156v20M24 100h20M156 100h20M46 46l14 14M140 140l14 14M154 46l-14 14M60 140l-14 14"/>`),
  star: () => S(`<path class="y" d="M100 20l24 56 60 6-45 40 14 60-53-32-53 32 14-60-45-40 60-6z"/>`),
  bulb: () => S(`
    <path class="y" d="M100 20c-32 0-54 24-54 52 0 20 10 32 20 44 6 8 8 14 8 24h52c0-10 2-16 8-24 10-12 20-24 20-44 0-28-22-52-54-52z"/>
    <path d="M80 148h40M84 164h32M92 180h16"/><path d="M92 100l8-14 8 14"/>`),
  mountain: () => S(`<path class="l" d="M10 160L70 60l36 54 24-30 60 76z"/><path class="w" d="M70 60l-16 24 16-8 12 10z"/>`),
  watch: () => S(`
    <path class="g" d="M72 14h56l6 40H66zM72 186h56l6-40H66z"/>
    <circle class="w" cx="100" cy="100" r="46"/><circle class="g" cx="100" cy="100" r="36"/>
    <path style="stroke:#fff;stroke-width:4" d="M100 100V76M100 100l16 8"/>`),
};

// Setas e rabiscos
const doodle = {
  arrowRight: () => `<svg class="ill" viewBox="0 0 200 80"><path d="M10 50C50 20 110 20 180 44M180 44l-26-14M180 44l-22 22"/></svg>`,
  arrowDown: () => `<svg class="ill" viewBox="0 0 80 200"><path d="M40 10C10 50 10 110 38 180M38 180l-18-24M38 180l24-18"/></svg>`,
  squiggle: () => `<svg class="ill" viewBox="0 0 200 40"><path d="M6 24q14-20 28 0t28 0t28 0t28 0t28 0t28 0"/></svg>`,
  sparkle: () => `<svg class="ill" viewBox="0 0 100 100"><path d="M50 8v84M8 50h84M22 22l56 56M78 22L22 78" style="stroke-width:5"/></svg>`,
};

// Cenas ilustradas usadas como substituto dos slots de foto (viewBox 300x300)
const win = (x, y, w, h, c = "#F7D76A") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`;
const skyline = (seed, base, color, lit) => {
  let out = "", x = 0, k = seed;
  const rnd = () => (k = (k * 9301 + 49297) % 233280) / 233280;
  while (x < 300) {
    const w = 28 + rnd() * 34, h = 60 + rnd() * 130;
    out += `<rect x="${x}" y="${base - h}" width="${w}" height="${h}" fill="${color}"/>`;
    for (let yy = base - h + 10; yy < base - 8; yy += 14)
      for (let xx = x + 6; xx < x + w - 8; xx += 12) if (rnd() > .45) out += win(xx, yy, 6, 7, lit);
    x += w + 2;
  }
  return out;
};
const scenes = {
  city: () => `<defs><linearGradient id="gc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f4a"/><stop offset=".55" stop-color="#d98aa8"/><stop offset="1" stop-color="#f7c98b"/></linearGradient></defs>
    <rect width="300" height="300" fill="url(#gc)"/><circle cx="220" cy="190" r="30" fill="#fbe29a" opacity=".9"/>${skyline(7, 250, "#1d1f2b", "#F7D76A")}
    <rect y="250" width="300" height="50" fill="#14161f"/><path d="M0 262h300M0 276h300" stroke="#F7D76A" stroke-opacity=".35" stroke-width="3"/>`,
  modern: () => `<defs><linearGradient id="gm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#83C9EB"/><stop offset="1" stop-color="#e8f3f8"/></linearGradient></defs>
    <rect width="300" height="300" fill="url(#gm)"/>${skyline(21, 300, "#3a4a5c", "#d8eef8")}<rect y="0" width="300" height="300" fill="#fff" opacity=".06"/>`,
  gym: () => `<rect width="300" height="300" fill="#262626"/><rect y="210" width="300" height="90" fill="#3a3a3a"/>
    <rect x="20" y="40" width="260" height="130" fill="#3d4650"/><rect x="20" y="40" width="260" height="130" fill="none" stroke="#6c7783" stroke-width="4"/>
    <path d="M110 40L70 170M200 40L160 170" stroke="#ffffff" stroke-opacity=".08" stroke-width="22"/>
    <rect x="30" y="190" width="240" height="10" fill="#111"/>
    ${[0, 1, 2, 3, 4].map(i => `<g transform="translate(${50 + i * 48} ${160})"><rect x="-6" y="0" width="12" height="30" rx="3" fill="#8a8a8a"/><rect x="-18" y="-2" width="12" height="34" rx="3" fill="#111"/><rect x="6" y="-2" width="12" height="34" rx="3" fill="#111"/></g>`).join("")}
    <rect x="70" y="230" width="160" height="22" rx="6" fill="#111"/><rect x="90" y="252" width="10" height="30" fill="#111"/><rect x="200" y="252" width="10" height="30" fill="#111"/>
    <circle cx="150" cy="30" r="90" fill="#F7D76A" opacity=".08"/>`,
  beach: () => `<rect width="300" height="300" fill="#83C9EB"/><circle cx="80" cy="70" r="34" fill="#F7D76A"/>
    <rect y="150" width="300" height="70" fill="#4aa7d6"/><path d="M0 170q30-10 60 0t60 0t60 0t60 0t60 0" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>
    <path d="M0 215q80-25 160-8t140-6v100H0z" fill="#e9d6a8"/>
    <path d="M230 300c0-50 6-90 14-130" stroke="#6b4a2b" stroke-width="9" fill="none"/>
    <path d="M244 170c-30-14-50-6-62 8 22-10 40-6 62-8zM244 170c26-18 46-14 58 2-20-8-38-6-58-2zM244 170c-8-26-26-36-44-34 22 4 34 14 44 34zM244 170c10-24 28-34 46-30-22 2-36 12-46 30z" fill="#3f9d6b" stroke="#2c6f4b" stroke-width="3"/>`,
  family: () => `<defs><linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8A5EE"/><stop offset=".5" stop-color="#F2A5D0"/><stop offset="1" stop-color="#F7D76A"/></linearGradient></defs>
    <rect width="300" height="300" fill="url(#gf)"/><circle cx="150" cy="190" r="62" fill="#fff3c4" opacity=".9"/>
    <path d="M0 230q80-40 150-20t150-10v100H0z" fill="#1f1a2b"/>
    <g fill="#14121c"><circle cx="112" cy="168" r="12"/><path d="M96 232c0-34 6-52 16-52s16 18 16 52z"/>
    <circle cx="156" cy="170" r="11"/><path d="M142 232c0-32 5-50 14-50s14 18 14 50z"/>
    <circle cx="190" cy="196" r="8"/><path d="M180 234c0-22 3-34 10-34s10 12 10 34z"/></g>`,
  mountain: () => `<rect width="300" height="300" fill="#F2A5D0"/><circle cx="220" cy="80" r="30" fill="#F7D76A"/>
    <path d="M0 220L90 110l60 80 40-50 110 100v40H0z" fill="#8d6fc4"/><path d="M0 250l100-60 80 40 120-50v120H0z" fill="#3b2f5c"/>`,
  road: () => `<defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7c98b"/><stop offset="1" stop-color="#d98aa8"/></linearGradient></defs>
    <rect width="300" height="300" fill="url(#gr)"/><circle cx="150" cy="150" r="40" fill="#fff3c4"/><path d="M0 160h300v140H0z" fill="#2a2a33"/>
    <path d="M120 160L20 300h80zM180 160l100 140h-80z" fill="#1d1d24"/><path d="M150 164v20M150 196v30M150 240v60" stroke="#F7D76A" stroke-width="6"/>`,
};

module.exports = { ill, doodle, scenes };
