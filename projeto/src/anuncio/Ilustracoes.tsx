import { Easing, interpolate, useCurrentFrame } from "remotion";

// Ilustrações vetoriais (SVG) com animação programática: estudantes, campus e árvores.
// Cores vêm da paleta do anúncio (ver AnuncioV2.tsx).

export type Cores = {
  pele: string;
  cabelo: string;
  camisa: string;
  calca: string;
  mochila: string;
};

const CONTORNO = "#14183a";

// Estudante andando. Os pés ficam em (x, baseY); a pessoa tem ~330 px de altura.
// Anda de `de` até `para` entre os quadros `inicio` e `inicio + duracao` e depois fica parada.
export const Estudante: React.FC<{
  de: number;
  para: number;
  baseY: number;
  inicio: number;
  duracao: number;
  escala?: number;
  cores: Cores;
}> = ({ de, para, baseY, inicio, duracao, escala = 1, cores }) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [inicio, inicio + duracao], [de, para], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const andando = frame >= inicio && frame < inicio + duracao;
  // Ciclo de passada: contínuo enquanto anda, suave ao parar
  const fase = frame * 0.32;
  const balanco = andando ? Math.sin(fase) : 0;
  const perna = andando ? 24 * Math.sin(fase) : 0;
  const braco = andando ? -20 * Math.sin(fase) : -4;
  const sobe = andando ? -5 * Math.abs(Math.cos(fase)) : 0;

  return (
    <g transform={`translate(${x} ${baseY + sobe}) scale(${escala})`}>
      {/* Mochila, atrás do corpo */}
      <rect x={-72} y={-286} width={44} height={116} rx={18} fill={cores.mochila} stroke={CONTORNO} strokeWidth={3} />
      {/* Braços */}
      <g transform={`translate(-40 -272) rotate(${braco})`}>
        <rect x={-13} y={0} width={26} height={126} rx={13} fill={cores.camisa} stroke={CONTORNO} strokeWidth={3} />
      </g>
      <g transform={`translate(40 -272) rotate(${-braco})`}>
        <rect x={-13} y={0} width={26} height={126} rx={13} fill={cores.camisa} stroke={CONTORNO} strokeWidth={3} />
      </g>
      {/* Pernas com tênis */}
      <g transform={`translate(-22 -150) rotate(${perna})`}>
        <rect x={-15} y={0} width={30} height={150} rx={15} fill={cores.calca} stroke={CONTORNO} strokeWidth={3} />
        <rect x={-19} y={138} width={42} height={20} rx={10} fill={CONTORNO} />
      </g>
      <g transform={`translate(22 -150) rotate(${-perna})`}>
        <rect x={-15} y={0} width={30} height={150} rx={15} fill={cores.calca} stroke={CONTORNO} strokeWidth={3} />
        <rect x={-19} y={138} width={42} height={20} rx={10} fill={CONTORNO} />
      </g>
      {/* Tronco */}
      <g transform={`translate(0 ${balanco * 2})`}>
        <rect x={-46} y={-292} width={92} height={150} rx={38} fill={cores.camisa} stroke={CONTORNO} strokeWidth={3} />
        {/* Cabeça */}
        <circle cx={0} cy={-338} r={48} fill={cores.pele} stroke={CONTORNO} strokeWidth={3} />
        {/* Cabelo */}
        <path
          d="M-50 -336 Q-56 -396 0 -398 Q56 -396 50 -336 Q40 -364 0 -362 Q-40 -364 -50 -336 Z"
          fill={cores.cabelo}
        />
        <circle cx={-16} cy={-332} r={5} fill={CONTORNO} />
        <circle cx={16} cy={-332} r={5} fill={CONTORNO} />
        <path d="M-14 -310 Q0 -300 14 -310" fill="none" stroke={CONTORNO} strokeWidth={3} strokeLinecap="round" />
      </g>
    </g>
  );
};

