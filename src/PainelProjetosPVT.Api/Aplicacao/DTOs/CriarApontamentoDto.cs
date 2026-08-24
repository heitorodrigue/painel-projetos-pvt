namespace PainelProjetosPVT.Api.Aplicacao.DTOs;

public class CriarApontamentoDto
{
    public int AnalistaId { get; set; }

    public DateOnly Data { get; set; }

    public decimal QuantidadeHoras { get; set; }

    public string Descricao { get; set; } = string.Empty;
}