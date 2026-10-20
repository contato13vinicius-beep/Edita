import { loadFont } from "@remotion/fonts";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Arvore, Cores, Estudante, Nuvem, PredioCampus } from "./Ilustracoes";
import { PALAVRAS_CENA_1 } from "./palavras";

// ---- Constantes editáveis (trocar aqui, sem mexer no resto) ----
export const FPS = 30;
export const DURACAO_PREVIA_SEGUNDOS = 5;
export const DURACAO_PREVIA_QUADROS = DURACAO_PREVIA_SEGUNDOS * FPS;

// Paleta: branco, azul suave, azul profundo, lavanda e verde-menta
export const COR_FUNDO_TOPO = "#f7f8ff";
export const COR_FUNDO_BASE = "#e6ebff";
export const COR_AZUL_PROFUNDO = "#1b2a6b";
export const COR_AZUL_SUAVE = "#6e8cf5";
export const COR_LAVANDA = "#c7b9ff";
export const COR_MENTA = "#6fe3c1";
export const COR_TEXTO = "#14183a";
export const COR_BRANCO = "#ffffff";

// Tipografia (Plus Jakarta Sans, arquivo local em public/anuncio/fonts)
export const NOME_FONTE = "Plus Jakarta Sans";
export const ARQUIVO_FONTE = "anuncio/fonts/plus-jakarta-sans-latin-800-normal.woff2";
export const FONTE = `"${NOME_FONTE}", "Helvetica Neue", Arial, sans-serif`;

// Legendas palavra por palavra
export const LEGENDA_Y = 1640;
export const LEGENDA_TAMANHO = 112;
export const PALAVRAS_DESTAQUE_VISUAL = ["universidade", "financiamento", "governo"];

// Áudio
export const ARQUIVO_NARRACAO = "anuncio/narracao-v2-cena1.mp3";
export const ARQUIVO_MUSICA = "estudar/musica.mp3";
export const VOLUME_MUSICA = 0.08;
export const SOM_ABERTURA = "sfx/pop.wav";

// Carrega a fonte local antes do render. Sem isso, o Remotion usaria a fonte padrão.
loadFont({
  family: NOME_FONTE,
  url: staticFile(ARQUIVO_FONTE),
  weight: "800",
});

const seg = (s: number) => Math.round(s * FPS);

const CORES_ESTUDANTE_A: Cores = {
  pele: "#f2c4a0",
  cabelo: "#2b2140",
  camisa: "#6e8cf5",
  calca: "#1b2a6b",
  mochila: "#6fe3c1",
};
const CORES_ESTUDANTE_B: Cores = {
  pele: "#8d5a3b",
  cabelo: "#14183a",
  camisa: "#c7b9ff",
  calca: "#2c3e7a",
  mochila: "#1b2a6b",
};
const CORES_ESTUDANTE_C: Cores = {
  pele: "#e8b890",
  cabelo: "#c97b3a",
  camisa: "#6fe3c1",
  calca: "#14183a",
  mochila: "#6e8cf5",
};

// Fundo com gradiente suave e manchas de luz em movimento lento
const FundoClaro: React.FC = () => {
  const frame = useCurrentFrame();
  const deriva = interpolate(frame, [0, seg(DURACAO_PREVIA_SEGUNDOS)], [0, 40], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${COR_FUNDO_TOPO} 0%, ${COR_FUNDO_BASE} 100%)` }}>
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: 350,
          left: -180 + deriva,
          top: 120,
          background: `radial-gradient(circle, ${COR_LAVANDA} 0%, rgba(199,185,255,0) 70%)`,
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: 300,
          right: -160 - deriva,
          top: 900,
          background: `radial-gradient(circle, ${COR_AZUL_SUAVE} 0%, rgba(110,140,245,0) 70%)`,
          opacity: 0.25,
        }}
      />
    </AbsoluteFill>
  );
};

// Cena do campus: câmera com zoom suave e parallax entre céu, prédio, árvores e estudantes
const CenaCampus: React.FC = () => {
  const frame = useCurrentFrame();
  const duracao = seg(DURACAO_PREVIA_SEGUNDOS);
  const zoom = interpolate(frame, [0, duracao], [1, 1.06], { extrapolateRight: "clamp" });
  const cameraX = interpolate(frame, [0, duracao], [10, -10], { extrapolateRight: "clamp" });
  const paralaxeFundo = interpolate(frame, [0, duracao], [0, -14], { extrapolateRight: "clamp" });
  const paralaxeMeio = interpolate(frame, [0, duracao], [0, -28], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translateX(${cameraX}px)`, transformOrigin: "50% 60%" }}
      >
        {/* Céu: nuvens com parallax mais lento */}
        <g transform={`translate(${paralaxeFundo} 0)`}>
          <Nuvem x={0} y={600} escala={0.9} cor="#ffffff" />
        </g>

        {/* Árvores atrás do prédio */}
        <g transform={`translate(${paralaxeMeio * 0.6} 0)`}>
          <Arvore x={70} y={980} escala={1.1} cor="#bdebd6" tronco="#8a6e5a" />
          <Arvore x={1010} y={960} escala={1.25} cor="#9bddc0" tronco="#8a6e5a" />
        </g>

        {/* Prédio do campus */}
        <g transform={`translate(${paralaxeMeio * 0.35} 0)`}>
          <PredioCampus corPredio="#e4e9fb" corSombra={COR_AZUL_SUAVE} corTeto={COR_AZUL_PROFUNDO} />
        </g>

        {/* Gramado e caminho até a entrada */}
        <rect x={0} y={1224} width={1080} height={696} fill="#cff3e2" />
        <polygon points="500,1224 580,1224 770,1920 310,1920" fill="#f4f6ff" opacity={0.92} />

        {/* Estudantes chegando, em primeiro plano */}
        <Estudante de={-40} para={330} baseY={1500} inicio={0} duracao={seg(4)} cores={CORES_ESTUDANTE_A} />
        <Estudante de={1120} para={740} baseY={1500} inicio={seg(0.6)} duracao={seg(4)} cores={CORES_ESTUDANTE_B} escala={0.96} />
        <Estudante de={-60} para={200} baseY={1430} inicio={seg(1.2)} duracao={seg(4)} cores={CORES_ESTUDANTE_C} escala={0.84} />
      </svg>
    </AbsoluteFill>
  );
};

