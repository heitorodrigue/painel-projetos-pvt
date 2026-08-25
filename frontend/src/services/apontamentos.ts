import { api } from "./api";
import type {
  Apontamento,
  CriarApontamento,
  StatusApontamento,
} from "../types/apontamento";

export async function listarApontamentos(
  projetoId: number,
): Promise<Apontamento[]> {
  const response = await api.get<Apontamento[]>(
    `/projetos/${projetoId}/apontamentos`,
  );

  return response.data;
}

export async function criarApontamento(
  projetoId: number,
  dados: CriarApontamento,
): Promise<Apontamento> {
  const response = await api.post<Apontamento>(
    `/projetos/${projetoId}/apontamentos`,
    dados,
  );

  return response.data;
}

export async function atualizarStatusApontamento(
  apontamentoId: number,
  status: Exclude<StatusApontamento, "Pendente">,
): Promise<void> {
  await api.patch(`/apontamentos/${apontamentoId}/status`, {
    status,
  });
}