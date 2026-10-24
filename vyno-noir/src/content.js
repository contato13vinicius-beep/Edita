// =====================================================================
// Conteúdo e composição do carrossel "LIFESTYLE ROADMAP".
// Textos editáveis aqui. Marque *palavras* para receber marca-texto.
// decor: ilustrações { ill, x, y, w, r }   photos: polaroids { slot, scene, x, y, w, r, cap }
// Fotos reais: salve em assets/photos/<slot>.jpg — são usadas automaticamente.
// =====================================================================
const PHOTO = "../assets/photos/personagem.jpg";

module.exports = {
  total: 9,
  tag: "LIFESTYLE ROADMAP",
  slides: [
    {
      file: "vyno-noir-01-capa", type: "cover",
      accent: "var(--yellow)", accent2: "var(--lilac)",
      titleLines: [{ t: "LIFESTYLE", c: "var(--yellow)" }, { t: "ROADMAP", c: "var(--pink)" }],
      sub: "Passo a passo para construir a vida que você quer.",
      items: ["Rotina", "Carreira", "Saúde", "Dinheiro", "Viagens", "Lifestyle", "Vida pessoal", "Liberdade"],
      itemColors: ["var(--yellow)", "var(--blue)", "var(--mint)", "var(--lilac)", "var(--pink)", "var(--yellow)", "var(--blue)", "var(--mint)"],
    },
    {
      file: "vyno-noir-02-rotina", type: "content", n: "1",
      accent: "var(--yellow)", accent2: "var(--blue)", note: "var(--blue)",
      titleLines: ["ROTINA"], ts: 170,
      sub: "A base de tudo.",
      items: ["Organize seus *horários*.", "Defina *três prioridades* por dia.", "Reduza as *distrações*.", "Crie hábitos que consiga *manter*.", "Reserve tempo para *descansar*."],
      noteText: "Consistência antes de intensidade.",
      noteTop: 1075,
      decor: [
        { ill: "coffee", x: 742, y: 505, w: 150, r: -6 },
        { ill: "clock", x: 900, y: 495, w: 140, r: 8 },
        { ill: "planner", x: 748, y: 690, w: 190, r: 4 },
        { ill: "phone", x: 945, y: 690, w: 100, r: -6 },
        { ill: "miniCheck", x: 905, y: 880, w: 140, r: 4 },
        { ill: "arrowDown", x: 700, y: 905, w: 60, r: 0 },
      ],
    },
    {
      file: "vyno-noir-03-carreira", type: "content", n: "2",
      accent: "var(--blue)", accent2: "var(--yellow)", note: "var(--yellow)",
      titleLines: ["TRABALHO &", "CARREIRA"], ts: 124,
      sub: "Construa suas oportunidades.",
      items: ["Desenvolva novas *habilidades*.", "Invista em *conhecimento*.", "Aprenda com seus *erros*.", "Crie *conexões* profissionais.", "Pense no *longo prazo*."],
      noteText: "Seu próximo nível exige novas habilidades.",
      noteTop: 1075,
      decor: [
        { ill: "laptop", x: 735, y: 498, w: 205, r: -3 },
        { ill: "chart", x: 945, y: 500, w: 100, r: 5 },
        { ill: "books", x: 905, y: 1085, w: 130, r: 4 },
      ],
      photos: [{ slot: "carreira", scene: "modern", x: 740, y: 690, w: 285, r: 4, cap: "" }],
    },
    {
      file: "vyno-noir-04-saude", type: "content", n: "3",
      accent: "var(--mint)", accent2: "var(--pink)", note: "var(--pink)",
      titleLines: ["ACADEMIA &", "SAÚDE"], ts: 124,
      sub: "Energia para viver mais.",
      items: ["Treine com *regularidade*.", "Tenha uma alimentação *equilibrada*.", "Priorize o *sono*.", "Cuide da *saúde mental*.", "Acompanhe sua *evolução*."],
      noteText: "Cuide do corpo que acompanha seus sonhos.",
      noteTop: 1075,
      decor: [
        { ill: "dumbbell", x: 735, y: 498, w: 190, r: -8 },
        { ill: "bottle", x: 940, y: 480, w: 100, r: 6 },
        { ill: "sneaker", x: 900, y: 1095, w: 140, r: -4 },
      ],
      photos: [{ slot: "academia", scene: "gym", x: 740, y: 690, w: 285, r: -4, cap: "" }],
    },
    {
      file: "vyno-noir-05-dinheiro", type: "content", n: "4",
      accent: "var(--lilac)", accent2: "var(--yellow)", note: "var(--mint)",
      titleLines: ["DINHEIRO"], ts: 160,
      sub: "Uma ferramenta para ter escolhas.",
      items: ["Conheça seus *gastos*.", "Evite *dívidas* desnecessárias.", "Construa uma *reserva* financeira.", "Aprenda sobre *investimentos*.", "Busque desenvolver sua *renda*."],
      noteText: "Liberdade financeira começa com organização.",
      noteTop: 1075,
      decor: [
        { ill: "calculator", x: 742, y: 500, w: 130, r: -6 },
        { ill: "coins", x: 890, y: 505, w: 140, r: 4 },
        { ill: "laptop", x: 735, y: 715, w: 200, r: 3 },
        { ill: "chart", x: 945, y: 720, w: 100, r: -4 },
        { ill: "books", x: 790, y: 905, w: 120, r: 4 },
        { ill: "miniCheck", x: 905, y: 1060, w: 130, r: 4 },
      ],
    },
    {
      file: "vyno-noir-06-viagens", type: "content", n: "5",
      accent: "var(--pink)", accent2: "var(--blue)", note: "var(--yellow)",
      titleLines: ["VIAGENS &", "EXPERIÊNCIAS"], ts: 112,
      sub: "Colecione momentos.",
      items: ["Conheça novos *lugares*.", "Explore diferentes *culturas*.", "Experimente *coisas novas*.", "Registre boas *memórias*.", "Aproveite a *jornada*."],
      noteText: "Mais experiências. Menos rotina automática.",
      noteTop: 1075,
      decor: [
        { ill: "passport", x: 740, y: 498, w: 130, r: -4 },
        { ill: "plane", x: 885, y: 485, w: 150, r: 4 },
        { ill: "postcards", x: 930, y: 700, w: 115, r: 4 },
        { ill: "suitcase", x: 890, y: 1075, w: 140, r: 4 },
      ],
      photos: [
        { slot: "viagem-praia", scene: "beach", x: 740, y: 680, w: 215, r: -5, cap: "" },
        { slot: "viagem-cidade", scene: "mountain", x: 850, y: 850, w: 175, r: 5, cap: "" },
      ],
    },
    {
      file: "vyno-noir-07-carros", type: "content", n: "6",
      accent: "var(--blue)", accent2: "var(--lilac)", note: "var(--beige)",
      titleLines: ["CARROS &", "MOBILIDADE"], ts: 118,
      sub: "Mais liberdade no dia a dia.",
      items: ["Escolha o que faz *sentido para você*.", "Considere os custos de *manutenção*.", "Cuide bem do seu *veículo*.", "Planeje seus *próximos objetivos*.", "Aproveite o *caminho*."],
      noteText: "Não é apenas sobre o carro. É sobre a liberdade que ele proporciona.",
      noteTop: 1030, noteW: 700, noteSize: 50,
      decor: [
        { ill: "key", x: 735, y: 830, w: 110, r: -12 },
        { ill: "pin", x: 905, y: 830, w: 120, r: 6 },
      ],
      photos: [{ slot: "estrada", scene: "road", x: 840, y: 940, w: 175, r: 5, cap: "" }],
      circles: [{ x: 730, y: 500, d: 300, zoom: 3.1, cx: .23, cy: .69 }],
    },
    {
      file: "vyno-noir-08-familia", type: "content", n: "7",
      accent: "var(--pink)", accent2: "var(--yellow)", note: "var(--yellow)",
      titleLines: ["VIDA PESSOAL &", "FAMÍLIA"], ts: 104,
      sub: "O que realmente importa.",
      items: ["Passe tempo com *quem você ama*.", "Esteja *presente*.", "Crie boas *memórias*.", "Aprenda a *desconectar*.", "Equilibre *trabalho e vida pessoal*."],
      noteText: "Algumas das maiores conquistas não aparecem nas redes sociais.",
      noteTop: 1045, noteW: 640, noteSize: 50,
      decor: [
        { ill: "heart", x: 735, y: 810, w: 95, r: -10 },
        { ill: "sun", x: 930, y: 1115, w: 100, r: 0 },
      ],
      photos: [
        { slot: "familia-1", scene: "family", x: 765, y: 498, w: 240, r: 5, cap: "" },
        { slot: "familia-2", scene: "beach", x: 850, y: 800, w: 175, r: -6, cap: "" },
      ],
    },
    {
      file: "vyno-noir-09-liberdade", type: "final", n: "8",
      accent: "var(--yellow)", accent2: "var(--mint)", note: "var(--yellow)",
      titleLines: ["LIBERDADE"], ts: 140,
      sub: "O resultado de pequenas escolhas.",
      items: ["Tenha *tempo* para o que importa.", "Construa sua própria *rotina*.", "Faça escolhas *conscientes*.", "Viva *experiências reais*.", "Continue *evoluindo*."],
      noteText: "Disciplina hoje. Mais liberdade amanhã.",
    },
  ],
};
module.exports.PHOTO = PHOTO;
