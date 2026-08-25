export type StatusProjeto = "Saudavel" | "Atencao" | "Critico";

export interface Projeto {
  id: number;
  codigoExterno: string;
  nome: string;
  cliente: string;
  horasVendidas: number;
  horasPlanejadas: number;
  horasRealizadas: number;
  saldoHorasPlanejadas: number;
  saldoHorasContratadas: number;
  percentualConsumoPlanejado: number;
  percentualConsumoContratado: number;
  status: StatusProjeto;
}