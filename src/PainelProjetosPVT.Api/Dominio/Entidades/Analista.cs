namespace PainelProjetosPVT.Api.Dominio.Entidades;

public class Analista
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public bool Ativo { get; set; } = true;

    public List<Alocacao> Alocacoes { get; set; } = [];

    public List<Apontamento> Apontamentos { get; set; } = [];
}