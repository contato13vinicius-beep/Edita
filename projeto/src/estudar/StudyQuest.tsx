import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// ---- Constantes editáveis (trocar aqui, sem mexer no resto) ----
export const FPS = 30;
export const DURACAO_QUADROS = 60 * FPS;

// Paleta (briefings/estudar-reino-unido-roteiro.md)
export const COR_FUNDO_TOPO = "#0e1a2b";
export const COR_FUNDO_BASE = "#2a5282";
export const COR_DESTAQUE = "#ffc857";
export const COR_SECUNDARIA = "#5bc0eb";
export const COR_TEXTO = "#ffffff";
export const COR_SILHUETA = "#07101d";

export const FONTE = '"Arial Black", "Helvetica Neue", Arial, sans-serif';
export const FONTE_TEXTO = "Arial, Helvetica, sans-serif";

// Legenda
export const LEGENDA_Y = 1240;
export const LEGENDA_TAMANHO = 60;

// Tempos das cenas (em segundos)
export const CENA_GANCHO_INICIO = 0;
export const CENA_GANCHO_FIM = 5;
export const CENA_COMO_INICIO = 5;
export const CENA_COMO_FIM = 20;

// Sons (public/sfx) e trilha (public/estudar)
export const SOM_CLIQUE = "sfx/clique.wav";
export const SOM_WHOOSH = "sfx/whoosh.wav";
export const SOM_POP = "sfx/pop.wav";
export const SOM_DING = "sfx/ding.wav";
export const ARQUIVO_NARRACAO = "estudar/narracao.mp3";
export const ARQUIVO_MUSICA = "estudar/musica.mp3";
export const VOLUME_MUSICA = 0.1;

// Textos das legendas (trecho 0 a 15 s)
const LEGENDA_GANCHO = "Quer estudar no Reino Unido, mas acha que não cabe no bolso?";
const DESTAQUE_GANCHO = "não cabe no bolso";
const LEGENDA_COMO_1 = "A graduação dura 3 anos na Inglaterra, no País de Gales e na Irlanda do Norte.";
const LEGENDA_COMO_2 = "E 4 anos na Escócia.";
const LEGENDA_COMO_1_INICIO = 5.0;
const LEGENDA_COMO_2_INICIO = 9.5;
const LEGENDA_COMO_2_FIM = 11.8;

const seg = (s: number) => Math.round(s * FPS);

// Sombra de contorno, mesmo estilo da cena 1 do teste
const CONTORNO = "0 4px 0 #000, 0 -2px 0 #000, 3px 0 0 #000, -3px 0 0 #000";

// ---- Componentes compartilhados ----

