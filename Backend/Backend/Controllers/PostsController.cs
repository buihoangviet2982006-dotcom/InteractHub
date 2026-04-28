using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<IActionResult> GetPosts([FromQuery] CursorPaginationDto pagination)
    {
        var result = await _postService.GetPostsAsync(pagination);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPostById(int id)
    {
        var post = await _postService.GetPostByIdAsync(id);
        if (post == null) return NotFound("Bài viết không tồn tại.");
        return Ok(post);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePost([FromBody] PostCreateDto dto)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");
        try
        {
            var result = await _postService.CreatePostAsync(userId, dto);
            return CreatedAtAction(nameof(GetPostById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, [FromBody] PostUpdateDto dto)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        try
        {
            var updated = await _postService.UpdatePostAsync(id, userId, dto);
            return Ok(updated);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var success = await _postService.DeletePostAsync(id, userId);
        if (!success) return BadRequest("Không thể xóa bài viết. Có thể bạn không có quyền hoặc bài viết không tồn tại.");
        
        return NoContent();
    }
}
