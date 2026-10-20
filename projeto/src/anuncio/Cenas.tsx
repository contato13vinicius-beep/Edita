import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Arvore, Cores, Estudante, Nuvem, PredioCampus } from "./Ilustracoes";
import {
  AlunoSentado,
  CapeloVoando,
  Confete,
  Estante,
  Formando,
  PisoInterno,
  Professor,
  Quadro,
} from "./Ilustracoes2";
import {
  COR_AZUL_CLARO,
  COR_AZUL_PROFUNDO,
  COR_AZUL_SUAVE,
  COR_BRANCO,
  COR_CONTORNO,
  COR_FUNDO_BASE,
  COR_FUNDO_TOPO,
  COR_LAVANDA,
  COR_MENTA,
  COR_MENTA_CLARA,
  COR_TEXTO,
  FONTE,
  NOTA_ELEGIBILIDADE,
  TEXTO_BENEFICIO_1,
  TEXTO_BENEFICIO_2,
  TEXTO_CONTATO,
  TEXTO_ELEGIVEL,
  TEXTO_MARCA,
  TEXTO_PAGAMENTO_1,
  TEXTO_PAGAMENTO_2,
  TEXTO_TITULO_1,
  TEXTO_TITULO_2,
  seg,
} from "./tema";

// Personagens
const ESTUDANTE_A: Cores = {
  pele: "#f2c4a0",
  cabelo: "#2b2140",
  camisa: "#6e8cf5",
  calca: "#1b2a6b",
  mochila: "#6fe3c1",
};
const ESTUDANTE_B: Cores = {
  pele: "#8d5a3b",
  cabelo: "#14183a",
  camisa: "#c7b9ff",
  calca: "#2c3e7a",
  mochila: "#1b2a6b",
};
const ESTUDANTE_C: Cores = {
  pele: "#e8b890",
  cabelo: "#c97b3a",
  camisa: "#6fe3c1",
  calca: "#14183a",
  mochila: "#6e8cf5",
};
const ESTUDANTE_D: Cores = {
  pele: "#f6d3b8",
  cabelo: "#6b3f2a",
  camisa: "#ffffff",
  calca: "#6e8cf5",
  mochila: "#c7b9ff",
};
const PROFESSOR: Cores = {
  pele: "#d9a47e",
  cabelo: "#9aa3c7",
  camisa: "#1b2a6b",
  calca: "#2c3e7a",
  mochila: "#1b2a6b",
};

// ---- Peças reutilizáveis ----

// Câmera com zoom suave e deslocamento lento; o conteúdo recebe a transformação
const Camera: React.FC<{
  duracao: number;
  zoom?: number;
  pan?: number;
  children: React.ReactNode;
}> = ({ duracao, zoom = 1.06, pan = 12, children }) => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [0, seg(duracao)], [1, zoom], {
    extrapolateRight: "clamp",
  });
  const p = interpolate(frame, [0, seg(duracao)], [pan, -pan], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${z}) translateX(${p}px)`,
        transformOrigin: "50% 58%",
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Entrada suave: fade, subida e leve escala com mola curta
const Entrada: React.FC<{
  inicio: number;
  children: React.ReactNode;
  estilo?: React.CSSProperties;
}> = ({ inicio, children, estilo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mola = spring({
    frame: frame - seg(inicio),
    fps,
    config: { damping: 15, stiffness: 150 },
  });
  const opacidade = interpolate(frame - seg(inicio), [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: opacidade,
        transform: `translateY(${interpolate(mola, [0, 1], [40, 0])}px) scale(${interpolate(mola, [0, 1], [0.92, 1])})`,
        ...estilo,
      }}
    >
      {children}
    </div>
  );
};

export const FundoClaro: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const deriva = interpolate(frame, [0, seg(duracao)], [0, 50], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COR_FUNDO_TOPO} 0%, ${COR_FUNDO_BASE} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: 360,
          left: -190 + deriva,
          top: 100,
          background: `radial-gradient(circle, ${COR_LAVANDA} 0%, rgba(199,185,255,0) 70%)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          borderRadius: 310,
          right: -170 - deriva,
          top: 880,
          background: `radial-gradient(circle, ${COR_AZUL_SUAVE} 0%, rgba(110,140,245,0) 70%)`,
          opacity: 0.25,
        }}
      />
    </AbsoluteFill>
  );
};

