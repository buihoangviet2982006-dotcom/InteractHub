using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
             var result = await _authService.RegisterAsync(dto);
             return Ok(result);
        }
        catch (Exception ex)
        {
             return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        try
        {
             var result = await _authService.LoginAsync(dto);
             return Ok(result);
        }
        catch (Exception ex)
        {
             return Unauthorized(new { message = ex.Message });
        }
    }
    // Avatar update đã chuyển sang PATCH /api/users/me/avatar
}
