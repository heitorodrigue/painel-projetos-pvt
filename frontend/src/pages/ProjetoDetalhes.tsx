import { useEffect, useState, useCallback } from "react";

import type { Projeto } from "../types/projeto";
import type {
  Apontamento,
  CriarApontamento,
} from "../types/apontamento";

import { buscarProjeto } from "../services/projetos";

import {
  listarApontamentos,
  criarApontamento,
  atualizarStatusApontamento,
} from "../services/apontamentos";

import StatusBadge from "../components/StatusBadge";
import ProgressBar from "../components/ProgressBar";

interface ProjetoDetalhesProps {
  projetoId: number;
  onVoltar: () => void;
}

function formatarHoras(valor: number) {
  return `${valor.toLocaleString("pt-BR")}h`;
}

function formatarData(data: string) {
  return new Date(`${data}T00:00:00`).toLocaleDateString("pt-BR");
}

function criarFormularioInicial(): CriarApontamento {
  return {
    analistaId: 1,
    data: new Date().toISOString().split("T")[0],
    quantidadeHoras: 1,
    descricao: "",
  };
}

export default function ProjetoDetalhes({
  projetoId,
  onVoltar,
}: ProjetoDetalhesProps) {
  const [projeto, setProjeto] = useState<Projeto | null>(null);

  const [apontamentos, setApontamentos] = useState<Apontamento[]>([]);

  const [carregando, setCarregando] = useState(true);

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");

  const [enviando, setEnviando] = useState(false);

  const [atualizandoApontamentoId, setAtualizandoApontamentoId] =
    useState<number | null>(null);

  const [formulario, setFormulario] =
    useState<CriarApontamento>(criarFormularioInicial);

  const buscarDados = useCallback(async () => {
    const [dadosProjeto, dadosApontamentos] =
      await Promise.all([
        buscarProjeto(projetoId),
        listarApontamentos(projetoId),
      ]);

    return {
      dadosProjeto,
      dadosApontamentos,
    };
  }, [projetoId]);

  async function recarregarDados() {
    const {
      dadosProjeto,
      dadosApontamentos,
    } = await buscarDados();

    setProjeto(dadosProjeto);
    setApontamentos(dadosApontamentos);
  }

  useEffect(() => {
    async function carregarDadosIniciais() {
      try {
        setCarregando(true);
        setErro("");

        const {
          dadosProjeto,
          dadosApontamentos,
        } = await buscarDados();

        setProjeto(dadosProjeto);
        setApontamentos(dadosApontamentos);
      } catch (error) {
        console.error(error);

        setErro(
          "Não foi possível carregar os dados do projeto.",
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDadosIniciais();
  }, [buscarDados]);

  async function handleCriarApontamento(
    event: React.SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (!formulario.descricao.trim()) {
      setErro(
        "Informe uma descrição para o apontamento.",
      );

      return;
    }

    try {
      setEnviando(true);

      await criarApontamento(
        projetoId,
        formulario,
      );

      setFormulario(criarFormularioInicial());

      await recarregarDados();

      setSucesso(
        "Apontamento registrado com sucesso.",
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível registrar o apontamento.",
      );
    } finally {
      setEnviando(false);
    }
  }

  async function handleAtualizarStatus(
    apontamentoId: number,
    status: "Aprovado" | "Rejeitado",
  ) {
    setErro("");
    setSucesso("");

    try {
      setAtualizandoApontamentoId(
        apontamentoId,
      );

      await atualizarStatusApontamento(
        apontamentoId,
        status,
      );

      await recarregarDados();

      setSucesso(
        status === "Aprovado"
          ? "Apontamento aprovado com sucesso."
          : "Apontamento rejeitado com sucesso.",
      );
    } catch (error) {
      console.error(error);

      setErro(
        "Não foi possível atualizar o status do apontamento.",
      );
    } finally {
      setAtualizandoApontamentoId(null);
    }
  }

  if (carregando) {
    return (
      <div className="page-state">
        <div className="loading-state">
          <span className="loading-spinner" />

          <p>Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (erro && !projeto) {
    return (
      <div className="page-state error">
        <div>
          <p>{erro}</p>

          <button
            className="retry-button"
            onClick={onVoltar}
          >
            Voltar para projetos
          </button>
        </div>
      </div>
    );
  }

  if (!projeto) {
    return (
      <div className="page-state error">
        <div>
          <p>Projeto não encontrado.</p>

          <button
            className="retry-button"
            onClick={onVoltar}
          >
            Voltar para projetos
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="project-details">
      <button
        className="back-button"
        onClick={onVoltar}
      >
        ← Voltar para projetos
      </button>

      <header className="details-header">
        <div>
          <span className="project-code">
            {projeto.codigoExterno}
          </span>

          <h1>{projeto.nome}</h1>

          <p>{projeto.cliente}</p>
        </div>

        <StatusBadge status={projeto.status} />
      </header>

      {(erro || sucesso) && (
        <div className="feedback-container">
          {erro && (
            <div className="feedback-message feedback-error">
              <span>{erro}</span>

              <button
                type="button"
                onClick={() => setErro("")}
                aria-label="Fechar mensagem de erro"
              >
                ×
              </button>
            </div>
          )}

          {sucesso && (
            <div className="feedback-message feedback-success">
              <span>{sucesso}</span>

              <button
                type="button"
                onClick={() => setSucesso("")}
                aria-label="Fechar mensagem de sucesso"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      <section className="details-grid">
        <div className="details-card">
          <span>Horas realizadas</span>

          <strong>
            {formatarHoras(
              projeto.horasRealizadas,
            )}
          </strong>
        </div>

        <div className="details-card">
          <span>Horas planejadas</span>

          <strong>
            {formatarHoras(
              projeto.horasPlanejadas,
            )}
          </strong>
        </div>

        <div className="details-card">
          <span>Horas vendidas</span>

          <strong>
            {formatarHoras(
              projeto.horasVendidas,
            )}
          </strong>
        </div>

        <div className="details-card">
          <span>Saldo planejado</span>

          <strong>
            {formatarHoras(
              projeto.saldoHorasPlanejadas,
            )}
          </strong>
        </div>

        <div className="details-card">
          <span>Saldo contratado</span>

          <strong>
            {formatarHoras(
              projeto.saldoHorasContratadas,
            )}
          </strong>
        </div>
      </section>

      <section className="consumption-section">
        <h2>Consumo do projeto</h2>

        <div className="consumption-item">
          <div className="metric-label">
            <span>Consumo planejado</span>

            <strong>
              {projeto.percentualConsumoPlanejado.toFixed(
                2,
              )}
              %
            </strong>
          </div>

          <ProgressBar
            percentage={
              projeto.percentualConsumoPlanejado
            }
          />
        </div>

        <div className="consumption-item">
          <div className="metric-label">
            <span>Consumo contratado</span>

            <strong>
              {projeto.percentualConsumoContratado.toFixed(
                2,
              )}
              %
            </strong>
          </div>

          <ProgressBar
            percentage={
              projeto.percentualConsumoContratado
            }
          />
        </div>
      </section>

      <section className="apontamentos-layout">
        <div className="apontamentos-list">
          <div className="section-header">
            <div>
              <h2>Apontamentos</h2>

              <p>
                Registros de horas vinculados ao projeto.
              </p>
            </div>
          </div>

          {apontamentos.length === 0 ? (
            <div className="empty-state">
              <p>
                Nenhum apontamento encontrado para este
                projeto.
              </p>
            </div>
          ) : (
            apontamentos.map((apontamento) => {
              const atualizando =
                atualizandoApontamentoId ===
                apontamento.id;

              const existeOutraAtualizacao =
                atualizandoApontamentoId !== null &&
                !atualizando;

              return (
                <article
                  className="apontamento-card"
                  key={apontamento.id}
                >
                  <div className="apontamento-header">
                    <div>
                      <strong>
                        {formatarData(
                          apontamento.data,
                        )}
                      </strong>

                      <span>
                        {apontamento.quantidadeHoras}h
                      </span>
                    </div>

                    <span
                      className={`apontamento-status status-${apontamento.status.toLowerCase()}`}
                    >
                      {apontamento.status}
                    </span>
                  </div>

                  <p>
                    {apontamento.descricao}
                  </p>

                  {apontamento.status ===
                    "Pendente" && (
                    <div className="apontamento-actions">
                      <button
                        type="button"
                        className="approve-button"
                        disabled={
                          atualizando ||
                          existeOutraAtualizacao
                        }
                        onClick={() =>
                          handleAtualizarStatus(
                            apontamento.id,
                            "Aprovado",
                          )
                        }
                      >
                        {atualizando
                          ? "Atualizando..."
                          : "Aprovar"}
                      </button>

                      <button
                        type="button"
                        className="reject-button"
                        disabled={
                          atualizando ||
                          existeOutraAtualizacao
                        }
                        onClick={() =>
                          handleAtualizarStatus(
                            apontamento.id,
                            "Rejeitado",
                          )
                        }
                      >
                        {atualizando
                          ? "Atualizando..."
                          : "Rejeitar"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        <aside className="form-card">
          <h2>Novo apontamento</h2>

          <p>
            Registre as horas trabalhadas neste projeto.
          </p>

          <div className="analista-info">
            <span>Analista responsável</span>

            <strong>
              Analista ID 1
            </strong>
          </div>

          <form onSubmit={handleCriarApontamento}>
            <label>
              Data

              <input
                type="date"
                value={formulario.data}
                disabled={enviando}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    data: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Quantidade de horas

              <input
                type="number"
                min="1"
                step="0.5"
                value={
                  formulario.quantidadeHoras
                }
                disabled={enviando}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    quantidadeHoras: Number(
                      event.target.value,
                    ),
                  })
                }
              />
            </label>

            <label>
              Descrição

              <textarea
                rows={4}
                value={formulario.descricao}
                disabled={enviando}
                onChange={(event) =>
                  setFormulario({
                    ...formulario,
                    descricao: event.target.value,
                  })
                }
                placeholder="Descreva a atividade realizada"
              />
            </label>

            <button
              className="submit-button"
              type="submit"
              disabled={enviando}
            >
              {enviando
                ? "Registrando..."
                : "Registrar apontamento"}
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}