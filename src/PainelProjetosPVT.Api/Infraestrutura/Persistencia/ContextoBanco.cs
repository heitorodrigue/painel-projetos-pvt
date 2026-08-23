using Microsoft.EntityFrameworkCore;
using PainelProjetosPVT.Api.Dominio.Entidades;
using System.Collections.Generic;

namespace PainelProjetosPVT.Api.Infraestrutura.Persistencia;

public class ContextoBanco : DbContext
{
    public ContextoBanco(DbContextOptions<ContextoBanco> options)
        : base(options)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();

    public DbSet<Projeto> Projetos => Set<Projeto>();

    public DbSet<Analista> Analistas => Set<Analista>();

    public DbSet<Alocacao> Alocacoes => Set<Alocacao>();

    public DbSet<Apontamento> Apontamentos => Set<Apontamento>();
}