// Prédio do campus com pórtico, colunas, relógio e janelas
export const PredioCampus: React.FC<{ corPredio: string; corSombra: string; corTeto: string }> = ({
  corPredio,
  corSombra,
  corTeto,
}) => {
  const janelas = [];
  for (let linha = 0; linha < 2; linha++) {
    for (let coluna = 0; coluna < 7; coluna++) {
      janelas.push(
        <rect
          key={`j-${linha}-${coluna}`}
          x={190 + coluna * 100}
          y={920 + linha * 110}
          width={44}
          height={70}
          rx={22}
          fill={corSombra}
        />,
      );
    }
  }
  return (
    <g>
      {/* Torre central com relógio */}
      <rect x={470} y={560} width={140} height={320} fill={corPredio} stroke={CONTORNO} strokeWidth={3} />
      <polygon points="460,560 540,470 620,560" fill={corTeto} />
      <circle cx={540} cy={650} r={38} fill="#ffffff" stroke={CONTORNO} strokeWidth={4} />
      <line x1={540} y1={650} x2={540} y2={624} stroke={CONTORNO} strokeWidth={4} strokeLinecap="round" />
      <line x1={540} y1={650} x2={558} y2={650} stroke={CONTORNO} strokeWidth={4} strokeLinecap="round" />
      {/* Corpo do prédio */}
      <rect x={140} y={760} width={800} height={420} rx={14} fill={corPredio} stroke={CONTORNO} strokeWidth={3} />
      {/* Frontão */}
      <polygon points="120,770 540,660 960,770" fill={corPredio} stroke={CONTORNO} strokeWidth={3} />
      <polygon points="200,760 540,690 880,760" fill={corSombra} opacity={0.35} />
      {/* Janelas */}
      {janelas}
      {/* Colunas do pórtico */}
      {[370, 430, 490, 590, 650, 710].map((x) => (
        <rect key={`c-${x}`} x={x} y={860} width={26} height={250} rx={6} fill="#ffffff" stroke={CONTORNO} strokeWidth={2} />
      ))}
      {/* Porta */}
      <path d="M500 1180 V1040 Q540 1000 580 1040 V1180 Z" fill={corSombra} stroke={CONTORNO} strokeWidth={3} />
      {/* Escadaria */}
      <rect x={300} y={1180} width={480} height={22} rx={6} fill="#ffffff" stroke={CONTORNO} strokeWidth={3} />
      <rect x={260} y={1202} width={560} height={22} rx={6} fill="#ffffff" stroke={CONTORNO} strokeWidth={3} />
    </g>
  );
};

// Árvore arredondada em tons de verde-menta
export const Arvore: React.FC<{ x: number; y: number; escala: number; cor: string; tronco: string }> = ({
  x,
  y,
  escala,
  cor,
  tronco,
}) => (
  <g transform={`translate(${x} ${y}) scale(${escala})`}>
    <rect x={-12} y={0} width={24} height={120} rx={8} fill={tronco} />
    <circle cx={0} cy={-30} r={92} fill={cor} />
    <circle cx={-60} cy={10} r={60} fill={cor} />
    <circle cx={62} cy={6} r={62} fill={cor} />
  </g>
);

// Nuvem suave para o céu, com deslocamento lento (parallax)
export const Nuvem: React.FC<{ x: number; y: number; escala: number; cor: string }> = ({ x, y, escala, cor }) => {
  const frame = useCurrentFrame();
  const deslocamento = (frame * 0.6) % 1300;
  const posicao = ((x + deslocamento) % 1300) - 200;
  return (
    <g transform={`translate(${posicao} ${y}) scale(${escala})`} opacity={0.9}>
      <ellipse cx={0} cy={0} rx={120} ry={34} fill={cor} />
      <ellipse cx={-60} cy={-18} rx={60} ry={34} fill={cor} />
      <ellipse cx={50} cy={-22} rx={70} ry={40} fill={cor} />
    </g>
  );
};
