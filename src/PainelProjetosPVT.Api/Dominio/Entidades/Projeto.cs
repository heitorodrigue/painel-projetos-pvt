namespace PainelProjetosPVT.Api.Dominio.Entidades;

public class Projeto
{
    public int Id { get; set; }

    public string CodigoExterno { get; set; } = string.Empty;

    public string Nome { get; set; } = string.Empty;

    public int ClienteId { get; set; }

    public Cliente Cliente { get; set; } = null!;

    public decimal HorasVendidas { get; set; }

    public decimal HorasPlanejadas { get; set; }

    public DateOnly DataInicio { get; set; }

    public DateOnly DataFimPrevista { get; set; }

    public List<Alocacao> Alocacoes { get; set; } = [];

    public List<Apontamento> Apontamentos { get; set; } = [];
}