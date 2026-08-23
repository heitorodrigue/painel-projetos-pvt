namespace PainelProjetosPVT.Api.Dominio.Entidades;

public class Cliente
{
    public int Id { get; set; }

    public string Nome { get; set; } = string.Empty;

    public string Documento { get; set; } = string.Empty;

    public List<Projeto> Projetos { get; set; } = [];
}