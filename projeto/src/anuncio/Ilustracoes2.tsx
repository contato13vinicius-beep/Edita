import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COR_AZUL_CLARO, COR_AZUL_PROFUNDO, COR_AZUL_SUAVE, COR_BRANCO, COR_CONTORNO, COR_LAVANDA, COR_MENTA } from "./tema";
import type { Cores } from "./Ilustracoes";

// Ilustrações extras em SVG: sala de aula, biblioteca, formatura e confete.

const TRACO = { stroke: COR_CONTORNO, strokeWidth: 3 };

const Rosto: React.FC<{ y: number; r: number }> = ({ y, r }) => (
  <>
    <circle cx={-r * 0.35} cy={y + 6} r={5} fill={COR_CONTORNO} />
    <circle cx={r * 0.35} cy={y + 6} r={5} fill={COR_CONTORNO} />
    <path d={`M${-r * 0.3} ${y + 28} Q0 ${y + 40} ${r * 0.3} ${y + 28}`} fill="none" stroke={COR_CONTORNO} strokeWidth={3} strokeLinecap="round" />
  </>
);

// Aluno sentado atrás de uma mesa com notebook. O ponto (x, y) é o quadril.
export const AlunoSentado: React.FC<{ x: number; y: number; cores: Cores; escala?: number; desfase?: number }> = ({
  x,
  y,
  cores,
  escala = 1,
  desfase = 0,
}) => {
  const frame = useCurrentFrame() + desfase;
  const sobe = Math.sin(frame * 0.35) * 2.5;
  const digitar = Math.sin(frame * 0.7) * 7;
  return (
    <g transform={`translate(${x} ${y}) scale(${escala})`}>
      <rect x={-62} y={-150} width={124} height={170} rx={26} fill={COR_AZUL_CLARO} {...TRACO} />
      <g transform={`translate(0 ${sobe})`}>
        <rect x={-46} y={-150} width={92} height={150} rx={38} fill={cores.camisa} {...TRACO} />
        <circle cx={0} cy={-198} r={46} fill={cores.pele} {...TRACO} />
        <path d="M-48 -196 Q-54 -254 0 -256 Q54 -254 48 -196 Q38 -224 0 -222 Q-38 -224 -48 -196 Z" fill={cores.cabelo} />
        <Rosto y={-204} r={46} />
      </g>
      <g transform={`translate(-40 -128) rotate(${12 + digitar})`}>
        <rect x={-13} y={0} width={26} height={112} rx={13} fill={cores.camisa} {...TRACO} />
      </g>
      <g transform={`translate(40 -128) rotate(${-12 - digitar})`}>
        <rect x={-13} y={0} width={26} height={112} rx={13} fill={cores.camisa} {...TRACO} />
      </g>
      <rect x={-150} y={-14} width={300} height={40} rx={16} fill="#e6ebff" {...TRACO} />
      <rect x={-60} y={-30} width={120} height={16} rx={8} fill="#aab6e8" {...TRACO} />
      <rect x={-54} y={-116} width={108} height={86} rx={12} fill={COR_AZUL_PROFUNDO} {...TRACO} />
      <circle cx={0} cy={-73} r={9} fill={COR_MENTA} />
    </g>
  );
};

