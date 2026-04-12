using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Route("api/posts/{postId}/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetComments(int postId)
    {
        var comments = await _commentService.GetCommentsByPostAsync(postId);
        return Ok(comments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateComment(int postId, [FromBody] CommentCreateDto dto)
    {
        try
        {
            if (postId != dto.PostId) return BadRequest("PostId không khớp.");
            var result = await _commentService.CreateCommentAsync(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteComment(int postId, int id, [FromQuery] int userId) // userId từ query tạm
    {
        var success = await _commentService.DeleteCommentAsync(id, userId);
        if (!success) return BadRequest("Không thể xóa bình luận.");
        return NoContent();
    }
}
