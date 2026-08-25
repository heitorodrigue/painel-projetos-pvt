import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import ProjetoDetalhes from "./pages/ProjetoDetalhes";

function App() {
  const [projetoSelecionado, setProjetoSelecionado] =
    useState<number | null>(null);

  if (projetoSelecionado !== null) {
    return (
      <ProjetoDetalhes
        projetoId={projetoSelecionado}
        onVoltar={() => setProjetoSelecionado(null)}
      />
    );
  }

  return (
    <Dashboard
      onSelecionarProjeto={setProjetoSelecionado}
    />
  );
}

export default App;