// Título em duas linhas com revelação por máscara
const TituloMascara: React.FC<{
  linha1: string;
  linha2: string;
  tamanho1: number;
  tamanho2: number;
  corLinha2?: string;
  topo?: number;
}> = ({
  linha1,
  linha2,
  tamanho1,
  tamanho2,
  corLinha2 = COR_AZUL_PROFUNDO,
  topo = 180,
}) => {
  const frame = useCurrentFrame();
  const revelar = (inicio: number) =>
    interpolate(frame, [inicio, inicio + 14], [110, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
  const sublinhado = interpolate(frame, [seg(0.5), seg(1.1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{ position: "absolute", top: topo, left: 70, right: 70 }}>
      <div style={{ overflow: "hidden", height: tamanho1 * 1.13 }}>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: tamanho1,
            lineHeight: 1,
            color: COR_AZUL_PROFUNDO,
            transform: `translateY(${revelar(seg(0.1))}%)`,
          }}
        >
          {linha1}
        </div>
      </div>
      <div style={{ overflow: "hidden", height: tamanho2 * 1.15 }}>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: tamanho2,
            lineHeight: 1,
            color: corLinha2,
            transform: `translateY(${revelar(seg(0.3))}%)`,
          }}
        >
          {linha2}
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          height: 10,
          borderRadius: 5,
          width: "100%",
          background: COR_MENTA,
          transform: `scaleX(${sublinhado})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

// Chip arredondado com ícone para destacar um benefício
const ChipBeneficio: React.FC<{
  texto: string;
  palavrasLinha1: number;
  inicio: number;
  topo: number;
  icone: React.ReactNode;
  cor: string;
}> = ({ texto, palavrasLinha1, inicio, topo, icone, cor }) => {
  const palavras = texto.split(" ");
  const linha1 = palavras.slice(0, palavrasLinha1).join(" ");
  const linha2 = palavras.slice(palavrasLinha1).join(" ");
  return (
    <Entrada
      inicio={inicio}
      estilo={{ position: "absolute", top: topo, left: 70, right: 70 }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          background: COR_BRANCO,
          borderRadius: 56,
          padding: "30px 40px",
          boxShadow: "0 24px 50px rgba(27,42,107,0.18)",
        }}
      >
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 56,
            background: cor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icone}
        </div>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 56,
            lineHeight: 1.08,
            color: COR_AZUL_PROFUNDO,
          }}
        >
          <div>{linha1}</div>
          <div>{linha2}</div>
        </div>
      </div>
    </Entrada>
  );
};

const IconeCapelo: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 96 96">
    <polygon points="48,14 92,34 48,54 4,34" fill={COR_AZUL_PROFUNDO} />
    <path
      d="M22 46 V66 Q48 80 74 66 V46 L48 58 Z"
      fill={COR_AZUL_PROFUNDO}
      opacity={0.85}
    />
  </svg>
);

const IconeCasa: React.FC = () => (
  <svg width="68" height="68" viewBox="0 0 96 96">
    <polygon points="48,12 90,46 6,46" fill={COR_AZUL_PROFUNDO} />
    <rect
      x="18"
      y="46"
      width="60"
      height="38"
      fill={COR_AZUL_PROFUNDO}
      opacity={0.85}
    />
    <rect x="40" y="58" width="16" height="26" fill={COR_BRANCO} />
  </svg>
);

// ---- Cena: campus (chegada e caminhada) ----

export const CenaCampus: React.FC<{
  duracao: number;
  comTitulo: boolean;
  variante: "chegada" | "caminhada";
}> = ({ duracao, comTitulo, variante }) => {
  const frame = useCurrentFrame();
  const total = seg(duracao);
  const paralaxeFundo = interpolate(frame, [0, total], [0, -14], {
    extrapolateRight: "clamp",
  });
  const paralaxeMeio = interpolate(frame, [0, total], [0, -28], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FundoClaro duracao={duracao} />
      <Camera duracao={duracao}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <g transform={`translate(${paralaxeFundo} 0)`}>
            <Nuvem x={0} y={600} escala={0.9} cor="#ffffff" />
          </g>
          <g transform={`translate(${paralaxeMeio * 0.6} 0)`}>
            <Arvore
              x={70}
              y={980}
              escala={1.1}
              cor="#bdebd6"
              tronco="#8a6e5a"
            />
            <Arvore
              x={1010}
              y={960}
              escala={1.25}
              cor="#9bddc0"
              tronco="#8a6e5a"
            />
          </g>
          <g transform={`translate(${paralaxeMeio * 0.35} 0)`}>
            <PredioCampus
              corPredio="#e4e9fb"
              corSombra={COR_AZUL_SUAVE}
              corTeto={COR_AZUL_PROFUNDO}
            />
          </g>
          <rect
            x={0}
            y={1224}
            width={1080}
            height={696}
            fill={COR_MENTA_CLARA}
          />
          <polygon
            points="500,1224 580,1224 770,1920 310,1920"
            fill="#f4f6ff"
            opacity={0.92}
          />
          {variante === "chegada" ? (
            <>
              <Estudante
                de={-40}
                para={330}
                baseY={1500}
                inicio={0}
                duracao={seg(4)}
                cores={ESTUDANTE_A}
              />
              <Estudante
                de={1120}
                para={740}
                baseY={1500}
                inicio={seg(0.6)}
                duracao={seg(4)}
                cores={ESTUDANTE_B}
                escala={0.96}
              />
              <Estudante
                de={-60}
                para={200}
                baseY={1430}
                inicio={seg(1.2)}
                duracao={seg(4)}
                cores={ESTUDANTE_C}
                escala={0.84}
              />
            </>
          ) : (
            <>
              <Estudante
                de={1000}
                para={780}
                baseY={1440}
                inicio={0}
                duracao={seg(3)}
                cores={ESTUDANTE_D}
                escala={0.86}
              />
              <Estudante
                de={140}
                para={470}
                baseY={1530}
                inicio={0}
                duracao={seg(2.6)}
                cores={ESTUDANTE_A}
                escala={1.12}
              />
              <Estudante
                de={1180}
                para={900}
                baseY={1560}
                inicio={seg(0.3)}
                duracao={seg(3)}
                cores={ESTUDANTE_C}
                escala={1.0}
              />
            </>
          )}
        </svg>
      </Camera>
      {comTitulo ? (
        <TituloMascara
          linha1={TEXTO_TITULO_1}
          linha2={TEXTO_TITULO_2}
          tamanho1={150}
          tamanho2={96}
        />
      ) : null}
    </AbsoluteFill>
  );
};

// ---- Cena: sala de aula com professor ----

export const CenaSala: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const total = seg(duracao);
  const paralaxe = interpolate(frame, [0, total], [0, -22], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Camera duracao={duracao} zoom={1.07}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient id="paredeSala" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#eef1ff" />
              <stop offset="1" stopColor="#dfe6ff" />
            </linearGradient>
          </defs>
          <rect
            x={0}
            y={0}
            width={1080}
            height={1920}
            fill="url(#paredeSala)"
          />
          <g transform={`translate(${paralaxe * 0.4} 0)`}>
            <rect
              x={730}
              y={380}
              width={270}
              height={300}
              rx={30}
              fill="#cfe0ff"
              stroke={COR_CONTORNO}
              strokeWidth={3}
            />
            <line
              x1={865}
              y1={380}
              x2={865}
              y2={680}
              stroke={COR_CONTORNO}
              strokeWidth={3}
            />
            <line
              x1={730}
              y1={530}
              x2={1000}
              y2={530}
              stroke={COR_CONTORNO}
              strokeWidth={3}
            />
            <circle cx={800} cy={470} r={34} fill={COR_MENTA} />
            <Quadro x={90} y={520} largura={560} altura={340} />
          </g>
          <PisoInterno topo={1130} cor="#e9edff" />
          <Professor x={830} y={1175} cores={PROFESSOR} escala={0.95} />
          <AlunoSentado
            x={190}
            y={1500}
            cores={ESTUDANTE_A}
            escala={0.95}
            desfase={0}
          />
          <AlunoSentado
            x={540}
            y={1500}
            cores={ESTUDANTE_B}
            escala={0.95}
            desfase={9}
          />
          <AlunoSentado
            x={890}
            y={1500}
            cores={ESTUDANTE_C}
            escala={0.95}
            desfase={17}
          />
        </svg>
      </Camera>
      <ChipBeneficio
        texto={TEXTO_BENEFICIO_1}
        palavrasLinha1={1}
        inicio={0.4}
        topo={170}
        cor={COR_MENTA}
        icone={<IconeCapelo />}
      />
    </AbsoluteFill>
  );
};

// ---- Cena: biblioteca ----

export const CenaBiblioteca: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const total = seg(duracao);
  const paralaxe = interpolate(frame, [0, total], [0, -22], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Camera duracao={duracao} zoom={1.07} pan={-12}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient id="paredeBiblio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e9e4ff" />
              <stop offset="1" stopColor="#dde6ff" />
            </linearGradient>
          </defs>
          <rect
            x={0}
            y={0}
            width={1080}
            height={1920}
            fill="url(#paredeBiblio)"
          />
          <g transform={`translate(${paralaxe * 0.5} 0)`}>
            <Estante x={50} y={450} largura={460} linhas={4} />
            <Estante x={570} y={450} largura={460} linhas={4} />
          </g>
          <PisoInterno topo={1300} cor="#e9edff" />
          <AlunoSentado
            x={300}
            y={1540}
            cores={ESTUDANTE_D}
            escala={0.95}
            desfase={4}
          />
          <AlunoSentado
            x={780}
            y={1540}
            cores={ESTUDANTE_B}
            escala={0.95}
            desfase={13}
          />
        </svg>
      </Camera>
      <ChipBeneficio
        texto={TEXTO_BENEFICIO_2}
        palavrasLinha1={2}
        inicio={0.3}
        topo={170}
        cor={COR_LAVANDA}
        icone={<IconeCasa />}
      />
    </AbsoluteFill>
  );
};

// ---- Cena: celular com notificações de financiamento (ilustrativo) ----

const CartaoNotificacao: React.FC<{
  topo: number;
  inicio: number;
  titulo: string;
  subtitulo: string;
  cor: string;
}> = ({ topo, inicio, titulo, subtitulo, cor }) => (
  <Entrada
    inicio={inicio}
    estilo={{ position: "absolute", top: topo, left: 330, width: 420 }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: COR_BRANCO,
        borderRadius: 30,
        padding: "20px 22px",
        boxShadow: "0 14px 30px rgba(27,42,107,0.16)",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          background: cor,
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 28,
            color: COR_AZUL_PROFUNDO,
            lineHeight: 1.1,
          }}
        >
          {titulo}
        </div>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 22,
            color: COR_AZUL_SUAVE,
            marginTop: 6,
          }}
        >
          {subtitulo}
        </div>
      </div>
    </div>
  </Entrada>
);

export const CenaNotificacao: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const inclina = Math.sin(frame * 0.09) * 1.6;
  const flutua = Math.sin(frame * 0.12) * 10;
  return (
    <AbsoluteFill>
      <FundoClaro duracao={duracao} />
      <Camera duracao={duracao} zoom={1.05}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          {[
            { x: 180, y: 640, d: 0 },
            { x: 900, y: 820, d: 2 },
            { x: 210, y: 1180, d: 4 },
            { x: 880, y: 1260, d: 6 },
          ].map((moeda) => (
            <g
              key={`m-${moeda.x}-${moeda.y}`}
              transform={`translate(${moeda.x} ${moeda.y + Math.sin(frame * 0.1 + moeda.d) * 14})`}
            >
              <circle
                r={44}
                fill={COR_MENTA}
                stroke={COR_CONTORNO}
                strokeWidth={3}
              />
              <text
                textAnchor="middle"
                y={13}
                fontFamily={FONTE}
                fontWeight={800}
                fontSize={38}
                fill={COR_AZUL_PROFUNDO}
              >
                £
              </text>
            </g>
          ))}
          <g transform={`translate(0 ${flutua}) rotate(${inclina} 540 960)`}>
            <rect
              x={280}
              y={470}
              width={520}
              height={940}
              rx={72}
              fill={COR_AZUL_PROFUNDO}
            />
            <rect
              x={298}
              y={488}
              width={484}
              height={904}
              rx={58}
              fill="#f7f8ff"
            />
            <rect
              x={470}
              y={506}
              width={140}
              height={22}
              rx={11}
              fill={COR_AZUL_PROFUNDO}
            />
            {[0, 1, 2].map((i) => (
              <rect
                key={`sk-${i}`}
                x={330}
                y={1010 + i * 70}
                width={i === 2 ? 220 : 420}
                height={30}
                rx={15}
                fill={COR_AZUL_CLARO}
                opacity={0.5 + 0.4 * Math.abs(Math.sin(frame * 0.08 + i))}
              />
            ))}
          </g>
        </svg>
      </Camera>
      <div
        style={{
          position: "absolute",
          top: 560 + flutua,
          left: 330,
          width: 420,
          textAlign: "center",
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: 28,
          color: COR_AZUL_SUAVE,
        }}
      >
        STUDENT FINANCE
      </div>
      <CartaoNotificacao
        topo={640 + flutua}
        inicio={0.2}
        titulo="Financiamento da faculdade"
        subtitulo="Tuition Fee Loan"
        cor={COR_MENTA}
      />
      <CartaoNotificacao
        topo={820 + flutua}
        inicio={0.65}
        titulo="Apoio para custos de vida"
        subtitulo="Maintenance Loan"
        cor={COR_LAVANDA}
      />
      <div
        style={{
          position: "absolute",
          top: 1330 + flutua,
          left: 330,
          width: 420,
          textAlign: "center",
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: 22,
          color: COR_AZUL_SUAVE,
        }}
      >
        ilustrativo
      </div>
    </AbsoluteFill>
  );
};

// ---- Cena: formatura com confete ----

export const CenaFormatura: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const total = seg(duracao);
  const paralaxe = interpolate(frame, [0, total], [0, -24], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <FundoClaro duracao={duracao} />
      <Camera duracao={duracao} zoom={1.07}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <g transform={`translate(${paralaxe * 0.5} 0)`}>
            <Nuvem x={100} y={700} escala={0.9} cor="#ffffff" />
            <Arvore
              x={80}
              y={1130}
              escala={1.2}
              cor="#bdebd6"
              tronco="#8a6e5a"
            />
            <Arvore
              x={1000}
              y={1100}
              escala={1.35}
              cor="#9bddc0"
              tronco="#8a6e5a"
            />
          </g>
          <ellipse
            cx={540}
            cy={1700}
            rx={900}
            ry={330}
            fill={COR_MENTA_CLARA}
          />
          <Formando x={360} y={1560} cores={ESTUDANTE_A} escala={1.05} />
          <Formando x={740} y={1580} cores={ESTUDANTE_B} escala={0.95} />
          <CapeloVoando origemX={400} origemY={1090} inicio={seg(0.6)} />
          <Confete inicio={seg(0.5)} />
        </svg>
      </Camera>
      <Entrada
        inicio={0.4}
        estilo={{ position: "absolute", top: 190, left: 70, right: 70 }}
      >
        <div
          style={{
            display: "inline-block",
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 76,
            lineHeight: 1.1,
            color: COR_AZUL_PROFUNDO,
            background: COR_BRANCO,
            borderRadius: 48,
            padding: "26px 44px",
            boxShadow: "0 24px 50px rgba(27,42,107,0.16)",
          }}
        >
          DEPOIS DA
          <br />
          <span style={{ color: COR_AZUL_SUAVE }}>FORMATURA</span>
        </div>
      </Entrada>
    </AbsoluteFill>
  );
};

// ---- Cena: gráfico do pagamento condicionado à renda ----

const GraficoRenda: React.FC = () => {
  const frame = useCurrentFrame();
  const progresso = interpolate(frame, [seg(0.5), seg(2.3)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const x0 = 170;
  const x1 = 910;
  const y0 = 1130;
  const y1 = 730;
  const limiteY = 900;
  const x = x0 + (x1 - x0) * progresso;
  const y = y0 + (y1 - y0) * progresso;
  const pCruze = (y0 - limiteY) / (y0 - y1);
  const xCruze = x0 + (x1 - x0) * pCruze;
  const cruzou = progresso >= pCruze;
  return (
    <g>
      <line
        x1={x0}
        y1={y0}
        x2={x1}
        y2={y0}
        stroke={COR_AZUL_CLARO}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <line
        x1={x0}
        y1={limiteY}
        x2={x1}
        y2={limiteY}
        stroke={COR_MENTA}
        strokeWidth={6}
        strokeDasharray="18 14"
        strokeLinecap="round"
      />
      <text
        x={x0}
        y={limiteY - 22}
        fontFamily={FONTE}
        fontWeight={800}
        fontSize={34}
        fill={COR_AZUL_PROFUNDO}
      >
        LIMITE DE RENDA
      </text>
      <line
        x1={x0}
        y1={y0}
        x2={x}
        y2={y}
        stroke={COR_AZUL_SUAVE}
        strokeWidth={14}
        strokeLinecap="round"
      />
      {cruzou ? (
        <line
          x1={xCruze}
          y1={limiteY}
          x2={x}
          y2={y}
          stroke={COR_MENTA}
          strokeWidth={14}
          strokeLinecap="round"
        />
      ) : null}
      <circle
        cx={x}
        cy={y}
        r={24}
        fill={cruzou ? COR_MENTA : COR_AZUL_SUAVE}
        stroke={COR_BRANCO}
        strokeWidth={8}
      />
    </g>
  );
};

export const CenaGrafico: React.FC<{ duracao: number }> = ({ duracao }) => {
  // O gráfico cruza o limite de renda por volta de 1,45 s: o chip entra logo depois
  const inicioChip = 1.5;
  return (
    <AbsoluteFill>
      <FundoClaro duracao={duracao} />
      <Camera duracao={duracao} zoom={1.05} pan={8}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <ellipse
            cx={540}
            cy={1800}
            rx={900}
            ry={300}
            fill={COR_MENTA_CLARA}
          />
          <rect
            x={80}
            y={600}
            width={920}
            height={640}
            rx={56}
            fill={COR_BRANCO}
          />
          <GraficoRenda />
          <Formando x={955} y={1600} cores={ESTUDANTE_A} escala={0.62} />
        </svg>
      </Camera>
      <TituloMascara
        linha1={TEXTO_PAGAMENTO_1}
        linha2={TEXTO_PAGAMENTO_2}
        tamanho1={86}
        tamanho2={96}
        corLinha2={COR_AZUL_SUAVE}
        topo={170}
      />
      <Entrada
        inicio={inicioChip}
        estilo={{
          position: "absolute",
          top: 1290,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 52,
            color: COR_AZUL_PROFUNDO,
            background: COR_MENTA,
            borderRadius: 40,
            padding: "20px 40px",
            boxShadow: "0 18px 40px rgba(27,42,107,0.18)",
          }}
        >
          PAGAMENTO COMEÇA
        </div>
      </Entrada>
    </AbsoluteFill>
  );
};

// ---- Cena final: Student Advisor ----

export const CenaFinal: React.FC<{ duracao: number }> = ({ duracao }) => {
  const frame = useCurrentFrame();
  const brilho = interpolate(frame % seg(1.6), [0, seg(1.6)], [-200, 700]);
  return (
    <AbsoluteFill>
      <FundoClaro duracao={duracao} />
      <Camera duracao={duracao} zoom={1.04} pan={6}>
        <svg
          width="1080"
          height="1920"
          viewBox="0 0 1080 1920"
          style={{ position: "absolute", inset: 0 }}
        >
          <ellipse
            cx={540}
            cy={1850}
            rx={900}
            ry={300}
            fill={COR_MENTA_CLARA}
          />
          {[
            { x: 140, y: 300, r: 60, c: COR_LAVANDA, d: 0 },
            { x: 940, y: 400, r: 44, c: COR_MENTA, d: 3 },
            { x: 960, y: 1360, r: 70, c: COR_AZUL_CLARO, d: 5 },
            { x: 120, y: 1320, r: 50, c: COR_LAVANDA, d: 8 },
          ].map((b) => (
            <circle
              key={`b-${b.x}-${b.y}`}
              cx={b.x}
              cy={b.y + Math.sin(frame * 0.08 + b.d) * 16}
              r={b.r}
              fill={b.c}
              opacity={0.8}
            />
          ))}
        </svg>
      </Camera>
      <Entrada
        inicio={0.1}
        estilo={{ position: "absolute", top: 470, left: 70, right: 70 }}
      >
        <div
          style={{
            background: COR_BRANCO,
            borderRadius: 64,
            padding: "56px 56px 60px",
            boxShadow: "0 40px 80px rgba(27,42,107,0.2)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontFamily: FONTE,
              fontWeight: 800,
              fontSize: 56,
              color: COR_BRANCO,
              background: COR_AZUL_PROFUNDO,
              borderRadius: 40,
              padding: "20px 40px",
            }}
          >
            {TEXTO_MARCA}
          </div>
          <div
            style={{
              marginTop: 44,
              fontFamily: FONTE,
              fontWeight: 800,
              fontSize: 78,
              lineHeight: 1.08,
              color: COR_AZUL_PROFUNDO,
            }}
          >
            {TEXTO_ELEGIVEL}
          </div>
        </div>
      </Entrada>
      <Entrada
        inicio={1.7}
        estilo={{ position: "absolute", top: 1120, left: 130, right: 130 }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 64,
            color: COR_AZUL_PROFUNDO,
            background: COR_MENTA,
            borderRadius: 999,
            padding: "36px 40px",
            boxShadow: "0 24px 50px rgba(27,42,107,0.22)",
          }}
        >
          {TEXTO_CONTATO}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: brilho,
              width: 90,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
              transform: "skewX(-18deg)",
            }}
          />
        </div>
      </Entrada>
      <div
        style={{
          position: "absolute",
          top: 1360,
          left: 90,
          right: 90,
          textAlign: "center",
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: 30,
          lineHeight: 1.3,
          color: COR_TEXTO,
          opacity: 0.72,
          textWrap: "balance",
        }}
      >
        {NOTA_ELEGIBILIDADE}
      </div>
    </AbsoluteFill>
  );
};
