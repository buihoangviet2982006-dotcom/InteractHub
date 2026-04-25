using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[Route("api/posts/{postId}/[controller]")]
[ApiController]
public class LikesController : ControllerBase
{
    private readonly ILikeService _likeService;

    public LikesController(ILikeService likeService)
    {
        _likeService = likeService;
    }

    [HttpPost]
    public async Task<IActionResult> ToggleLike(int postId, [FromBody] LikeToggleDto dto)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        try
        {
            if (postId != dto.PostId) return BadRequest("PostId không khớp");
            var isLiked = await _likeService.ToggleLikeAsync(userId, dto);
            return Ok(new { IsLiked = isLiked, Message = isLiked ? "Đã thích" : "Đã bỏ thích" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
