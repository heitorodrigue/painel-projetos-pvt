using PainelProjetosPVT.Api.Dominio.Entidades;
using PainelProjetosPVT.Api.Dominio.Enums;

namespace PainelProjetosPVT.Api.Infraestrutura.Persistencia;

public static class InicializadorBanco
{
    public static void Inicializar(ContextoBanco contexto)
    {
        contexto.Database.EnsureCreated();

        if (contexto.Projetos.Any())
        {
            return;
        }

        var cliente1 = new Cliente
        {
            Nome = "Empresa Alpha",
            Documento = "12.345.678/0001-01"
        };

        var cliente2 = new Cliente
        {
            Nome = "Empresa Beta",
            Documento = "98.765.432/0001-10"
        };

        var analista1 = new Analista
        {
            Nome = "João Silva",
            Email = "joao@pvt.com",
            Ativo = true
        };

        var analista2 = new Analista
        {
            Nome = "Maria Santos",
            Email = "maria@pvt.com",
            Ativo = true
        };

        var projetos = new List<Projeto>
        {
            new()
            {
                CodigoExterno = "RM-001",
                Nome = "Implantação ERP",
                Cliente = cliente1,
                HorasVendidas = 1000,
                HorasPlanejadas = 900,
                DataInicio = new DateOnly(2026, 1, 10),
                DataFimPrevista = new DateOnly(2026, 8, 30)
            },
            new()
            {
                CodigoExterno = "RM-002",
                Nome = "Migração de Dados",
                Cliente = cliente1,
                HorasVendidas = 500,
                HorasPlanejadas = 450,
                DataInicio = new DateOnly(2026, 2, 1),
                DataFimPrevista = new DateOnly(2026, 7, 31)
            },
            new()
            {
                CodigoExterno = "RM-003",
                Nome = "Integração de Sistemas",
                Cliente = cliente2,
                HorasVendidas = 300,
                HorasPlanejadas = 280,
                DataInicio = new DateOnly(2026, 3, 1),
                DataFimPrevista = new DateOnly(2026, 6, 30)
            }
        };

        contexto.Projetos.AddRange(projetos);

        contexto.SaveChanges();

        var apontamentos = new List<Apontamento>
        {
            new()
            {
                ProjetoId = projetos[0].Id,
                Analista = analista1,
                Data = new DateOnly(2026, 5, 10),
                QuantidadeHoras = 600,
                Descricao = "Horas realizadas no projeto",
                Status = StatusApontamento.Aprovado
            },

            new()
            {
                ProjetoId = projetos[1].Id,
                Analista = analista2,
                Data = new DateOnly(2026, 5, 15),
                QuantidadeHoras = 430,
                Descricao = "Horas realizadas no projeto",
                Status = StatusApontamento.Aprovado
            },

            new()
            {
                ProjetoId = projetos[2].Id,
                Analista = analista1,
                Data = new DateOnly(2026, 5, 20),
                QuantidadeHoras = 320,
                Descricao = "Horas realizadas no projeto",
                Status = StatusApontamento.Aprovado
            }
        };

        contexto.Apontamentos.AddRange(apontamentos);

        contexto.SaveChanges();
    }
}