using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // Rất quan trọng để SignalR có thể kết nối
        });
});

// JWT Authentication Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "default_secret_key_if_not_found";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
    
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy => policy.RequireRole("Admin"));
});

// Register Repositories
builder.Services.AddScoped(typeof(Backend.Repositories.IRepository<>), typeof(Backend.Repositories.Repository<>));
builder.Services.AddScoped<Backend.Repositories.IUserRepository, Backend.Repositories.UserRepository>();
builder.Services.AddScoped<Backend.Repositories.IPostRepository, Backend.Repositories.PostRepository>();
builder.Services.AddScoped<Backend.Repositories.ICommentRepository, Backend.Repositories.CommentRepository>();
builder.Services.AddScoped<Backend.Repositories.ILikeRepository, Backend.Repositories.LikeRepository>();
builder.Services.AddScoped<Backend.Repositories.IHashtagRepository, Backend.Repositories.HashtagRepository>();
builder.Services.AddScoped<Backend.Repositories.IFriendshipRepository, Backend.Repositories.FriendshipRepository>();
builder.Services.AddScoped<Backend.Repositories.IStoryRepository, Backend.Repositories.StoryRepository>();
builder.Services.AddScoped<Backend.Repositories.IPostReportRepository, Backend.Repositories.PostReportRepository>();
builder.Services.AddScoped<Backend.Repositories.INotificationRepository, Backend.Repositories.NotificationRepository>();

// Register Services
builder.Services.AddScoped<Backend.Services.IPostService, Backend.Services.PostService>();
builder.Services.AddScoped<Backend.Services.ICommentService, Backend.Services.CommentService>();
builder.Services.AddScoped<Backend.Services.ILikeService, Backend.Services.LikeService>();
builder.Services.AddScoped<Backend.Services.IHashtagService, Backend.Services.HashtagService>();
builder.Services.AddScoped<Backend.Services.IFriendshipService, Backend.Services.FriendshipService>();
builder.Services.AddScoped<Backend.Services.IStoryService, Backend.Services.StoryService>();
builder.Services.AddScoped<Backend.Services.IPostReportService, Backend.Services.PostReportService>();
builder.Services.AddScoped<Backend.Services.IAuthService, Backend.Services.AuthService>();
builder.Services.AddScoped<Backend.Services.INotificationService, Backend.Services.NotificationService>();
builder.Services.AddScoped<Backend.Services.IUserService, Backend.Services.UserService>();

// Cấu hình SignalR
builder.Services.AddSignalR();
builder.Services.AddSingleton<Microsoft.AspNetCore.SignalR.IUserIdProvider, Backend.Hubs.CustomUserIdProvider>();

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

// Kích hoạt CORS (Phải đặt trước Authentication và Authorization)
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapHub<Backend.Hubs.NotificationHub>("/hubs/notifications");

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
