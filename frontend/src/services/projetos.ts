import { api } from "./api";
import type { Projeto } from "../types/projeto";

export async function listarProjetos(): Promise<Projeto[]> {
  const response = await api.get<Projeto[]>("/projetos");

  return response.data;
}

export async function buscarProjeto(id: number): Promise<Projeto> {
  const response = await api.get<Projeto>(`/projetos/${id}`);

  return response.data;
}