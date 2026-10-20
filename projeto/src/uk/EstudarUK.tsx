import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// ---- Constantes editáveis (trocar aqui, sem mexer no resto) ----
export const FPS = 30;
export const DURACAO_QUADROS = 60 * FPS;

export const COR_FUNDO = "#d9d4c8";
export const COR_FUNDO_BORDA = "#a39e92";
export const COR_TEXTO = "#ffffff";
export const COR_DESTAQUE = "#c8f560";
export const COR_CONTORNO = "#111111";
export const COR_CAIXA = "#0f0f0f";

export const FONTE = '"Arial Black", "Helvetica Neue", Arial, sans-serif';
export const FONTE_MONO = '"Courier New", Courier, monospace';

export const LEGENDA_Y = 1240;
export const LEGENDA_TAMANHO = 64;

// Textos da narração (roteiro de 60 s em briefings/estudar-reino-unido.md)
export const ETIQUETA_TOPO = "BRASILEIROS NO UK";
export const TITULO_LINHA_1 = "ESTUDAR";
export const TITULO_LINHA_2 = "NO UK";
export const TITULO_DESTAQUE = "SEM SE AFUNDAR?";
export const LEGENDA_CENA_1 = "Dá pra estudar no Reino Unido sem se afundar em dívida?";
export const LEGENDA_DESTAQUE_CENA_1 = "sem se afundar";

// Sons (public/sfx). Um som por evento, nunca dois ao mesmo tempo.
export const SOM_CLIQUE = "sfx/clique.wav";
export const SOM_POP = "sfx/pop.wav";

// Quadros de cada evento da cena 1
const QUADRO_ETIQUETA = 0;
const QUADRO_TITULO_1 = 6;
const QUADRO_TITULO_2 = 14;
const QUADRO_LEGENDA = 20;

const estiloContorno = `
  -4px -4px 0 ${COR_CONTORNO}, 4px -4px 0 ${COR_CONTORNO},
  -4px 4px 0 ${COR_CONTORNO}, 4px 4px 0 ${COR_CONTORNO},
  0 6px 0 ${COR_CONTORNO}, 0 -4px 0 ${COR_CONTORNO}
`;

const Fundo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: COR_FUNDO,
        backgroundImage: `radial-gradient(ellipse at center, ${COR_FUNDO} 40%, ${COR_FUNDO_BORDA} 100%)`,
      }}
    />
  );
};

// Relógio que conta sem parar (movimento contínuo, nada fica parado)
const Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const centesimos = Math.floor((frame / FPS) * 100) % 100;
  const segundos = Math.floor(frame / FPS);
  const texto = `00:00:${String(segundos).padStart(2, "0")}:${String(centesimos).padStart(2, "0")}`;

  return (
    <div style={{ position: "absolute", top: 180, right: 80, textAlign: "right" }}>
      <div style={{ fontFamily: FONTE_MONO, fontSize: 56, fontWeight: 700, color: COR_CAIXA }}>{texto}</div>
      <div style={{ height: 6, background: COR_DESTAQUE, marginTop: 10, width: "100%" }} />
    </div>
  );
};

const Etiqueta: React.FC<{ texto: string }> = ({ texto }) => {
  const frame = useCurrentFrame();
  const entrada = interpolate(frame - QUADRO_ETIQUETA, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 260,
        left: 80,
        opacity: entrada,
        transform: `translateX(${(1 - entrada) * -40}px)`,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <div style={{ width: 12, background: COR_DESTAQUE }} />
      <div
        style={{
          background: COR_CAIXA,
          color: COR_TEXTO,
          fontFamily: FONTE_MONO,
          fontSize: 46,
          fontWeight: 700,
          letterSpacing: 6,
          padding: "14px 26px",
        }}
      >
        {texto}
      </div>
    </div>
  );
};

const LinhaTitulo: React.FC<{
  texto: string;
  inicio: number;
  tamanho: number;
  cor: string;
  alinhamento: "left" | "center";
  topo: number;
}> = ({ texto, inicio, tamanho, cor, alinhamento, topo }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const mola = spring({ frame: frame - inicio, fps, config: { damping: 13, stiffness: 180 } });
  const escala = interpolate(mola, [0, 1], [0.7, 1]);
  const opacidade = interpolate(frame - inicio, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        top: topo,
        left: 0,
        right: 0,
        textAlign: alinhamento,
        padding: alinhamento === "left" ? "0 80px" : 0,
        fontFamily: FONTE,
        fontWeight: 900,
        fontSize: tamanho,
        lineHeight: 1,
        color: cor,
        textShadow: estiloContorno,
        opacity: opacidade,
        transform: `scale(${escala})`,
        transformOrigin: alinhamento === "left" ? "left center" : "center center",
      }}
    >
      {texto}
    </div>
  );
};

// Legenda em chip no rodapé, palavras destacadas em verde-limão
const Legenda: React.FC<{ texto: string; destaque: string; inicio: number }> = ({ texto, destaque, inicio }) => {
  const frame = useCurrentFrame();
  const opacidade = interpolate(frame - inicio, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const partes = texto.split(destaque);

  return (
    <div
      style={{
        position: "absolute",
        top: LEGENDA_Y,
        left: 60,
        right: 60,
        textAlign: "center",
        opacity: opacidade,
        fontFamily: FONTE,
        fontWeight: 900,
        fontSize: LEGENDA_TAMANHO,
        lineHeight: 1.15,
        color: COR_TEXTO,
        textShadow: estiloContorno,
        textTransform: "uppercase",
      }}
    >
      {partes[0]}
      <span style={{ color: COR_DESTAQUE }}>{destaque.toUpperCase()}</span>
      {partes[1]}
    </div>
  );
};

// Barra de progresso que anda o tempo todo
const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const largura = interpolate(frame, [0, DURACAO_QUADROS], [0, 100], { extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", left: 80, right: 80, bottom: 120, height: 10, background: COR_FUNDO_BORDA }}>
      <div style={{ height: "100%", width: `${largura}%`, background: COR_CAIXA }} />
    </div>
  );
};

export const Cena1Titulo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fundo />
      <Relogio />
      <Etiqueta texto={ETIQUETA_TOPO} />
      <LinhaTitulo texto={TITULO_LINHA_1} inicio={QUADRO_TITULO_1} tamanho={170} cor={COR_TEXTO} alinhamento="left" topo={480} />
      <LinhaTitulo texto={TITULO_LINHA_2} inicio={QUADRO_TITULO_1 + 2} tamanho={170} cor={COR_TEXTO} alinhamento="left" topo={650} />
      <LinhaTitulo texto={TITULO_DESTAQUE} inicio={QUADRO_TITULO_2} tamanho={110} cor={COR_DESTAQUE} alinhamento="left" topo={840} />
      <Legenda texto={LEGENDA_CENA_1} destaque={LEGENDA_DESTAQUE_CENA_1} inicio={QUADRO_LEGENDA} />
      <BarraProgresso />
      <Sequence from={QUADRO_ETIQUETA + 3} durationInFrames={30}>
        <Audio src={staticFile(SOM_CLIQUE)} />
      </Sequence>
      <Sequence from={QUADRO_TITULO_1 + 2} durationInFrames={30}>
        <Audio src={staticFile(SOM_POP)} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const EstudarUK: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={150} name="Cena 1 - Titulo">
        <Cena1Titulo />
      </Sequence>
    </AbsoluteFill>
  );
};
