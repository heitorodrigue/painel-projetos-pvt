using Microsoft.EntityFrameworkCore;
using PainelProjetosPVT.Api.Infraestrutura.Persistencia;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddOpenApi();

builder.Services.AddDbContext<ContextoBanco>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("Banco")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();