using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

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
        try
        {
            var result = await _postService.CreatePostAsync(dto);
            return CreatedAtAction(nameof(GetPostById), new { id = result.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id, [FromQuery] int userId) // Lấy userId từ query tạm thời để test
    {
        var success = await _postService.DeletePostAsync(id, userId);
        if (!success) return BadRequest("Không thể xóa bài viết. Có thể bạn không có quyền hoặc bài viết không tồn tại.");
        
        return NoContent();
    }
}
