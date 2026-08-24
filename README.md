# 📊 Painel de Projetos PVT

Sistema para acompanhar a situação de projetos usando horas planejadas, horas vendidas e horas já realizadas.

Esse projeto foi desenvolvido como case técnico para a vaga de **DEV Web e Infraestrutura JR da PVT Software**.

A ideia aqui não foi tentar construir um sistema completo. Preferi focar mais na modelagem, nas regras de negócio e em uma pequena parte funcionando de ponta a ponta.

---

# ✨ Funcionalidades

- Listagem dos projetos com seus indicadores
- Consulta de um projeto específico
- Criação de apontamentos
- Aprovação ou rejeição de apontamentos
- Atualização dos indicadores após um apontamento ser aprovado
- Classificação do projeto como Saudável, Atenção ou Crítico

---

# 📋 Regras de Negócio

- Cada projeto pertence a um cliente.
- Um projeto possui horas vendidas e horas planejadas.
- Apenas analistas ativos podem registrar apontamentos.
- A quantidade de horas deve ser maior que zero.
- Todo novo apontamento começa como `Pendente`.
- Apenas apontamentos `Aprovados` entram no cálculo das horas realizadas.
- Um apontamento pendente pode ser aprovado ou rejeitado.
- Depois de aprovado ou rejeitado, ele não pode ter o status alterado novamente.

## Saúde do projeto

O projeto é analisado por dois indicadores:

- **Consumo planejado:** horas realizadas / horas planejadas
- **Consumo contratado:** horas realizadas / horas vendidas

| Status   | Regra                                |
| -------- | ------------------------------------ |
| Saudável | Os dois consumos estão abaixo de 90% |
| Atenção  | Pelo menos um consumo chegou a 90%   |
| Crítico  | Pelo menos um consumo chegou a 100%  |

Os valores de 90% e 100% são regras iniciais. Em um sistema real, eu deixaria isso configurável dependendo do projeto ou contrato.

---

# 🏛 Modelagem

O domínio possui cinco entidades principais:

```text
Cliente
   └── Projetos

Projeto
   ├── Cliente
   ├── Alocações
   └── Apontamentos

Analista
   ├── Alocações
   └── Apontamentos
```

### Cliente

Representa a empresa dona do projeto.

### Projeto

É a entidade principal do sistema.

Guarda informações como cliente, horas vendidas, horas planejadas, período previsto e os apontamentos realizados.

Separei `HorasVendidas` de `HorasPlanejadas` porque elas representam coisas diferentes. As horas vendidas mostram o limite contratado pelo cliente, enquanto as horas planejadas mostram a estimativa interna para executar o projeto.

Isso ajuda a responder duas perguntas diferentes:

- Estamos gastando mais esforço do que planejamos?
- Estamos perto de consumir todas as horas vendidas?

### Analista

Representa quem trabalha nos projetos e registra os apontamentos.

### Alocação

Representa a participação planejada de um analista em um projeto.

Ela ainda não influencia diretamente os indicadores. Mantive essa entidade porque, com mais tempo, ela poderia ser usada para analisar capacidade e sobrecarga dos analistas.

### Apontamento

Representa um registro de horas trabalhadas.

O fluxo é simples:

```text
Pendente
   ├── Aprovado
   └── Rejeitado
```

Só apontamentos aprovados entram nos cálculos do projeto.

---

# 🛠 Tecnologias

- ASP.NET Core Web API (.NET 9)
- Entity Framework Core 9
- SQLite
- Swagger / Swashbuckle

---

# 📂 Estrutura do Projeto

```text
src/
└── PainelProjetosPVT.Api/
    ├── Aplicacao/
    │   ├── DTOs/
    │   └── Servicos/
    │
    ├── Controllers/
    │
    ├── Dominio/
    │   ├── Entidades/
    │   └── Enums/
    │
    └── Infraestrutura/
        ├── Integracoes/
        └── Persistencia/
```

---

# 🏛 Arquitetura

Mantive a arquitetura simples:

- **Controllers:** recebem as requisições.
- **Aplicacao:** contém DTOs e serviços.
- **Dominio:** contém as entidades e regras principais.
- **Infraestrutura:** cuida da persistência e deixa espaço para futuras integrações.

Pensei em adicionar mais padrões e camadas, mas não faria sentido para o tamanho atual do projeto.

Por isso não usei CQRS, MediatR ou Repository Pattern. O `DbContext` já resolve bem a persistência nessa versão e adicionar mais abstrações só aumentaria o código.

---

# 🌐 Endpoints

| Método | Endpoint                          | Descrição                            |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/api/projetos`                   | Lista os projetos e seus indicadores |
| GET    | `/api/projetos/{id}`              | Busca um projeto                     |
| POST   | `/api/projetos/{id}/apontamentos` | Cria um apontamento                  |
| PATCH  | `/api/apontamentos/{id}/status`   | Aprova ou rejeita um apontamento     |

## Criar apontamento

```json
{
  "analistaId": 1,
  "data": "2026-08-24",
  "quantidadeHoras": 2,
  "descricao": "Implementação da funcionalidade"
}
```

Todo novo apontamento começa como `Pendente`.

## Alterar status

```json
{
  "status": "Aprovado"
}
```

Depois de aprovado, as horas passam a entrar nos indicadores do projeto.

---

# 💡 Decisões Técnicas

## Por que não usei avanço físico?

Inicialmente, eu tinha pensado em calcular o avanço físico usando as horas realizadas.

Depois percebi que isso não era uma boa representação. Um projeto pode ter consumido 80% das horas e entregue apenas 40% do que precisava ser entregue. Nesse caso, dizer que o projeto está com 80% de avanço físico seria enganoso.

Por isso preferi mudar os indicadores para consumo planejado e consumo contratado. Esses valores representam exatamente o que os dados disponíveis conseguem medir.

Se tivesse mais tempo, adicionaria marcos ou entregas ao projeto para calcular o avanço físico de verdade.

## SQLite

Escolhi SQLite porque o objetivo era deixar o projeto fácil de rodar e testar.

Para um sistema real com mais usuários e acessos simultâneos, eu migraria para PostgreSQL ou SQL Server.

## Cálculo dos indicadores

Hoje os apontamentos são carregados junto com o projeto e os cálculos são feitos no serviço.

Para o tamanho do case, isso é suficiente.

Com um volume maior de dados, eu provavelmente faria agregações no banco e criaria consultas específicas para o painel.

---

# 🚀 O que eu faria depois

Se tivesse mais tempo, as próximas melhorias seriam:

- Testes automatizados para as regras de saúde
- Autenticação e autorização
- Filtros e paginação
- Configuração dos limites de saúde
- Análise de capacidade usando as alocações
- Marcos ou entregas para medir avanço físico real
- Logs e métricas
- Integrações com sistemas externos
- Migração para PostgreSQL ou SQL Server

Para integrações externas, também pensaria em timeout, retry e circuit breaker para evitar que a indisponibilidade de outro sistema derrubasse o fluxo principal.

---

# ▶️ Como Executar

```bash
dotnet restore
dotnet run --project src/PainelProjetosPVT.Api
```

O projeto utiliza SQLite e cria dados iniciais automaticamente.

Existem três cenários para demonstrar os indicadores:

- Projeto saudável
- Projeto em atenção
- Projeto crítico

Depois de iniciar a aplicação, o Swagger pode ser usado para testar os endpoints.

---

# 👨‍💻 Autor

**Heitor Rodrigues Araujo**

Desenvolvido como case técnico para o processo seletivo da PVT Software.
