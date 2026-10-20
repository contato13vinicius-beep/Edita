// Tempos das palavras da narração (segundos no vídeo).
// Gerado a partir do áudio real: a fala é distribuída pelas sílabas de cada palavra.
// Aproximação: para sincronia exata, usar uma narração com marcas de tempo por palavra.
export type Palavra = { w: string; t: number; d: number; destaque: boolean };

export const PALAVRAS_CENA_1: Palavra[] = [
  { w: "Você", t: 0.120, d: 0.229, destaque: false },
  { w: "sabia", t: 0.349, d: 0.229, destaque: false },
  { w: "que", t: 0.579, d: 0.115, destaque: false },
  { w: "pode", t: 0.694, d: 0.229, destaque: false },
  { w: "estudar", t: 0.923, d: 0.344, destaque: false },
  { w: "numa", t: 1.267, d: 0.229, destaque: false },
  { w: "universidade", t: 1.496, d: 0.688, destaque: true },
  { w: "no", t: 2.185, d: 0.115, destaque: false },
  { w: "Reino", t: 2.299, d: 0.229, destaque: false },
  { w: "Unido", t: 2.529, d: 0.344, destaque: false },
  { w: "com", t: 2.873, d: 0.115, destaque: false },
  { w: "financiamento", t: 2.988, d: 0.574, destaque: true },
  { w: "do", t: 3.561, d: 0.115, destaque: false },
  { w: "governo", t: 3.676, d: 0.344, destaque: true },
];
