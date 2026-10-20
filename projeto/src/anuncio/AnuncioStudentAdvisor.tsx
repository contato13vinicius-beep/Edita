import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ---- Constantes editáveis (trocar aqui, sem mexer no resto) ----
export const FPS = 30;
export const DURACAO_SEGUNDOS = 22;
export const DURACAO_QUADROS = DURACAO_SEGUNDOS * FPS;

// Cenas (segundos do vídeo)
export const CENAS = {
  gancho: { inicio: 0, fim: 4 },
  beneficios: { inicio: 4, fim: 10 },
  pagamento: { inicio: 10, fim: 16 },
  studentAdvisor: { inicio: 16, fim: 22 },
};

// Paleta
export const COR_AZUL_MARINHO = "#0b1f3a";
export const COR_AZUL_CLARO = "#1d4f7c";
export const COR_BRANCO = "#ffffff";
export const COR_AMARELO = "#ffc233";

// Tipografia
export const FONTE_TITULO = '"Arial Black", "Helvetica Neue", Arial, sans-serif';
export const FONTE_TEXTO = "Arial, Helvetica, sans-serif";

// Legenda (narração sincronizada), abaixo da área de informações
export const LEGENDA_Y = 1260;
export const LEGENDA_TAMANHO = 54;

// Nota obrigatória de elegibilidade (tela final)
export const NOTA_ELEGIBILIDADE = "Sujeito aos critérios de elegibilidade do Student Finance England.";

// Imagens (substituir em public/anuncio/, ver LEIA-ME.txt)
export const IMG_GANCHO = "anuncio/cena1-campus.png";
export const IMG_BENEFICIOS = "anuncio/cena2-biblioteca.png";
export const IMG_PAGAMENTO = "anuncio/cena3-graduacao.png";
export const IMG_FINAL = "anuncio/cena4-sorriso.png";

// Áudio
export const ARQUIVO_NARRACAO = "anuncio/narracao.mp3";
export const ARQUIVO_MUSICA = "estudar/musica.mp3";
export const VOLUME_MUSICA = 0.08;
export const SOM_TRANSICAO = "sfx/whoosh.wav";
export const SOM_CARTAO = "sfx/clique.wav";
export const SOM_CONCLUSAO = "sfx/ding.wav";

// Textos
export const TEXTO_GANCHO_1 = "ESTUDE";
export const TEXTO_GANCHO_2 = "NO REINO UNIDO!";
export const TEXTO_BENEFICIO_1 = "FINANCIAMENTO DA FACULDADE";
export const TEXTO_BENEFICIO_2 = "APOIO PARA CUSTOS DE VIDA";
export const TEXTO_PAGAMENTO_1 = "PAGAMENTO BASEADO";
export const TEXTO_PAGAMENTO_2 = "NA SUA RENDA";
export const TEXTO_FINAL_MARCA = "STUDENT ADVISOR";
export const TEXTO_FINAL_ELEGIVEL = "DESCUBRA SE VOCÊ É ELEGÍVEL";
export const TEXTO_FINAL_CONTATO = "ENTRE EM CONTATO!";

export const LEGENDA_GANCHO = "Você sabia que pode estudar numa universidade no Reino Unido com financiamento do governo?";
export const LEGENDA_BENEFICIOS =
  "O governo pode financiar sua faculdade e ainda oferecer um empréstimo para ajudar com suas despesas enquanto você estuda!";
export const LEGENDA_PAGAMENTO =
  "E o melhor: você só começa a pagar depois de sair da faculdade e quando sua renda ultrapassar o limite estabelecido!";
export const LEGENDA_FINAL = "Quer saber se você tem direito? Fale com o Student Advisor e descubra como começar!";

const seg = (s: number) => Math.round(s * FPS);

// Contorno sutil para texto sobre foto
const SOMBRA = "0 6px 24px rgba(0,0,0,0.55)";

// ---- Componentes compartilhados ----