// Título com revelação por máscara e linha de destaque em verde-menta
const Titulo: React.FC = () => {
  const frame = useCurrentFrame();

  const revelar = (inicioQuadro: number) =>
    interpolate(frame, [inicioQuadro, inicioQuadro + 14], [110, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });

  const linhaDestaque = interpolate(frame, [seg(0.5), seg(1.1)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ position: "absolute", top: 180, left: 70, right: 70 }}>
      <div style={{ overflow: "hidden", height: 170 }}>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 150,
            lineHeight: 1,
            color: COR_AZUL_PROFUNDO,
            transform: `translateY(${revelar(seg(0.1))}%)`,
          }}
        >
          ESTUDE
        </div>
      </div>
      <div style={{ overflow: "hidden", height: 110 }}>
        <div
          style={{
            fontFamily: FONTE,
            fontWeight: 800,
            fontSize: 96,
            lineHeight: 1,
            color: COR_AZUL_PROFUNDO,
            transform: `translateY(${revelar(seg(0.3))}%)`,
          }}
        >
          NO REINO UNIDO
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          height: 10,
          borderRadius: 5,
          width: "100%",
          background: COR_MENTA,
          transform: `scaleX(${linhaDestaque})`,
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

// Legenda palavra por palavra: só uma palavra aparece por vez, sincronizada com a narração
const LegendaPalavras: React.FC = () => {
  const frame = useCurrentFrame();
  const agora = frame / FPS;
  const ativa = PALAVRAS_CENA_1.findIndex((p) => agora >= p.t && agora < p.t + p.d + 0.12);
  if (ativa === -1) {
    return null;
  }
  const palavra = PALAVRAS_CENA_1[ativa];
  const desde = frame - seg(palavra.t);
  const escala = interpolate(desde, [0, 4, 9], [0.78, 1.06, 1], { extrapolateRight: "clamp" });
  const subida = interpolate(desde, [0, 6], [22, 0], { extrapolateRight: "clamp" });
  const opacidade = interpolate(desde, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const destaque = PALAVRAS_DESTAQUE_VISUAL.includes(palavra.w.toLowerCase());

  return (
    <div
      style={{
        position: "absolute",
        top: LEGENDA_Y,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        key={ativa}
        style={{
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: LEGENDA_TAMANHO,
          textTransform: "uppercase",
          lineHeight: 1,
          padding: "26px 44px 30px",
          borderRadius: 40,
          color: destaque ? COR_BRANCO : COR_TEXTO,
          background: destaque ? COR_AZUL_PROFUNDO : COR_BRANCO,
          boxShadow: "0 18px 40px rgba(27,42,107,0.18)",
          opacity: opacidade,
          transform: `translateY(${subida}px) scale(${escala})`,
          whiteSpace: "nowrap",
        }}
      >
        {palavra.w}
      </div>
    </div>
  );
};

export const AnuncioV2Previa: React.FC = () => {
  return (
    <AbsoluteFill>
      <FundoClaro />
      <CenaCampus />
      <Titulo />
      <LegendaPalavras />
      <Sequence from={seg(0.1)} durationInFrames={seg(0.8)}>
        <Audio src={staticFile(SOM_ABERTURA)} volume={0.5} />
      </Sequence>
      <Audio src={staticFile(ARQUIVO_NARRACAO)} />
      <Audio src={staticFile(ARQUIVO_MUSICA)} volume={VOLUME_MUSICA} loop />
    </AbsoluteFill>
  );
};
