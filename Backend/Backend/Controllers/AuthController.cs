using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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

    [Authorize]
    [HttpPut("avatar")]
    public async Task<IActionResult> UpdateAvatar([FromBody] AvatarUpdateDto dto)
    {
        if (dto == null)
        {
            Console.WriteLine("UpdateAvatar failed: request body is null.");
            return BadRequest(new { message = "Request body is required." });
        }

        Console.WriteLine($"UpdateAvatar called. AvatarUrl='{dto.AvatarUrl ?? "<null>"}'");
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).Where(m => !string.IsNullOrEmpty(m));
            var errorMessage = string.Join(" | ", errors);
            Console.WriteLine($"UpdateAvatar model state invalid: {errorMessage}");
            return BadRequest(new { message = errorMessage });
        }

        if (string.IsNullOrWhiteSpace(dto.AvatarUrl))
        {
            Console.WriteLine("UpdateAvatar failed: AvatarUrl is empty.");
            return BadRequest(new { message = "AvatarUrl không được để trống." });
        }

        try
        {
            var userIdClaim = User.FindFirst("UserId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                Console.WriteLine($"UpdateAvatar failed: invalid UserId claim '{userIdClaim}'");
                return Unauthorized(new { message = "Unable to identify user." });
            }

            var result = await _authService.UpdateAvatarAsync(userId, dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"UpdateAvatar exception: {ex.Message}");
            return BadRequest(new { message = ex.Message });
        }
    }
}
