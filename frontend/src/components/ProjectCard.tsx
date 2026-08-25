import type { Projeto } from "../types/projeto";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

interface ProjectCardProps {
  projeto: Projeto;
  onClick: () => void;
}

function formatarHoras(valor: number) {
  return `${valor.toLocaleString("pt-BR")}h`;
}

export default function ProjectCard({
  projeto,
  onClick,
}: ProjectCardProps) {
  return (
    <article className="project-card" onClick={onClick}>
      <div className="project-header">
        <div>
          <span className="project-code">
            {projeto.codigoExterno}
          </span>

          <h2>{projeto.nome}</h2>

          <p className="project-client">
            {projeto.cliente}
          </p>
        </div>

        <StatusBadge status={projeto.status} />
      </div>

      <div className="project-metrics">
        <div className="metric">
          <div className="metric-label">
            <span>Consumo planejado</span>
            <strong>
              {projeto.percentualConsumoPlanejado.toFixed(2)}%
            </strong>
          </div>

          <ProgressBar
            percentage={projeto.percentualConsumoPlanejado}
          />
        </div>

        <div className="metric">
          <div className="metric-label">
            <span>Consumo contratado</span>
            <strong>
              {projeto.percentualConsumoContratado.toFixed(2)}%
            </strong>
          </div>

          <ProgressBar
            percentage={projeto.percentualConsumoContratado}
          />
        </div>
      </div>

      <div className="project-footer">
        <div>
          <span>Realizadas</span>
          <strong>{formatarHoras(projeto.horasRealizadas)}</strong>
        </div>

        <div>
          <span>Planejadas</span>
          <strong>{formatarHoras(projeto.horasPlanejadas)}</strong>
        </div>

        <div>
          <span>Vendidas</span>
          <strong>{formatarHoras(projeto.horasVendidas)}</strong>
        </div>
      </div>
    </article>
  );
}