import type { StatusProjeto } from "../types/projeto";

interface StatusBadgeProps {
  status: StatusProjeto;
}

const statusConfig = {
  Saudavel: {
    label: "Saudável",
    className: "status-badge status-saude",
  },
  Atencao: {
    label: "Atenção",
    className: "status-badge status-atencao",
  },
  Critico: {
    label: "Crítico",
    className: "status-badge status-critico",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={config.className}>
      {config.label}
    </span>
  );
}