// Foto de fundo com zoom lento e contínuo (sem tremor) e véu azul-marinho
const FotoFundo: React.FC<{ arquivo: string; duracao: number; velo: number }> = ({ arquivo, duracao, velo }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, seg(duracao)], [1, velo], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Img
        src={staticFile(arquivo)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(11,31,58,0.45) 0%, rgba(11,31,58,0.7) 55%, rgba(11,31,58,0.92) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Entrada suave: fade e leve subida, com mola curta
const Entrada: React.FC<{ inicio: number; children: React.ReactNode; estilo?: React.CSSProperties }> = ({
  inicio,
  children,
  estilo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mola = spring({ frame: frame - seg(inicio), fps, config: { damping: 18, stiffness: 140 } });
  const opacidade = interpolate(frame - seg(inicio), [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const deslocamento = interpolate(mola, [0, 1], [36, 0]);
  return <div style={{ opacity: opacidade, transform: `translateY(${deslocamento}px)`, ...estilo }}>{children}</div>;
};

// Legenda sincronizada na parte de baixo, sem cobrir o título
const Legenda: React.FC<{ texto: string; inicio: number; fim: number }> = ({ texto, inicio, fim }) => {
  const frame = useCurrentFrame();
  const visivel = frame >= seg(inicio) && frame < seg(fim);
  if (!visivel) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        top: LEGENDA_Y,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: FONTE_TEXTO,
        fontWeight: 700,
        fontSize: LEGENDA_TAMANHO,
        lineHeight: 1.3,
        color: COR_BRANCO,
      }}
    >
      <span
        style={{
          background: "rgba(11,31,58,0.7)",
          padding: "8px 18px",
          borderRadius: 14,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {texto}
      </span>
    </div>
  );
};

// Fade de entrada e saída de cada cena (transição sem exagero)
const Cena: React.FC<{ duracao: number; children: React.ReactNode }> = ({ duracao, children }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const saida = interpolate(frame, [seg(duracao) - 8, seg(duracao)], [1, 0], { extrapolateLeft: "clamp" });
  return <AbsoluteFill style={{ opacity: Math.min(entrada, saida) }}>{children}</AbsoluteFill>;
};

// ---- Cena 1: gancho (0 a 4 s) ----

export const CenaGancho: React.FC = () => {
  const duracao = CENAS.gancho.fim - CENAS.gancho.inicio;
  return (
    <Cena duracao={duracao}>
      <FotoFundo arquivo={IMG_GANCHO} duracao={duracao} velo={1.08} />
      <div style={{ position: "absolute", top: 560, left: 70, right: 70, textAlign: "center" }}>
        <Entrada
          inicio={0.3}
          estilo={{ fontFamily: FONTE_TITULO, fontWeight: 900, fontSize: 124, color: COR_BRANCO, textShadow: SOMBRA }}
        >
          {TEXTO_GANCHO_1}
        </Entrada>
        <Entrada
          inicio={0.6}
          estilo={{ fontFamily: FONTE_TITULO, fontWeight: 900, fontSize: 104, color: COR_AMARELO, textShadow: SOMBRA }}
        >
          {TEXTO_GANCHO_2}
        </Entrada>
      </div>
      <Legenda texto={LEGENDA_GANCHO} inicio={0.1} fim={duracao} />
    </Cena>
  );
};

// ---- Cena 2: benefícios (4 a 10 s) ----

const IconeCapelo: React.FC = () => (
  <svg width="96" height="96" viewBox="0 0 96 96">
    <polygon points="48,16 92,36 48,56 4,36" fill={COR_AMARELO} />
    <path d="M22 48 V66 Q48 80 74 66 V48 L48 60 Z" fill={COR_AMARELO} opacity={0.85} />
    <line x1="84" y1="40" x2="84" y2="64" stroke={COR_AMARELO} strokeWidth={4} />
  </svg>
);

const IconeCasa: React.FC = () => (
  <svg width="96" height="96" viewBox="0 0 96 96">
    <polygon points="48,14 88,46 8,46" fill={COR_AMARELO} />
    <rect x="18" y="46" width="60" height="36" fill={COR_AMARELO} opacity={0.85} />
    <rect x="40" y="58" width="16" height="24" fill={COR_AZUL_MARINHO} />
  </svg>
);

const CartaoBeneficio: React.FC<{ topo: number; inicio: number; icone: React.ReactNode; texto: string }> = ({
  topo,
  inicio,
  icone,
  texto,
}) => (
  <Entrada
    inicio={inicio}
    estilo={{ position: "absolute", top: topo, left: 70, right: 70 }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 36,
        background: "rgba(11,31,58,0.88)",
        border: `4px solid ${COR_AMARELO}`,
        borderRadius: 28,
        padding: "34px 40px",
      }}
    >
      <div style={{ flexShrink: 0 }}>{icone}</div>
      <div
        style={{
          fontFamily: FONTE_TITULO,
          fontWeight: 900,
          fontSize: 50,
          lineHeight: 1.12,
          color: COR_BRANCO,
        }}
      >
        {texto}
      </div>
    </div>
  </Entrada>
);

export const CenaBeneficios: React.FC = () => {
  const duracao = CENAS.beneficios.fim - CENAS.beneficios.inicio;
  return (
    <Cena duracao={duracao}>
      <FotoFundo arquivo={IMG_BENEFICIOS} duracao={duracao} velo={1.08} />
      <CartaoBeneficio topo={620} inicio={0.3} icone={<IconeCapelo />} texto={TEXTO_BENEFICIO_1} />
      <CartaoBeneficio topo={960} inicio={1.4} icone={<IconeCasa />} texto={TEXTO_BENEFICIO_2} />
      <Legenda texto={LEGENDA_BENEFICIOS} inicio={0.1} fim={duracao} />
    </Cena>
  );
};

// ---- Cena 3: pagamento condicionado à renda (10 a 16 s) ----

// Gráfico simples: a renda sobe, cruza o limite e então começa o pagamento.
const GraficoRenda: React.FC = () => {
  const frame = useCurrentFrame();
  const progresso = interpolate(frame, [seg(0.6), seg(3.8)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x0 = 120;
  const x1 = 960;
  const y0 = 1120;
  const y1 = 740;
  const x = x0 + (x1 - x0) * progresso;
  const y = y0 + (y1 - y0) * progresso;
  const limiteY = 920;
  const cruzou = progresso >= 0.5;
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={COR_BRANCO} strokeOpacity={0.4} strokeWidth={3} />
      <line
        x1={x0}
        y1={limiteY}
        x2={x1}
        y2={limiteY}
        stroke={COR_AMARELO}
        strokeWidth={4}
        strokeDasharray="14 10"
      />
      <text x={x0} y={limiteY - 18} fill={COR_AMARELO} fontFamily={FONTE_TEXTO} fontWeight={700} fontSize={38}>
        LIMITE DE RENDA
      </text>
      <line x1={x0} y1={y0} x2={x} y2={y} stroke={COR_BRANCO} strokeWidth={8} strokeLinecap="round" />
      <circle cx={x} cy={y} r={16} fill={cruzou ? COR_AMARELO : COR_BRANCO} />
      {cruzou ? (
        <text x={x - 260} y={y - 40} fill={COR_AMARELO} fontFamily={FONTE_TITULO} fontWeight={900} fontSize={42}>
          PAGAMENTO COMEÇA
        </text>
      ) : null}
    </svg>
  );
};

export const CenaPagamento: React.FC = () => {
  const duracao = CENAS.pagamento.fim - CENAS.pagamento.inicio;
  return (
    <Cena duracao={duracao}>
      <FotoFundo arquivo={IMG_PAGAMENTO} duracao={duracao} velo={1.08} />
      <div style={{ position: "absolute", top: 360, left: 70, right: 70, textAlign: "center" }}>
        <Entrada
          inicio={0.2}
          estilo={{ fontFamily: FONTE_TITULO, fontWeight: 900, fontSize: 92, color: COR_BRANCO, lineHeight: 1.05, textShadow: SOMBRA }}
        >
          {TEXTO_PAGAMENTO_1}
        </Entrada>
        <Entrada
          inicio={0.5}
          estilo={{ fontFamily: FONTE_TITULO, fontWeight: 900, fontSize: 92, color: COR_AMARELO, lineHeight: 1.05, textShadow: SOMBRA }}
        >
          {TEXTO_PAGAMENTO_2}
        </Entrada>
      </div>
      <GraficoRenda />
      <Legenda texto={LEGENDA_PAGAMENTO} inicio={0.1} fim={duracao} />
    </Cena>
  );
};

// ---- Cena 4: Student Advisor (16 a 22 s) ----

export const CenaFinal: React.FC = () => {
  const duracao = CENAS.studentAdvisor.fim - CENAS.studentAdvisor.inicio;
  return (
    <Cena duracao={duracao}>
      <FotoFundo arquivo={IMG_FINAL} duracao={duracao} velo={1.06} />
      <div style={{ position: "absolute", top: 420, left: 70, right: 70, textAlign: "center" }}>
        <Entrada
          inicio={0.2}
          estilo={{ fontFamily: FONTE_TITULO, fontWeight: 900, fontSize: 96, color: COR_AMARELO, textShadow: SOMBRA }}
        >
          {TEXTO_FINAL_MARCA}
        </Entrada>
        <Entrada
          inicio={0.6}
          estilo={{ marginTop: 40, fontFamily: FONTE_TITULO, fontWeight: 900, fontSize: 60, color: COR_BRANCO, lineHeight: 1.15, textShadow: SOMBRA }}
        >
          {TEXTO_FINAL_ELEGIVEL}
        </Entrada>
      </div>
      <Entrada
        inicio={1.6}
        estilo={{ position: "absolute", top: 920, left: 180, right: 180, textAlign: "center" }}
      >
        <div
          style={{
            background: COR_AMARELO,
            color: COR_AZUL_MARINHO,
            borderRadius: 999,
            padding: "30px 40px",
            fontFamily: FONTE_TITULO,
            fontWeight: 900,
            fontSize: 52,
          }}
        >
          {TEXTO_FINAL_CONTATO}
        </div>
      </Entrada>
      <Legenda texto={LEGENDA_FINAL} inicio={0.1} fim={duracao - 0.2} />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 60,
          textAlign: "center",
          fontFamily: FONTE_TEXTO,
          fontSize: 28,
          color: COR_BRANCO,
          opacity: 0.85,
        }}
      >
        {NOTA_ELEGIBILIDADE}
      </div>
    </Cena>
  );
};

// ---- Composição principal ----

export const AnuncioStudentAdvisor: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COR_AZUL_MARINHO }}>
      <Sequence from={seg(CENAS.gancho.inicio)} durationInFrames={seg(CENAS.gancho.fim - CENAS.gancho.inicio)} name="Cena 1 - Gancho">
        <CenaGancho />
      </Sequence>
      <Sequence from={seg(CENAS.beneficios.inicio)} durationInFrames={seg(CENAS.beneficios.fim - CENAS.beneficios.inicio)} name="Cena 2 - Beneficios">
        <CenaBeneficios />
      </Sequence>
      <Sequence from={seg(CENAS.pagamento.inicio)} durationInFrames={seg(CENAS.pagamento.fim - CENAS.pagamento.inicio)} name="Cena 3 - Pagamento">
        <CenaPagamento />
      </Sequence>
      <Sequence from={seg(CENAS.studentAdvisor.inicio)} durationInFrames={seg(CENAS.studentAdvisor.fim - CENAS.studentAdvisor.inicio)} name="Cena 4 - Student Advisor">
        <CenaFinal />
      </Sequence>

      {/* Sons: um por evento */}
      <Sequence from={seg(CENAS.beneficios.inicio)} durationInFrames={seg(1)}>
        <Audio src={staticFile(SOM_TRANSICAO)} volume={0.5} />
      </Sequence>
      <Sequence from={seg(CENAS.pagamento.inicio)} durationInFrames={seg(1)}>
        <Audio src={staticFile(SOM_TRANSICAO)} volume={0.5} />
      </Sequence>
      <Sequence from={seg(CENAS.studentAdvisor.inicio)} durationInFrames={seg(1)}>
        <Audio src={staticFile(SOM_TRANSICAO)} volume={0.5} />
      </Sequence>
      <Sequence from={seg(CENAS.beneficios.inicio + 0.3)} durationInFrames={seg(1)}>
        <Audio src={staticFile(SOM_CARTAO)} />
      </Sequence>
      <Sequence from={seg(CENAS.studentAdvisor.inicio + 2.5)} durationInFrames={seg(1.5)}>
        <Audio src={staticFile(SOM_CONCLUSAO)} volume={0.6} />
      </Sequence>

      <Audio src={staticFile(ARQUIVO_NARRACAO)} />
      <Audio src={staticFile(ARQUIVO_MUSICA)} volume={VOLUME_MUSICA} loop />
    </AbsoluteFill>
  );
};