const Fundo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${COR_FUNDO_TOPO} 0%, ${COR_FUNDO_BASE} 100%)`,
      }}
    />
  );
};

// Relógio que conta sem parar: movimento contínuo, nada fica parado
const Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const segundos = Math.floor(frame / FPS);
  const centesimos = Math.floor((frame / FPS) * 100) % 100;
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        right: 80,
        fontFamily: "Courier New, monospace",
        fontSize: 40,
        fontWeight: 700,
        color: COR_TEXTO,
        opacity: 0.85,
      }}
    >
      {`00:00:${String(segundos).padStart(2, "0")}:${String(centesimos).padStart(2, "0")}`}
    </div>
  );
};

// Barra de progresso que anda o tempo todo, no topo
const BarraProgresso: React.FC = () => {
  const frame = useCurrentFrame();
  const largura = interpolate(frame, [0, seg(CENA_COMO_FIM)], [0, 100], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 80, height: 8, background: "rgba(255,255,255,0.2)" }}>
      <div style={{ height: "100%", width: `${largura}%`, background: COR_DESTAQUE }} />
    </div>
  );
};

// Entrada de cada palavra ou linha: mola curta, sem tremor
const Entrada: React.FC<{ inicio: number; children: React.ReactNode; estilo?: React.CSSProperties }> = ({
  inicio,
  children,
  estilo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mola = spring({ frame: frame - inicio, fps, config: { damping: 16, stiffness: 160 } });
  const opacidade = interpolate(frame - inicio, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const deslocamento = interpolate(mola, [0, 1], [40, 0]);
  return (
    <div style={{ opacity: opacidade, transform: `translateY(${deslocamento}px)`, ...estilo }}>{children}</div>
  );
};

// Legenda em chip no rodapé, destaque em âmbar
const Legenda: React.FC<{ texto: string; destaque?: string; inicio: number; fim: number }> = ({
  texto,
  destaque,
  inicio,
  fim,
}) => {
  const frame = useCurrentFrame();
  const visivel = frame >= seg(inicio) && frame < seg(fim);
  if (!visivel) {
    return null;
  }
  const partes = destaque ? texto.split(destaque) : [texto];
  return (
    <div
      style={{
        position: "absolute",
        top: LEGENDA_Y,
        left: 60,
        right: 60,
        textAlign: "center",
        fontFamily: FONTE_TEXTO,
        fontWeight: 700,
        fontSize: LEGENDA_TAMANHO,
        lineHeight: 1.25,
        color: COR_TEXTO,
      }}
    >
      <span
        style={{
          background: "rgba(0,0,0,0.55)",
          padding: "8px 18px",
          borderRadius: 14,
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
        }}
      >
        {partes[0]}
        {destaque ? <span style={{ color: COR_DESTAQUE, fontWeight: 900 }}>{destaque}</span> : null}
        {partes[1] ?? ""}
      </span>
    </div>
  );
};

// ---- Cena 1: gancho (0 a 5 s), skyline de Londres em silhueta ----

const SkylineLondres: React.FC = () => {
  const frame = useCurrentFrame();
  // Zoom contínuo e lento, do começo ao fim da cena
  const zoom = interpolate(frame, [0, seg(CENA_GANCHO_FIM)], [1, 1.08], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 100%" }}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: "absolute", inset: 0 }}>
        {/* Estrelas fixas */}
        {[
          [120, 300],
          [260, 240],
          [520, 200],
          [780, 330],
          [930, 230],
          [660, 420],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={3} fill={COR_TEXTO} opacity={0.6} />
        ))}
        {/* Prédios ao fundo */}
        <rect x={0} y={1080} width={1080} height={420} fill={COR_SILHUETA} opacity={0.6} />
        <rect x={40} y={1000} width={130} height={500} fill={COR_SILHUETA} opacity={0.7} />
        <rect x={880} y={1040} width={160} height={460} fill={COR_SILHUETA} opacity={0.7} />
        {/* Torre do relógio (Big Ben em silhueta) */}
        <rect x={470} y={960} width={120} height={520} fill={COR_SILHUETA} />
        <polygon points="470,960 530,820 590,960" fill={COR_SILHUETA} />
        <circle cx={530} cy={1010} r={34} fill={COR_DESTAQUE} opacity={0.85} />
        {/* Ponte com duas torres (Tower Bridge em silhueta) */}
        <rect x={180} y={1120} width={90} height={380} fill={COR_SILHUETA} />
        <rect x={610} y={1120} width={90} height={380} fill={COR_SILHUETA} />
        <rect x={0} y={1330} width={1080} height={22} fill={COR_SILHUETA} />
        {/* Chão */}
        <rect x={0} y={1500} width={1080} height={420} fill={COR_SILHUETA} />
        {/* Janelas acesas */}
        {[60, 90, 120].map((x, i) =>
          [1060, 1110].map((y) => (
            <rect key={`j-${x}-${y}-${i}`} x={x} y={y} width={16} height={22} fill={COR_DESTAQUE} opacity={0.5} />
          )),
        )}
        {[910, 940, 970].map((x) =>
          [1090, 1130].map((y) => (
            <rect key={`k-${x}-${y}`} x={x} y={y} width={16} height={22} fill={COR_DESTAQUE} opacity={0.5} />
          )),
        )}
      </svg>
    </div>
  );
};

export const CenaGancho: React.FC = () => {
  return (
    <AbsoluteFill>
      <Fundo />
      <SkylineLondres />
      <Relogio />
      <BarraProgresso />
      <div style={{ position: "absolute", top: 420, left: 60, right: 60, textAlign: "center" }}>
        <Entrada
          inicio={seg(0.2)}
          estilo={{ fontFamily: FONTE, fontWeight: 900, fontSize: 124, color: COR_TEXTO, textShadow: CONTORNO }}
        >
          NÃO CABE
        </Entrada>
        <Entrada
          inicio={seg(1.0)}
          estilo={{ fontFamily: FONTE, fontWeight: 900, fontSize: 150, color: COR_DESTAQUE, textShadow: CONTORNO }}
        >
          NO BOLSO?
        </Entrada>
      </div>
      <Legenda texto={LEGENDA_GANCHO} destaque={DESTAQUE_GANCHO} inicio={0.4} fim={4.2} />
      <Sequence from={seg(0.2)} durationInFrames={seg(3)}>
        <Audio src={staticFile(SOM_CLIQUE)} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---- Cena 2: como funciona (5 a 20 s), linha do tempo animada ----

const ConectorLinha: React.FC = () => {
  const frame = useCurrentFrame();
  const inicio = seg(CENA_COMO_INICIO);
  const fim = seg(CENA_COMO_FIM);
  const altura = interpolate(frame, [inicio, fim], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: 539,
        top: 775,
        width: 4,
        height: 55,
        background: "rgba(255,255,255,0.2)",
      }}
    >
      <div style={{ width: "100%", height: `${altura}%`, background: COR_SECUNDARIA }} />
    </div>
  );
};

const CartaoAnos: React.FC<{ topo: number; inicio: number; numero: string; rotulo: string; detalhe: string }> = ({
  topo,
  inicio,
  numero,
  rotulo,
  detalhe,
}) => {
  return (
    <Entrada
      inicio={seg(inicio)}
      estilo={{ position: "absolute", top: topo, left: 80, right: 80 }}
    >
      <div
        style={{
          background: "rgba(7,16,29,0.85)",
          border: `4px solid ${COR_SECUNDARIA}`,
          borderRadius: 24,
          padding: "36px 44px",
          textAlign: "center",
        }}
      >
        <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 140, color: COR_DESTAQUE, lineHeight: 1 }}>
          {numero}
        </div>
        <div style={{ fontFamily: FONTE, fontWeight: 900, fontSize: 52, color: COR_TEXTO, marginTop: 8 }}>{rotulo}</div>
        <div style={{ fontFamily: FONTE_TEXTO, fontSize: 40, color: COR_SECUNDARIA, marginTop: 14, lineHeight: 1.3 }}>
          {detalhe}
        </div>
      </div>
    </Entrada>
  );
};

export const CenaComoFunciona: React.FC = () => {
  // Sem Sequence: os quadros são globais, então os tempos da cena batem com a narração
  const frame = useCurrentFrame();
  if (frame < seg(CENA_COMO_INICIO)) {
    return null;
  }
  return (
    <AbsoluteFill>
      <Fundo />
      <Relogio />
      <BarraProgresso />
      <ConectorLinha />
      <CartaoAnos
        topo={420}
        inicio={CENA_COMO_INICIO + 0.2}
        numero="3 ANOS"
        rotulo="GRADUAÇÃO"
        detalhe="Inglaterra · País de Gales · Irlanda do Norte"
      />
      <CartaoAnos
        topo={830}
        inicio={CENA_COMO_INICIO + 4.6}
        numero="4 ANOS"
        rotulo="NA ESCÓCIA"
        detalhe="Universidades escocesas"
      />
      <Legenda texto={LEGENDA_COMO_1} inicio={LEGENDA_COMO_1_INICIO} fim={LEGENDA_COMO_2_INICIO} />
      <Legenda texto={LEGENDA_COMO_2} inicio={LEGENDA_COMO_2_INICIO} fim={LEGENDA_COMO_2_FIM} />
    </AbsoluteFill>
  );
};

// ---- Composição principal ----

export const StudyQuest: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COR_FUNDO_TOPO }}>
      <Sequence from={seg(CENA_GANCHO_INICIO)} durationInFrames={seg(CENA_GANCHO_FIM - CENA_GANCHO_INICIO)} name="Cena 1 - Gancho">
        <CenaGancho />
      </Sequence>
      <CenaComoFunciona />
      <Sequence from={seg(CENA_COMO_INICIO)} durationInFrames={seg(1)}>
        <Audio src={staticFile(SOM_WHOOSH)} volume={0.6} />
      </Sequence>
      <Sequence from={seg(CENA_COMO_INICIO + 4.6)} durationInFrames={seg(1)}>
        <Audio src={staticFile(SOM_POP)} />
      </Sequence>
      <Audio src={staticFile(ARQUIVO_NARRACAO)} />
      <Audio src={staticFile(ARQUIVO_MUSICA)} volume={VOLUME_MUSICA} loop />
    </AbsoluteFill>
  );
};