// Professor em pé apontando para o quadro
export const Professor: React.FC<{ x: number; y: number; cores: Cores; escala?: number }> = ({
  x,
  y,
  cores,
  escala = 1,
}) => {
  const frame = useCurrentFrame();
  const apontar = 112 + Math.sin(frame * 0.12) * 8;
  const sobe = Math.sin(frame * 0.18) * 2;
  return (
    <g transform={`translate(${x} ${y + sobe}) scale(${escala})`}>
      <g transform="translate(-22 -150)">
        <rect x={-15} y={0} width={30} height={150} rx={15} fill={cores.calca} {...TRACO} />
        <rect x={-19} y={138} width={42} height={20} rx={10} fill={COR_CONTORNO} />
      </g>
      <g transform="translate(22 -150)">
        <rect x={-15} y={0} width={30} height={150} rx={15} fill={cores.calca} {...TRACO} />
        <rect x={-19} y={138} width={42} height={20} rx={10} fill={COR_CONTORNO} />
      </g>
      <g transform="translate(40 -272) rotate(8)">
        <rect x={-13} y={0} width={26} height={126} rx={13} fill={cores.camisa} {...TRACO} />
      </g>
      <rect x={-46} y={-292} width={92} height={150} rx={38} fill={cores.camisa} {...TRACO} />
      <g transform={`translate(-40 -272) rotate(${apontar})`}>
        <rect x={-13} y={0} width={26} height={126} rx={13} fill={cores.camisa} {...TRACO} />
        <line x1={0} y1={120} x2={0} y2={250} stroke={COR_AZUL_PROFUNDO} strokeWidth={6} strokeLinecap="round" />
      </g>
      <circle cx={0} cy={-338} r={48} fill={cores.pele} {...TRACO} />
      <path d="M-50 -336 Q-56 -396 0 -398 Q56 -396 50 -336 Q40 -364 0 -362 Q-40 -364 -50 -336 Z" fill={cores.cabelo} />
      <circle cx={-18} cy={-332} r={14} fill="none" stroke={COR_CONTORNO} strokeWidth={3} />
      <circle cx={18} cy={-332} r={14} fill="none" stroke={COR_CONTORNO} strokeWidth={3} />
      <line x1={-4} y1={-332} x2={4} y2={-332} stroke={COR_CONTORNO} strokeWidth={3} />
      <path d="M-14 -308 Q0 -298 14 -308" fill="none" stroke={COR_CONTORNO} strokeWidth={3} strokeLinecap="round" />
    </g>
  );
};

// Quadro da sala com linhas que se desenham em loop e um capelo
export const Quadro: React.FC<{ x: number; y: number; largura: number; altura: number }> = ({
  x,
  y,
  largura,
  altura,
}) => {
  const frame = useCurrentFrame();
  const progresso = (frame % 80) / 50;
  const traco = (indice: number, comprimento: number) =>
    interpolate(progresso - indice * 0.25, [0, 1], [comprimento, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={0} width={largura} height={altura} rx={22} fill={COR_AZUL_PROFUNDO} stroke={COR_BRANCO} strokeWidth={10} />
      {[0, 1, 2].map((i) => (
        <line
          key={`l-${i}`}
          x1={50}
          y1={70 + i * 56}
          x2={50 + largura * (0.62 - i * 0.12)}
          y2={70 + i * 56}
          stroke={COR_BRANCO}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={largura}
          strokeDashoffset={traco(i, largura)}
        />
      ))}
      <g transform={`translate(${largura - 120} ${altura / 2 - 10})`}>
        <polygon points="0,10 50,-10 100,10 50,30" fill={COR_MENTA} />
        <path d="M18 24 V50 Q50 66 82 50 V24 L50 38 Z" fill={COR_MENTA} opacity={0.85} />
      </g>
    </g>
  );
};

// Estante com livros em cores suaves
export const Estante: React.FC<{ x: number; y: number; largura: number; linhas: number }> = ({ x, y, largura, linhas }) => {
  const cores = [COR_AZUL_SUAVE, COR_LAVANDA, COR_MENTA, COR_AZUL_PROFUNDO, "#9bb3ff", "#e6dcff"];
  const altura = linhas * 190 + 30;
  const prateleiras = [];
  for (let linha = 0; linha < linhas; linha++) {
    const livros = [];
    let cursor = 20;
    let indice = 0;
    while (cursor < largura - 50) {
      const largLivro = 28 + ((indice * 7 + linha * 3) % 5) * 6;
      const altLivro = 120 + ((indice * 11 + linha * 5) % 6) * 10;
      livros.push(
        <rect
          key={`b-${linha}-${indice}`}
          x={cursor}
          y={linha * 190 + 180 - altLivro}
          width={largLivro}
          height={altLivro}
          rx={5}
          fill={cores[(indice + linha) % cores.length]}
          {...TRACO}
        />,
      );
      cursor += largLivro + 4;
      indice += 1;
    }
    prateleiras.push(
      <g key={`p-${linha}`}>
        {livros}
        <rect x={0} y={linha * 190 + 180} width={largura} height={16} rx={8} fill="#aab6e8" {...TRACO} />
      </g>,
    );
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-10} y={-10} width={largura + 20} height={altura + 10} rx={20} fill="#eef1ff" {...TRACO} />
      {prateleiras}
    </g>
  );
};

