using PainelProjetosPVT.Api.Dominio.Enums;

namespace PainelProjetosPVT.Api.Aplicacao.DTOs;

public class ResumoProjetoDto
{
    public int Id { get; set; }

    public string CodigoExterno { get; set; } = string.Empty;

    public string Nome { get; set; } = string.Empty;

    public string Cliente { get; set; } = string.Empty;

    public decimal HorasVendidas { get; set; }

    public decimal HorasPlanejadas { get; set; }

    public decimal HorasRealizadas { get; set; }

    public decimal SaldoHorasPlanejadas { get; set; }

    public decimal SaldoHorasContratadas { get; set; }

    public decimal PercentualConsumoPlanejado { get; set; }

    public decimal PercentualConsumoContratado { get; set; }

    public StatusProjeto Status { get; set; }
}