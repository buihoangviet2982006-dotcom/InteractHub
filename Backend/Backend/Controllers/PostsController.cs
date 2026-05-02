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

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetPostsByUser(int userId, [FromQuery] CursorPaginationDto pagination)
    {
        var result = await _postService.GetPostsByUserAsync(userId, pagination);
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
    public async Task<IActionResult> CreatePost([FromForm] PostCreateDto dto, IFormFile? image)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        byte[]? imageData = null;
        if (image != null && image.Length > 0)
        {
            if (image.Length > 5 * 1024 * 1024)
                return BadRequest("File size exceeds 5MB limit.");
            using var ms = new MemoryStream();
            await image.CopyToAsync(ms);
            imageData = ms.ToArray();
        }

        try
        {
            var result = await _postService.CreatePostAsync(userId, dto, imageData);
            return CreatedAtAction(nameof(GetPostById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePost(int id, [FromForm] PostUpdateDto dto, IFormFile? image)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        byte[]? imageData = null;
        if (image != null && image.Length > 0)
        {
            if (image.Length > 5 * 1024 * 1024)
                return BadRequest("File size exceeds 5MB limit.");
            using var ms = new MemoryStream();
            await image.CopyToAsync(ms);
            imageData = ms.ToArray();
        }

        try
        {
            var updated = await _postService.UpdatePostAsync(id, userId, dto, imageData);
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

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}/admin")]
    public async Task<IActionResult> DeletePostAdmin(int id)
    {
        var adminIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(adminIdString, out int adminId))
            return Unauthorized("Invalid token.");

        var success = await _postService.DeletePostAsAdminAsync(id, adminId);
        if (!success) return BadRequest("Không thể xóa bài viết (có thể không tồn tại).");
        
        return NoContent();
    }

    [HttpPost("{id}/share/{receiverId}")]
    public async Task<IActionResult> SharePost(int id, int receiverId)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        var success = await _postService.SharePostAsync(id, userId, receiverId);
        if (!success) return BadRequest("Không thể chia sẻ bài viết.");
        
        return Ok("Đã chia sẻ bài viết.");
    }
}