// Formando com beca e capelo, acenando com os dois braços
export const Formando: React.FC<{ x: number; y: number; cores: Cores; escala?: number; comCapelo?: boolean }> = ({
  x,
  y,
  cores,
  escala = 1,
  comCapelo = true,
}) => {
  const frame = useCurrentFrame();
  const acenar = Math.sin(frame * 0.4) * 14;
  const pula = -Math.abs(Math.sin(frame * 0.2)) * 18;
  return (
    <g transform={`translate(${x} ${y + pula}) scale(${escala})`}>
      <g transform={`translate(-44 -272) rotate(${150 + acenar})`}>
        <rect x={-14} y={0} width={28} height={126} rx={14} fill={COR_AZUL_PROFUNDO} {...TRACO} />
      </g>
      <g transform={`translate(44 -272) rotate(${-150 - acenar})`}>
        <rect x={-14} y={0} width={28} height={126} rx={14} fill={COR_AZUL_PROFUNDO} {...TRACO} />
      </g>
      <rect x={-24} y={-70} width={20} height={70} rx={10} fill={cores.calca} {...TRACO} />
      <rect x={4} y={-70} width={20} height={70} rx={10} fill={cores.calca} {...TRACO} />
      <path d="M-56 -292 Q0 -306 56 -292 L80 -50 Q0 -30 -80 -50 Z" fill={COR_AZUL_PROFUNDO} {...TRACO} />
      <path d="M-26 -296 L0 -230 L26 -296 Z" fill={COR_BRANCO} opacity={0.9} />
      <circle cx={0} cy={-338} r={48} fill={cores.pele} {...TRACO} />
      <path d="M-50 -336 Q-56 -396 0 -398 Q56 -396 50 -336 Q40 -364 0 -362 Q-40 -364 -50 -336 Z" fill={cores.cabelo} />
      <Rosto y={-344} r={48} />
      {comCapelo ? <Capelo /> : null}
    </g>
  );
};

export const Capelo: React.FC = () => (
  <g transform="translate(0 -392)">
    <polygon points="-70,0 0,-26 70,0 0,26" fill={COR_AZUL_PROFUNDO} {...TRACO} />
    <line x1={52} y1={4} x2={52} y2={44} stroke={COR_MENTA} strokeWidth={5} strokeLinecap="round" />
    <circle cx={52} cy={50} r={7} fill={COR_MENTA} />
  </g>
);

// Capelo lançado ao ar: arco com giro
export const CapeloVoando: React.FC<{ origemX: number; origemY: number; inicio: number }> = ({ origemX, origemY, inicio }) => {
  const frame = useCurrentFrame();
  const t = frame - inicio;
  if (t < 0) {
    return null;
  }
  const x = origemX + t * 6;
  const y = origemY - t * 30 + 0.7 * t * t;
  const giro = t * 14;
  return (
    <g transform={`translate(${x} ${y}) rotate(${giro}) scale(0.9)`}>
      <polygon points="-60,0 0,-22 60,0 0,22" fill={COR_AZUL_PROFUNDO} {...TRACO} />
      <line x1={46} y1={4} x2={46} y2={40} stroke={COR_MENTA} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

// Confete caindo, com posições e cores determinísticas
export const Confete: React.FC<{ inicio: number }> = ({ inicio }) => {
  const frame = useCurrentFrame();
  const t = frame - inicio;
  if (t < 0) {
    return null;
  }
  const cores = [COR_MENTA, COR_LAVANDA, COR_AZUL_SUAVE, "#ffffff"];
  const pecas = [];
  for (let i = 0; i < 40; i++) {
    const x0 = (i * 211) % 1080;
    const velocidade = 7 + ((i * 13) % 7);
    const y = -60 + t * velocidade + ((i * 97) % 300) - 150;
    const x = x0 + Math.sin((t + i * 9) * 0.12) * 40;
    pecas.push(
      <rect
        key={`cf-${i}`}
        x={x}
        y={y}
        width={16}
        height={26}
        rx={4}
        fill={cores[i % cores.length]}
        transform={`rotate(${t * 6 + i * 20} ${x + 8} ${y + 13})`}
      />,
    );
  }
  return <g>{pecas}</g>;
};

// Chão de sala de aula e biblioteca: piso claro com linha de rodapé
export const PisoInterno: React.FC<{ topo: number; cor: string }> = ({ topo, cor }) => (
  <g>
    <rect x={0} y={topo} width={1080} height={1920 - topo} fill={cor} />
    <rect x={0} y={topo} width={1080} height={14} fill={COR_AZUL_CLARO} opacity={0.9} />
  </g>
);

// Entrada suave reutilizável por cenas: sobe e aparece
export const suavizar = (frame: number, inicio: number, duracao: number) =>
  interpolate(frame, [inicio, inicio + duracao], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
