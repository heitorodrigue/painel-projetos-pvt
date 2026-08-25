export type StatusApontamento =
  | "Pendente"
  | "Aprovado"
  | "Rejeitado";

export interface Apontamento {
  id: number;
  projetoId: number;
  analistaId: number;
  data: string;
  quantidadeHoras: number;
  descricao: string;
  status: StatusApontamento;
}

export interface CriarApontamento {
  analistaId: number;
  data: string;
  quantidadeHoras: number;
  descricao: string;
}