using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

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
        try
        {
            if (postId != dto.PostId) return BadRequest("PostId không khớp");
            var isLiked = await _likeService.ToggleLikeAsync(dto);
            return Ok(new { IsLiked = isLiked, Message = isLiked ? "Đã thích" : "Đã bỏ thích" });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
