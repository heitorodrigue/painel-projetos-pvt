namespace PainelProjetosPVT.Api.Dominio.Entidades;

public class Alocacao
{
    public int Id { get; set; }

    public int ProjetoId { get; set; }

    public Projeto Projeto { get; set; } = null!;

    public int AnalistaId { get; set; }

    public Analista Analista { get; set; } = null!;

    public DateOnly DataInicio { get; set; }

    public DateOnly? DataFim { get; set; }

    public decimal HorasPlanejadas { get; set; }
}