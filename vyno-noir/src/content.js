// =====================================================================
// VYNO NOIR v2 — conteúdo do carrossel "LIFESTYLE ROADMAP".
// Marque *palavras* para receber marca-texto e {{palavras}} para circular à mão.
// status "v2" = redesenhado; "pendente" = aguardando aprovação da nova identidade.
// Fotos: salve em assets/photos/<slot>.jpg (ver photo-prompts.md). Sem arquivo = espaço reservado.
// =====================================================================
module.exports = {
  total: 9,
  tag: "LIFESTYLE ROADMAP",
  slides: [
    {
      file: "vyno-noir-01-capa", type: "cover", status: "v2",
      titleLines: [{ t: "LIFESTYLE", c: "var(--champagne)" }, { t: "ROADMAP", c: "var(--fog)" }],
      sub: "Passo a passo para construir a vida que você quer.",
      items: ["Rotina", "Carreira", "Saúde", "Dinheiro", "Viagens", "Lifestyle", "Vida pessoal", "Liberdade"],
      photo: { slot: "capa", label: "FOTO 01 · CAPA", desc: "Homem de boné preto, de costas, observando uma cidade moderna ao entardecer", dim: "1080 × 700 px" },
    },
    {
      file: "vyno-noir-02-rotina", type: "split", status: "v2", n: "1",
      titleLines: ["ROTINA"],
      sub: "A base de tudo.",
      items: ["Organize seus *horários*.", "Defina {{três prioridades}} por dia.", "Reduza as *distrações*.", "Crie hábitos que consiga *manter*.", "Reserve tempo para *descansar*."],
      noteText: "<em>Consistência</em> antes de intensidade.",
      photo: { slot: "rotina", label: "FOTO 02 · ROTINA", desc: "Mesa com café, relógio, smartphone e agenda; luz natural de janela", dim: "400 × 560 px" },
    },
    {"file":"vyno-noir-03-carreira","n":"2","status":"pendente","titleLines":["TRABALHO &","CARREIRA"],"sub":"Construa suas oportunidades.","items":["Desenvolva novas *habilidades*.","Invista em *conhecimento*.","Aprenda com seus *erros*.","Crie *conexões* profissionais.","Pense no *longo prazo*."],"noteText":"Seu próximo nível exige novas habilidades."},
    {"file":"vyno-noir-04-saude","n":"3","status":"pendente","titleLines":["ACADEMIA &","SAÚDE"],"sub":"Energia para viver mais.","items":["Treine com *regularidade*.","Tenha uma alimentação *equilibrada*.","Priorize o *sono*.","Cuide da *saúde mental*.","Acompanhe sua *evolução*."],"noteText":"Cuide do corpo que acompanha seus sonhos."},
    {"file":"vyno-noir-05-dinheiro","n":"4","status":"pendente","titleLines":["DINHEIRO"],"sub":"Uma ferramenta para ter escolhas.","items":["Conheça seus *gastos*.","Evite *dívidas* desnecessárias.","Construa uma *reserva* financeira.","Aprenda sobre *investimentos*.","Busque desenvolver sua *renda*."],"noteText":"Liberdade financeira começa com organização."},
    {"file":"vyno-noir-06-viagens","n":"5","status":"pendente","titleLines":["VIAGENS &","EXPERIÊNCIAS"],"sub":"Colecione momentos.","items":["Conheça novos *lugares*.","Explore diferentes *culturas*.","Experimente *coisas novas*.","Registre boas *memórias*.","Aproveite a *jornada*."],"noteText":"Mais experiências. Menos rotina automática."},
    {"file":"vyno-noir-07-carros","n":"6","status":"pendente","titleLines":["CARROS &","MOBILIDADE"],"sub":"Mais liberdade no dia a dia.","items":["Escolha o que faz *sentido para você*.","Considere os custos de *manutenção*.","Cuide bem do seu *veículo*.","Planeje seus *próximos objetivos*.","Aproveite o *caminho*."],"noteText":"Não é apenas sobre o carro. É sobre a liberdade que ele proporciona."},
    {"file":"vyno-noir-08-familia","n":"7","status":"pendente","titleLines":["VIDA PESSOAL &","FAMÍLIA"],"sub":"O que realmente importa.","items":["Passe tempo com *quem você ama*.","Esteja *presente*.","Crie boas *memórias*.","Aprenda a *desconectar*.","Equilibre *trabalho e vida pessoal*."],"noteText":"Algumas das maiores conquistas não aparecem nas redes sociais."},
    {"file":"vyno-noir-09-liberdade","n":"8","status":"pendente","titleLines":["LIBERDADE"],"sub":"O resultado de pequenas escolhas.","items":["Tenha *tempo* para o que importa.","Construa sua própria *rotina*.","Faça escolhas *conscientes*.","Viva *experiências reais*.","Continue *evoluindo*."],"noteText":"Disciplina hoje. Mais liberdade amanhã."},
  ],
};
