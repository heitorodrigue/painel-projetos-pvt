using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PainelProjetosPVT.Api.Aplicacao.DTOs;
using PainelProjetosPVT.Api.Aplicacao.Servicos;
using PainelProjetosPVT.Api.Dominio.Entidades;
using PainelProjetosPVT.Api.Dominio.Enums;
using PainelProjetosPVT.Api.Infraestrutura.Persistencia;

namespace PainelProjetosPVT.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjetosController : ControllerBase
{
    private readonly ContextoBanco _contexto;
    private readonly ServicoSaudeProjeto _servicoSaudeProjeto;

    public ProjetosController(
        ContextoBanco contexto,
        ServicoSaudeProjeto servicoSaudeProjeto)
    {
        _contexto = contexto;
        _servicoSaudeProjeto = servicoSaudeProjeto;
    }

    [HttpGet]
    public async Task<ActionResult<List<ResumoProjetoDto>>> Listar()
    {
        var projetos = await _contexto.Projetos
            .Include(projeto => projeto.Cliente)
            .Include(projeto => projeto.Apontamentos)
            .ToListAsync();

        var resumoProjetos = projetos
            .Select(_servicoSaudeProjeto.CalcularResumo)
            .ToList();

        return Ok(resumoProjetos);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ResumoProjetoDto>> ObterPorId(int id)
    {
        var projeto = await _contexto.Projetos
            .Include(projeto => projeto.Cliente)
            .Include(projeto => projeto.Apontamentos)
            .FirstOrDefaultAsync(projeto => projeto.Id == id);

        if (projeto is null)
        {
            return NotFound();
        }

        var resumo = _servicoSaudeProjeto.CalcularResumo(projeto);

        return Ok(resumo);
    }

    [HttpGet("{id:int}/apontamentos")]
    public async Task<ActionResult<List<ApontamentoDto>>> ListarApontamentos(int id)
    {
        var projetoExiste = await _contexto.Projetos
            .AnyAsync(projeto => projeto.Id == id);

        if (!projetoExiste)
        {
            return NotFound("Projeto não encontrado.");
        }

        var apontamentos = await _contexto.Apontamentos
            .Where(apontamento => apontamento.ProjetoId == id)
            .OrderByDescending(apontamento => apontamento.Data)
            .Select(apontamento => new ApontamentoDto
            {
                Id = apontamento.Id,
                ProjetoId = apontamento.ProjetoId,
                AnalistaId = apontamento.AnalistaId,
                Data = apontamento.Data,
                QuantidadeHoras = apontamento.QuantidadeHoras,
                Descricao = apontamento.Descricao,
                Status = apontamento.Status
            })
            .ToListAsync();

        return Ok(apontamentos);
    }

    [HttpPost("{id:int}/apontamentos")]
    public async Task<ActionResult> CriarApontamento(
    int id,
    CriarApontamentoDto dto)
    {
        var projeto = await _contexto.Projetos.FindAsync(id);

        if (projeto is null)
        {
            return NotFound("Projeto não encontrado.");
        }

        var analista = await _contexto.Analistas.FindAsync(dto.AnalistaId);

        if (analista is null)
        {
            return BadRequest("Analista não encontrado.");
        }

        if (!analista.Ativo)
        {
            return BadRequest("Analista está inativo.");
        }

        if (dto.QuantidadeHoras <= 0)
        {
            return BadRequest("A quantidade de horas deve ser maior que zero.");
        }

        var apontamento = new Apontamento
        {
            ProjetoId = projeto.Id,
            AnalistaId = analista.Id,
            Data = dto.Data,
            QuantidadeHoras = dto.QuantidadeHoras,
            Descricao = dto.Descricao,
            Status = StatusApontamento.Pendente
        };

        _contexto.Apontamentos.Add(apontamento);

        await _contexto.SaveChangesAsync();

        var apontamentoDto = new ApontamentoDto
        {
            Id = apontamento.Id,
            ProjetoId = apontamento.ProjetoId,
            AnalistaId = apontamento.AnalistaId,
            Data = apontamento.Data,
            QuantidadeHoras = apontamento.QuantidadeHoras,
            Descricao = apontamento.Descricao,
            Status = apontamento.Status
        };

        return CreatedAtAction(
            nameof(ObterPorId),
            new { id = projeto.Id },
            apontamentoDto);
    }

    [HttpPatch("/api/apontamentos/{id:int}/status")]
    public async Task<ActionResult> AtualizarStatusApontamento(
    int id,
    AtualizarStatusApontamentoDto dto)
    {
        var apontamento = await _contexto.Apontamentos.FindAsync(id);

        if (apontamento is null)
        {
            return NotFound("Apontamento não encontrado.");
        }

        if (dto.Status == StatusApontamento.Pendente)
        {
            return BadRequest("O status deve ser Aprovado ou Rejeitado.");
        }

        if (apontamento.Status != StatusApontamento.Pendente)
        {
            return BadRequest("Apenas apontamentos pendentes podem ter o status alterado.");
        }

        apontamento.Status = dto.Status;

        await _contexto.SaveChangesAsync();

        return NoContent();
    }
}