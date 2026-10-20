import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  CenaBiblioteca,
  CenaCampus,
  CenaFinal,
  CenaFormatura,
  CenaGrafico,
  CenaNotificacao,
  CenaSala,
} from "./Cenas";
import { PALAVRAS } from "./palavras";
import {
  ARQUIVO_MUSICA,
  ARQUIVO_NARRACAO,
  CENA_BIBLIOTECA,
  CENA_CAMINHADA,
  CENA_CAMPUS,
  CENA_FINAL,
  CENA_FORMATURA,
  CENA_GRAFICO,
  CENA_NOTIFICACAO,
  CENA_SALA,
  COR_AZUL_PROFUNDO,
  COR_AZUL_SUAVE,
  COR_BRANCO,
  COR_FUNDO_TOPO,
  COR_LAVANDA,
  COR_MENTA,
  COR_TEXTO,
  DURACAO_QUADROS,
  FONTE,
  LEGENDA_TAMANHO,
  LEGENDA_Y,
  SOM_CLIQUE,
  SOM_CONCLUSAO,
  SOM_ITEM,
  SOM_TRANSICAO,
  VOLUME_MUSICA,
  seg,
} from "./tema";

export { DURACAO_QUADROS };

const FIM = (cena: { inicio: number; fim: number }) => seg(cena.fim - cena.inicio);

// Transições gráficas: um painel arredondado cruza a tela e conecta as cenas.
// Cortes principais usam o painel mais longo; os cortes dentro de uma cena, o curto.
const CORTES = [
  { t: CENA_SALA.inicio, longo: true },
  { t: CENA_BIBLIOTECA.inicio, longo: false },
  { t: CENA_NOTIFICACAO.inicio, longo: false },
  { t: CENA_FORMATURA.inicio, longo: true },
  { t: CENA_GRAFICO.inicio, longo: false },
  { t: CENA_CAMINHADA.inicio, longo: true },
  { t: CENA_FINAL.inicio, longo: false },
];

