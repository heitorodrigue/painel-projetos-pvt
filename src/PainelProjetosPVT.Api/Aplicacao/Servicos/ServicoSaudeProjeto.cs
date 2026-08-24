using PainelProjetosPVT.Api.Aplicacao.DTOs;
using PainelProjetosPVT.Api.Dominio.Entidades;
using PainelProjetosPVT.Api.Dominio.Enums;

namespace PainelProjetosPVT.Api.Aplicacao.Servicos;

public class ServicoSaudeProjeto
{
    public ResumoProjetoDto CalcularResumo(Projeto projeto)
    {
        var horasRealizadas = projeto.Apontamentos
            .Where(apontamento =>
                apontamento.Status == StatusApontamento.Aprovado)
            .Sum(apontamento => apontamento.QuantidadeHoras);

        var consumoPlanejado = projeto.HorasPlanejadas > 0
            ? horasRealizadas / projeto.HorasPlanejadas
            : 0;

        var consumoContratado = projeto.HorasVendidas > 0
            ? horasRealizadas / projeto.HorasVendidas
            : 0;

        var status = CalcularStatus(
            consumoPlanejado,
            consumoContratado);

        return new ResumoProjetoDto
        {
            Id = projeto.Id,
            CodigoExterno = projeto.CodigoExterno,
            Nome = projeto.Nome,
            Cliente = projeto.Cliente.Nome,
            HorasVendidas = projeto.HorasVendidas,
            HorasPlanejadas = projeto.HorasPlanejadas,
            HorasRealizadas = horasRealizadas,
            SaldoHorasPlanejadas =
                projeto.HorasPlanejadas - horasRealizadas,
            SaldoHorasContratadas =
                projeto.HorasVendidas - horasRealizadas,
            PercentualConsumoPlanejado =
                Math.Round(consumoPlanejado * 100, 2),
            PercentualConsumoContratado =
                Math.Round(consumoContratado * 100, 2),
            Status = status
        };
    }

    private static StatusProjeto CalcularStatus(
        decimal consumoPlanejado,
        decimal consumoContratado)
    {
        if (consumoPlanejado >= 1 ||
            consumoContratado >= 1)
        {
            return StatusProjeto.Critico;
        }

        if (consumoPlanejado >= 0.9m ||
            consumoContratado >= 0.9m)
        {
            return StatusProjeto.Atencao;
        }

        return StatusProjeto.Saudavel;
    }
}