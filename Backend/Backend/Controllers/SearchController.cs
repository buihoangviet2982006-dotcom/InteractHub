using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[Authorize]
[Route("api/search")]
[ApiController]
public class SearchController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IPostService _postService;

    public SearchController(IUserService userService, IPostService postService)
    {
        _userService = userService;
        _postService = postService;
    }

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return Ok(new SearchResultDto());

        // Thực hiện tuần tự vì DbContext không hỗ trợ đa luồng trên cùng một instance
        var users = await _userService.SearchUsersAsync(q);
        var posts = await _postService.SearchPostsAsync(q);

        var result = new SearchResultDto
        {
            Users = users,
            Posts = posts
        };

        return Ok(result);
    }
}
