using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchUsers([FromQuery] string q)
    {
        var users = await _userService.SearchUsersAsync(q);
        return Ok(users);
    }

    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSuggestions([FromQuery] int limit = 5)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int currentUserId))
            return Unauthorized("Invalid token.");

        var suggestions = await _userService.GetSuggestionsAsync(currentUserId, limit);
        return Ok(suggestions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserProfile(int id)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        int? currentUserId = null;
        if (int.TryParse(userIdString, out int parsedId))
        {
            currentUserId = parsedId;
        }

        var profile = await _userService.GetUserProfileAsync(id, currentUserId);
        if (profile == null)
            return NotFound("User not found");

        return Ok(profile);
    }

    [HttpPatch("me/avatar")]
    public async Task<IActionResult> UpdateAvatar([FromBody] UpdateAvatarRequest request)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int currentUserId))
            return Unauthorized();

        if (string.IsNullOrEmpty(request.AvatarUrl))
            return BadRequest("Avatar URL is required.");

        await _userService.UpdateAvatarAsync(currentUserId, request.AvatarUrl);
        return Ok(new { message = "Avatar updated successfully", avatarUrl = request.AvatarUrl });
    }

    [HttpPatch("me/cover")]
    public async Task<IActionResult> UpdateCover([FromBody] UpdateCoverRequest request)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int currentUserId))
            return Unauthorized();

        if (string.IsNullOrEmpty(request.CoverUrl))
            return BadRequest("Cover URL is required.");

        await _userService.UpdateCoverAsync(currentUserId, request.CoverUrl);
        return Ok(new { message = "Cover updated successfully", coverUrl = request.CoverUrl });
    }
}

public class UpdateAvatarRequest
{
    public string AvatarUrl { get; set; } = string.Empty;
}

public class UpdateCoverRequest
{
    public string CoverUrl { get; set; } = string.Empty;
}
