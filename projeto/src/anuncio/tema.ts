import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// ---- Constantes editáveis (trocar aqui, sem mexer no resto) ----
export const FPS = 30;
export const DURACAO_SEGUNDOS = 22;
export const DURACAO_QUADROS = DURACAO_SEGUNDOS * FPS;

// Paleta: branco, azul suave, azul profundo, lavanda e verde-menta
export const COR_FUNDO_TOPO = "#f7f8ff";
export const COR_FUNDO_BASE = "#e6ebff";
export const COR_AZUL_PROFUNDO = "#1b2a6b";
export const COR_AZUL_SUAVE = "#6e8cf5";
export const COR_AZUL_CLARO = "#cdd9ff";
export const COR_LAVANDA = "#c7b9ff";
export const COR_MENTA = "#6fe3c1";
export const COR_MENTA_CLARA = "#cff3e2";
export const COR_TEXTO = "#14183a";
export const COR_BRANCO = "#ffffff";
export const COR_CONTORNO = "#14183a";

// Tipografia (Plus Jakarta Sans, arquivo local em public/anuncio/fonts)
export const NOME_FONTE = "Plus Jakarta Sans";
export const FONTE = `"${NOME_FONTE}", "Helvetica Neue", Arial, sans-serif`;

// Legendas palavra por palavra
export const LEGENDA_Y = 1650;
export const LEGENDA_TAMANHO = 108;

// Cenas (segundos do vídeo)
export const CENA_CAMPUS = { inicio: 0, fim: 4 };
export const CENA_SALA = { inicio: 4, fim: 6.5 };
export const CENA_BIBLIOTECA = { inicio: 6.5, fim: 8.4 };
export const CENA_NOTIFICACAO = { inicio: 8.4, fim: 10 };
export const CENA_FORMATURA = { inicio: 10, fim: 13 };
export const CENA_GRAFICO = { inicio: 13, fim: 16 };
export const CENA_CAMINHADA = { inicio: 16, fim: 18.3 };
export const CENA_FINAL = { inicio: 18.3, fim: 22 };

// Textos
export const TEXTO_TITULO_1 = "ESTUDE";
export const TEXTO_TITULO_2 = "NO REINO UNIDO";
export const TEXTO_BENEFICIO_1 = "FINANCIAMENTO DA FACULDADE";
export const TEXTO_BENEFICIO_2 = "APOIO PARA CUSTOS DE VIDA";
export const TEXTO_PAGAMENTO_1 = "PAGAMENTO BASEADO";
export const TEXTO_PAGAMENTO_2 = "NA SUA RENDA";
export const TEXTO_MARCA = "STUDENT ADVISOR";
export const TEXTO_ELEGIVEL = "DESCUBRA SE VOCÊ É ELEGÍVEL";
export const TEXTO_CONTATO = "ENTRE EM CONTATO!";
export const NOTA_ELEGIBILIDADE = "Sujeito aos critérios de elegibilidade do Student Finance England.";

// Áudio
export const ARQUIVO_NARRACAO = "anuncio/narracao-v2.mp3";
export const ARQUIVO_MUSICA = "estudar/musica.mp3";
export const VOLUME_MUSICA = 0.08;
export const SOM_TRANSICAO = "sfx/whoosh.wav";
export const SOM_ITEM = "sfx/pop.wav";
export const SOM_CLIQUE = "sfx/clique.wav";
export const SOM_CONCLUSAO = "sfx/ding.wav";

// Carrega a fonte local antes do render. Sem isso, o Remotion usaria a fonte padrão.
loadFont({
  family: NOME_FONTE,
  url: staticFile("anuncio/fonts/plus-jakarta-sans-latin-800-normal.woff2"),
  weight: "800",
});

export const seg = (s: number) => Math.round(s * FPS);