const Transicoes: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {CORTES.map((corte) => {
        const meio = seg(corte.t);
        const metade = corte.longo ? 9 : 6;
        if (frame < meio - metade || frame > meio + metade) {
          return null;
        }
        const x = interpolate(frame, [meio - metade, meio + metade], [1200, -1700], {
          easing: Easing.inOut(Easing.cubic),
        });
        return (
          <div
            key={`t-${corte.t}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: x,
              width: 1500,
              borderRadius: "700px 0 0 700px",
              background: `linear-gradient(90deg, ${COR_LAVANDA} 0%, ${COR_AZUL_SUAVE} 100%)`,
              boxShadow: `-30px 0 0 ${COR_MENTA}`,
            }}
          />
        );
      })}
    </>
  );
};

// Legenda palavra por palavra: só uma palavra por vez, sincronizada com a narração
const LegendaPalavras: React.FC = () => {
  const frame = useCurrentFrame();
  const agora = frame / 30;
  const ativa = PALAVRAS.findIndex((p) => agora >= p.t && agora < p.t + p.d + 0.1);
  if (ativa === -1) {
    return null;
  }
  const palavra = PALAVRAS[ativa];
  const desde = frame - seg(palavra.t);
  const escala = interpolate(desde, [0, 4, 9], [0.78, 1.06, 1], { extrapolateRight: "clamp" });
  const subida = interpolate(desde, [0, 6], [22, 0], { extrapolateRight: "clamp" });
  const opacidade = interpolate(desde, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  const tamanho = palavra.w.length > 11 ? 88 : LEGENDA_TAMANHO;

  return (
    <div style={{ position: "absolute", top: LEGENDA_Y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        key={ativa}
        style={{
          fontFamily: FONTE,
          fontWeight: 800,
          fontSize: tamanho,
          textTransform: "uppercase",
          lineHeight: 1,
          padding: "24px 44px 28px",
          borderRadius: 40,
          color: palavra.destaque ? COR_BRANCO : COR_TEXTO,
          background: palavra.destaque ? COR_AZUL_PROFUNDO : COR_BRANCO,
          boxShadow: "0 18px 40px rgba(27,42,107,0.2)",
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

// Um som por evento, sempre em instantes diferentes
const SOM = (inicio: number, arquivo: string, volume: number, duracao = 1) => (
  <Sequence key={`${arquivo}-${inicio}`} from={seg(inicio)} durationInFrames={seg(duracao)}>
    <Audio src={staticFile(arquivo)} volume={volume} />
  </Sequence>
);

export const AnuncioV2: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COR_FUNDO_TOPO }}>
      <Sequence durationInFrames={FIM(CENA_CAMPUS)} name="Cena 1 - Campus">
        <CenaCampus duracao={CENA_CAMPUS.fim - CENA_CAMPUS.inicio} comTitulo variante="chegada" />
      </Sequence>
      <Sequence from={seg(CENA_SALA.inicio)} durationInFrames={FIM(CENA_SALA)} name="Cena 2a - Sala de aula">
        <CenaSala duracao={CENA_SALA.fim - CENA_SALA.inicio} />
      </Sequence>
      <Sequence from={seg(CENA_BIBLIOTECA.inicio)} durationInFrames={FIM(CENA_BIBLIOTECA)} name="Cena 2b - Biblioteca">
        <CenaBiblioteca duracao={CENA_BIBLIOTECA.fim - CENA_BIBLIOTECA.inicio} />
      </Sequence>
      <Sequence from={seg(CENA_NOTIFICACAO.inicio)} durationInFrames={FIM(CENA_NOTIFICACAO)} name="Cena 2c - Notificacao">
        <CenaNotificacao duracao={CENA_NOTIFICACAO.fim - CENA_NOTIFICACAO.inicio} />
      </Sequence>
      <Sequence from={seg(CENA_FORMATURA.inicio)} durationInFrames={FIM(CENA_FORMATURA)} name="Cena 3a - Formatura">
        <CenaFormatura duracao={CENA_FORMATURA.fim - CENA_FORMATURA.inicio} />
      </Sequence>
      <Sequence from={seg(CENA_GRAFICO.inicio)} durationInFrames={FIM(CENA_GRAFICO)} name="Cena 3b - Grafico de renda">
        <CenaGrafico duracao={CENA_GRAFICO.fim - CENA_GRAFICO.inicio} />
      </Sequence>
      <Sequence from={seg(CENA_CAMINHADA.inicio)} durationInFrames={FIM(CENA_CAMINHADA)} name="Cena 4a - Caminhada">
        <CenaCampus duracao={CENA_CAMINHADA.fim - CENA_CAMINHADA.inicio} comTitulo={false} variante="caminhada" />
      </Sequence>
      <Sequence from={seg(CENA_FINAL.inicio)} durationInFrames={FIM(CENA_FINAL)} name="Cena 4b - Student Advisor">
        <CenaFinal duracao={CENA_FINAL.fim - CENA_FINAL.inicio} />
      </Sequence>

      <Transicoes />
      <LegendaPalavras />

      {/* Sons suaves nas transições e nos itens, um por evento */}
      {SOM(CENA_SALA.inicio - 0.1, SOM_TRANSICAO, 0.35)}
      {SOM(CENA_BIBLIOTECA.inicio - 0.05, SOM_CLIQUE, 0.4, 0.5)}
      {SOM(CENA_NOTIFICACAO.inicio - 0.05, SOM_CLIQUE, 0.4, 0.5)}
      {SOM(CENA_FORMATURA.inicio - 0.1, SOM_TRANSICAO, 0.35)}
      {SOM(CENA_GRAFICO.inicio - 0.05, SOM_CLIQUE, 0.4, 0.5)}
      {SOM(CENA_CAMINHADA.inicio - 0.1, SOM_TRANSICAO, 0.35)}
      {SOM(CENA_SALA.inicio + 0.45, SOM_ITEM, 0.45)}
      {SOM(CENA_BIBLIOTECA.inicio + 0.35, SOM_ITEM, 0.45)}
      {SOM(CENA_NOTIFICACAO.inicio + 0.25, SOM_ITEM, 0.4)}
      {SOM(CENA_NOTIFICACAO.inicio + 0.7, SOM_ITEM, 0.4)}
      {SOM(CENA_GRAFICO.inicio + 1.5, SOM_ITEM, 0.5)}
      {SOM(CENA_FINAL.inicio + 1.75, SOM_CONCLUSAO, 0.55, 1.5)}

      <Audio src={staticFile(ARQUIVO_NARRACAO)} />
      <Audio src={staticFile(ARQUIVO_MUSICA)} volume={VOLUME_MUSICA} loop />
    </AbsoluteFill>
  );
};
