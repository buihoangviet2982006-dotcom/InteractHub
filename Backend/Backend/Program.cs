using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Register Repositories
builder.Services.AddScoped(typeof(Backend.Repositories.IRepository<>), typeof(Backend.Repositories.Repository<>));
builder.Services.AddScoped<Backend.Repositories.IUserRepository, Backend.Repositories.UserRepository>();
builder.Services.AddScoped<Backend.Repositories.IPostRepository, Backend.Repositories.PostRepository>();
builder.Services.AddScoped<Backend.Repositories.ICommentRepository, Backend.Repositories.CommentRepository>();
builder.Services.AddScoped<Backend.Repositories.ILikeRepository, Backend.Repositories.LikeRepository>();
builder.Services.AddScoped<Backend.Repositories.IHashtagRepository, Backend.Repositories.HashtagRepository>();

// Register Services
builder.Services.AddScoped<Backend.Services.IPostService, Backend.Services.PostService>();
builder.Services.AddScoped<Backend.Services.ICommentService, Backend.Services.CommentService>();
builder.Services.AddScoped<Backend.Services.ILikeService, Backend.Services.LikeService>();
builder.Services.AddScoped<Backend.Services.IHashtagService, Backend.Services.HashtagService>();

// Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapControllers();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "InteractHub API v1");
    });
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
