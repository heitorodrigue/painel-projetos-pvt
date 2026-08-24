using Microsoft.EntityFrameworkCore;
using PainelProjetosPVT.Api.Aplicacao.Servicos;
using PainelProjetosPVT.Api.Infraestrutura.Persistencia;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ContextoBanco>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Banco")));

builder.Services.AddScoped<ServicoSaudeProjeto>();

var app = builder.Build();

using (var escopo = app.Services.CreateScope())
{
    var contexto = escopo.ServiceProvider
        .GetRequiredService<ContextoBanco>();

    InicializadorBanco.Inicializar(contexto);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();