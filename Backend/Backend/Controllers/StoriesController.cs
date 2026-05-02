using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class StoriesController : ControllerBase
{
    private readonly IStoryService _storyService;

    public StoriesController(IStoryService storyService)
    {
        _storyService = storyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveStories()
    {
        var stories = await _storyService.GetActiveStoriesAsync();
        return Ok(stories);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStory([FromBody] StoryCreateDto dto)
    {
        var userIdString = User.FindFirst("UserId")?.Value;
        if (!int.TryParse(userIdString, out int userId))
            return Unauthorized("Invalid token.");

        try
        {
            var result = await _storyService.CreateStoryAsync(userId, dto);
            return Ok(result); 
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
