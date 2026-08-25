import { useEffect, useState } from "react";
import type { Projeto } from "../types/projeto";
import { listarProjetos } from "../services/projetos";
import ProjectCard from "../components/ProjectCard";

interface DashboardProps {
  onSelecionarProjeto: (id: number) => void;
}

export default function Dashboard({
  onSelecionarProjeto,
}: DashboardProps) {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarProjetos() {
      try {
        const dados = await listarProjetos();
        setProjetos(dados);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os projetos.");
      } finally {
        setCarregando(false);
      }
    }

    carregarProjetos();
  }, []);

  const saudaveis = projetos.filter(
    (p) => p.status === "Saudavel"
  ).length;

  const atencao = projetos.filter(
    (p) => p.status === "Atencao"
  ).length;

  const criticos = projetos.filter(
    (p) => p.status === "Critico"
  ).length;

  if (carregando) {
    return (
      <div className="page-state">
        <p>Carregando projetos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="page-state error">
        <p>{erro}</p>
      </div>
    );
  }

  return (
    <main className="dashboard">
      <header className="page-header">
        <div>
          <span className="eyebrow">GESTÃO DE PROJETOS</span>
          <h1>Painel de Projetos</h1>
          <p>
            Acompanhe o consumo de horas e a situação dos projetos.
          </p>
        </div>

        <div className="project-count">
          <strong>{projetos.length}</strong>
          <span>projetos</span>
        </div>
      </header>

      <section className="summary-grid">
        <div className="summary-card">
          <span>Total de projetos</span>
          <strong>{projetos.length}</strong>
        </div>

        <div className="summary-card healthy">
          <span>Saudáveis</span>
          <strong>{saudaveis}</strong>
        </div>

        <div className="summary-card attention">
          <span>Atenção</span>
          <strong>{atencao}</strong>
        </div>

        <div className="summary-card critical">
          <span>Críticos</span>
          <strong>{criticos}</strong>
        </div>
      </section>

      <section className="projects-section">
        <div className="section-header">
          <div>
            <h2>Projetos</h2>
            <p>Visão geral dos indicadores de cada projeto.</p>
          </div>
        </div>

        <div className="projects-grid">
          {projetos.map((projeto) => (
            <ProjectCard
              key={projeto.id}
              projeto={projeto}
              onClick={() => onSelecionarProjeto(projeto.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}