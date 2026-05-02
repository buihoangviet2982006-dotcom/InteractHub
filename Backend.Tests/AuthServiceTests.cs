using Backend.DTOs;
using Backend.Models;
using Backend.Repositories;
using Backend.Services;
using Microsoft.Extensions.Configuration;
using Moq;

namespace Backend.Tests;

public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly IConfiguration _config;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        _userRepoMock = new Mock<IUserRepository>();

        var inMemorySettings = new Dictionary<string, string> {
            {"JwtSettings:SecretKey", "super_secret_key_that_is_at_least_256_bits_long_for_hs256_algorithm"},
            {"JwtSettings:Issuer", "TestIssuer"},
            {"JwtSettings:Audience", "TestAudience"},
            {"JwtSettings:ExpiryMinutes", "60"}
        };

        _config = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        _authService = new AuthService(_userRepoMock.Object, _config);
    }

    [Fact]
    public async Task RegisterAsync_WithNewEmail_ReturnsToken()
    {
        // Arrange
        var dto = new RegisterDto
        {
            Email = "newuser@test.com",
            FullName = "New User",
            Password = "Password123"
        };

        _userRepoMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
            .ReturnsAsync((User)null); // Email is free

        _userRepoMock.Setup(repo => repo.AddAsync(It.IsAny<User>()))
            .Callback<User>(u => u.Id = 1) // Simulate DB generating ID
            .Returns(Task.CompletedTask);

        // Act
        var result = await _authService.RegisterAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal(1, result.UserId);
        Assert.Equal(dto.Email, result.Email);
        _userRepoMock.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Once);
        _userRepoMock.Verify(repo => repo.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_WithExistingEmail_ThrowsException()
    {
        // Arrange
        var dto = new RegisterDto
        {
            Email = "existing@test.com",
            FullName = "Existing User",
            Password = "Password123"
        };

        _userRepoMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
            .ReturnsAsync(new User { Email = dto.Email });

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _authService.RegisterAsync(dto));
        Assert.Equal("Email is already in use.", exception.Message);
        _userRepoMock.Verify(repo => repo.AddAsync(It.IsAny<User>()), Times.Never);
    }

    [Fact]
    public async Task LoginAsync_WithValidCredentials_ReturnsToken()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "user@test.com",
            Password = "ValidPassword"
        };

        var user = new User
        {
            Id = 1,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        _userRepoMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
            .ReturnsAsync(user);

        // Act
        var result = await _authService.LoginAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal(user.Id, result.UserId);
        Assert.Equal(user.Email, result.Email);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidEmail_ThrowsException()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "nonexistent@test.com",
            Password = "Password123"
        };

        _userRepoMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
            .ReturnsAsync((User)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(dto));
        Assert.Equal("Invalid email or password.", exception.Message);
    }

    [Fact]
    public async Task LoginAsync_WithInvalidPassword_ThrowsException()
    {
        // Arrange
        var dto = new LoginDto
        {
            Email = "user@test.com",
            Password = "WrongPassword"
        };

        var user = new User
        {
            Id = 1,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("CorrectPassword")
        };

        _userRepoMock.Setup(repo => repo.GetUserByEmailAsync(dto.Email))
            .ReturnsAsync(user);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Exception>(() => _authService.LoginAsync(dto));
        Assert.Equal("Invalid email or password.", exception.Message);
    }
}
