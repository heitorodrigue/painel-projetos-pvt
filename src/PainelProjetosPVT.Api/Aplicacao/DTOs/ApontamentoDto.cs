using PainelProjetosPVT.Api.Dominio.Enums; 
namespace PainelProjetosPVT.Api.Aplicacao.DTOs; 
public class ApontamentoDto
{
    public int Id { get; set; }
    public int ProjetoId { get; set; }
    public int AnalistaId { get; set; }
    public DateOnly Data { get; set; }
    public decimal QuantidadeHoras { get; set; }
    public string? Descricao { get; set; }
    public StatusApontamento Status { get; set; }
}