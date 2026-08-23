using PainelProjetosPVT.Api.Dominio.Enums;

namespace PainelProjetosPVT.Api.Dominio.Entidades;

public class Apontamento
{
    public int Id { get; set; }

    public int ProjetoId { get; set; }

    public Projeto Projeto { get; set; } = null!;

    public int AnalistaId { get; set; }

    public Analista Analista { get; set; } = null!;

    public DateOnly Data { get; set; }

    public decimal QuantidadeHoras { get; set; }

    public string? Descricao { get; set; }

    public StatusApontamento Status { get; set; }
}